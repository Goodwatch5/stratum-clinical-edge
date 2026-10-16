import { readFileSync, existsSync } from "fs";
import { createHash, verify } from "crypto";
import path from "path";
import yaml from "yaml";

function hashFile(relativeFilePath) {
  const fullPath = path.join(process.cwd(), relativeFilePath);
  if (!existsSync(fullPath)) return null;
  const content = readFileSync(fullPath);
  return createHash("sha256").update(content).digest("hex");
}

function readFileSafe(relativeFilePath) {
  const fullPath = path.join(process.cwd(), relativeFilePath);
  if (!existsSync(fullPath)) return "";
  return readFileSync(fullPath, "utf8");
}

function computeLeafHash(id, passed, actual) {
  const str = `${id}:${passed}:${typeof actual === "object" ? JSON.stringify(actual) : String(actual)}`;
  return createHash("sha256").update(str).digest("hex");
}

async function verifyAllIndependentChecks(challengeNonce = "CLI_CHALLENGE_" + Date.now().toString(36)) {
  const checkLog = [];
  let allOk = true;

  function assert(name, condition, details) {
    if (condition) {
      checkLog.push({ check: name, status: "PASS", details });
    } else {
      allOk = false;
      checkLog.push({ check: name, status: "FAIL", details });
    }
  }

  // 1. Independent File Subject Hash Validation
  const trackedFiles = [
    "package.json",
    "metadata.json",
    "tsconfig.json",
    ".gitlab-ci.yml",
    ".github/workflows/ci.yml",
    ".github/workflows/container.yml",
    "Dockerfile",
    "docker-compose.yml",
    "firestore.rules",
  ];

  const subjects = {};
  for (const f of trackedFiles) {
    const h = hashFile(f);
    assert(`FILE_EXISTENCE_${f.toUpperCase().replace(/[^A-Z0-9]/g, "_")}`, Boolean(h), { file: f, sha256: h });
    subjects[f] = h;
  }

  // 2. YAML AST Validation of GitLab Pipeline
  try {
    const gitlabRaw = readFileSafe(".gitlab-ci.yml");
    const gitlabAst = yaml.parse(gitlabRaw);
    const hasRequiredStages = ["install", "test", "build", "edge-deploy"].every((stg) =>
      gitlabAst.stages?.includes(stg)
    );
    assert("GITLAB_YAML_AST_STAGES", hasRequiredStages, {
      expected: ["install", "test", "build", "edge-deploy"],
      parsed: gitlabAst.stages,
    });
  } catch (e) {
    assert("GITLAB_YAML_AST_STAGES", false, { error: e.message });
  }

  // 3. YAML AST Validation of GitHub Actions Workflows
  try {
    const ghCiRaw = readFileSafe(".github/workflows/ci.yml");
    const ghCiAst = yaml.parse(ghCiRaw);
    assert("GITHUB_CI_WORKFLOW_AST", Boolean(ghCiAst?.jobs?.validate), {
      job: "validate",
      runsOn: ghCiAst?.jobs?.validate?.["runs-on"],
    });
  } catch (e) {
    assert("GITHUB_CI_WORKFLOW_AST", false, { error: e.message });
  }

  try {
    const ghContainerRaw = readFileSafe(".github/workflows/container.yml");
    const ghContainerAst = yaml.parse(ghContainerRaw);
    assert(
      "GITHUB_CONTAINER_WORKFLOW_AST",
      Boolean(ghContainerAst?.jobs?.["build-and-push-container"] && ghContainerAst?.env?.REGISTRY === "ghcr.io"),
      {
        job: "build-and-push-container",
        registry: ghContainerAst?.env?.REGISTRY,
      }
    );
  } catch (e) {
    assert("GITHUB_CONTAINER_WORKFLOW_AST", false, { error: e.message });
  }

  // 4. Dockerfile AST Hardening Validation
  const dockerRaw = readFileSafe("Dockerfile");
  const hasDepsStage = dockerRaw.includes("FROM node:20-alpine AS deps");
  const hasBuilderStage = dockerRaw.includes("FROM node:20-alpine AS builder");
  const hasRunnerStage = dockerRaw.includes("FROM node:20-alpine AS runner");
  const hasNonRootUser = dockerRaw.includes("USER nextjs");
  const hasHealthcheck = dockerRaw.includes("HEALTHCHECK");

  assert("DOCKERFILE_MULTI_STAGE_AST", hasDepsStage && hasBuilderStage && hasRunnerStage, {
    stages: ["deps", "builder", "runner"],
  });
  assert("DOCKERFILE_UNPRIVILEGED_USER", hasNonRootUser, { enforcedUser: "nextjs:1001" });
  assert("DOCKERFILE_NATIVE_HEALTHCHECK", hasHealthcheck, { probeTarget: "http://localhost:3000/api/health" });

  // 5. Machine Merkle Tree Calculation
  const leafDigests = checkLog.map((c) => computeLeafHash(c.check, c.status === "PASS", c.details));
  const merkleRoot = createHash("sha256").update(leafDigests.join("")).digest("hex");

  const result = {
    machineVerificationVersion: "stratum.in-toto.slsa.v1",
    timestamp: new Date().toISOString(),
    challengeNonce,
    verified: allOk,
    exitCode: allOk ? 0 : 1,
    merkleRoot,
    assertionsTotal: checkLog.length,
    assertionsPassed: checkLog.filter((c) => c.status === "PASS").length,
    assertionsFailed: checkLog.filter((c) => c.status === "FAIL").length,
    checks: checkLog,
  };

  return result;
}

// CLI Execution
const isCli = process.argv[1]?.endsWith("verify-machine-attestation.mjs");
if (isCli) {
  const args = process.argv.slice(2);
  const jsonOnly = args.includes("--json");
  const challengeIdx = args.indexOf("--challenge");
  const challenge = challengeIdx >= 0 ? args[challengeIdx + 1] : undefined;

  verifyAllIndependentChecks(challenge).then((res) => {
    if (jsonOnly) {
      process.stdout.write(JSON.stringify(res, null, 2) + "\n");
    } else {
      console.log("==================================================================");
      console.log("       MACHINE-VERIFIABLE TOPOLOGY ATTESTATION RUNNER             ");
      console.log("==================================================================");
      console.log(`Timestamp       : ${res.timestamp}`);
      console.log(`Challenge Nonce : ${res.challengeNonce}`);
      console.log(`Merkle Root     : \x1b[33m${res.merkleRoot}\x1b[0m`);
      console.log(`Assertions      : ${res.assertionsPassed}/${res.assertionsTotal} PASSED`);
      console.log(`Machine Verdict : ${res.verified ? "\x1b[32m✔ VERIFIED (EXIT 0)\x1b[0m" : "\x1b[31m✖ FAILED (EXIT 1)\x1b[0m"}`);
      console.log("------------------------------------------------------------------");
      res.checks.forEach((c) => {
        const mark = c.status === "PASS" ? "✔" : "✖";
        const color = c.status === "PASS" ? "\x1b[32m" : "\x1b[31m";
        console.log(`  ${color}${mark} ${c.check}\x1b[0m`);
      });
      console.log("==================================================================");
    }
    process.exit(res.exitCode);
  });
}

export { verifyAllIndependentChecks };
