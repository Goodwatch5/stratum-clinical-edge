"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  Globe,
  Sun,
  Activity,
  Layers,
  Zap,
  RotateCw,
  Compass,
  Radio,
  Eye,
  Info,
  ChevronRight,
  Maximize2
} from "lucide-react";

export interface PocketNodeData {
  id: number;
  name: string;
  codename: string;
  role: string;
  lat: number;
  lng: number;
  status: "live" | "ready" | "deploying";
  energyKw: number;
  latencyMs: number;
  connections: number[];
  category: "core" | "interpretability" | "edge";
}

// All 20 Pockets Operational & Live Geo-distributed nodes (1-20 Full Mesh)
export const SOLAR_POCKET_NODES: PocketNodeData[] = [
  { id: 1, name: "Nexus Hub", codename: "NEXUS-01", role: "Central 3D Telemetry & Visualizer", lat: 37.7749, lng: -122.4194, status: "live", energyKw: 420.5, latencyMs: 12, connections: [2, 3, 4, 8, 13], category: "core" },
  { id: 2, name: "Intelligence Engine", codename: "INTEL-02", role: "Weight-Sparse AI Analytics", lat: 40.7128, lng: -74.0060, status: "live", energyKw: 880.2, latencyMs: 18, connections: [1, 3, 13, 14, 15], category: "core" },
  { id: 3, name: "Data Vault (Neon)", codename: "DATA-03", role: "PostgreSQL Automated Recovery", lat: 51.5074, lng: -0.1278, status: "live", energyKw: 310.4, latencyMs: 24, connections: [1, 2, 4, 11], category: "core" },
  { id: 4, name: "Sub-Second Sync", codename: "SYNC-04", role: "Real-time Node Mesh Replicator", lat: 52.5200, lng: 13.4050, status: "live", energyKw: 290.1, latencyMs: 15, connections: [1, 3, 8], category: "core" },
  { id: 5, name: "API Gateway", codename: "API-05", role: "Auto-REST Auth & Throttling", lat: 35.6762, lng: 139.6503, status: "live", energyKw: 340.8, latencyMs: 38, connections: [1, 6, 7], category: "core" },
  { id: 6, name: "Compute Mesh", codename: "COMPUTE-06", role: "Serverless 200+ Global Points", lat: 1.3521, lng: 103.8198, status: "live", energyKw: 560.0, latencyMs: 42, connections: [5, 15], category: "core" },
  { id: 7, name: "Distributed Storage", codename: "STOR-07", role: "Edge Asset & Content Network", lat: -33.8688, lng: 151.2093, status: "live", energyKw: 275.6, latencyMs: 65, connections: [1, 5, 18], category: "core" },
  { id: 8, name: "CI/CD Pipeline", codename: "PIPE-08", role: "GitLab/GitHub Automation & Deploy", lat: 47.6062, lng: -122.3321, status: "live", energyKw: 410.2, latencyMs: 14, connections: [1, 4, 9], category: "core" },
  { id: 9, name: "Uptime Monitor", codename: "MON-09", role: "24/7 Observability Health Poller", lat: 43.6532, lng: -79.3832, status: "live", energyKw: 180.9, latencyMs: 22, connections: [8, 10, 16], category: "core" },
  { id: 10, name: "Alert Dispatcher", codename: "ALERT-10", role: "Discord, Telegram & Mail Bus", lat: 48.8566, lng: 2.3522, status: "live", energyKw: 150.3, latencyMs: 20, connections: [9, 1], category: "core" },
  { id: 11, name: "Atlas Stream Analytics", codename: "ANALYT-11", role: "GDPR Real-Time Pipeline", lat: 28.6139, lng: 77.2090, status: "live", energyKw: 490.7, latencyMs: 52, connections: [3, 2, 16], category: "core" },
  { id: 12, name: "Documentation Matrix", codename: "DOCS-12", role: "GitBook & OpenAPI Truth Engine", lat: 55.7558, lng: 37.6173, status: "live", energyKw: 110.0, latencyMs: 31, connections: [1], category: "core" },
  { id: 13, name: "Sparse Circuits Engine", codename: "CIRC-13", role: "1000x Weight-Sparse Pruning", lat: 30.2672, lng: -97.7431, status: "live", energyKw: 720.0, latencyMs: 16, connections: [1, 2, 14, 15, 16], category: "interpretability" },
  { id: 14, name: "Activation Bridges", codename: "BRIDG-14", role: "AbsTopK Sparse-to-Dense Link", lat: 34.0522, lng: -118.2437, status: "live", energyKw: 610.4, latencyMs: 15, connections: [2, 13, 15], category: "interpretability" },
  { id: 15, name: "Sparse-Inference Core", codename: "SPARSE-15", role: "0.1% Density Edge Execution", lat: 45.5017, lng: -73.5673, status: "live", energyKw: 650.1, latencyMs: 19, connections: [6, 13, 14], category: "interpretability" },
  { id: 16, name: "Decision Path Tracer", codename: "INTERP-16", role: "20+ Python Circuit Visualizer", lat: 59.3293, lng: 18.0686, status: "live", energyKw: 380.0, latencyMs: 28, connections: [13, 11], category: "interpretability" },
  { id: 17, name: "Security & JWT Fortress", codename: "SEC-17", role: "Zero-Trust OAuth 2.0 Citadel", lat: 25.2048, lng: 55.2708, status: "live", energyKw: 240.5, latencyMs: 44, connections: [9, 1], category: "core" },
  { id: 18, name: "Backup & Disaster Vault", codename: "BAK-18", role: "Automated Snapshot Recovery", lat: -23.5505, lng: -46.6333, status: "live", energyKw: 195.0, latencyMs: 70, connections: [7, 3], category: "core" },
  { id: 19, name: "Global CDN Optimizer", codename: "OPT-19", role: "Intelligent Edge Cache & Comp", lat: 22.3193, lng: 114.1694, status: "live", energyKw: 320.0, latencyMs: 41, connections: [6, 5], category: "core" },
  { id: 20, name: "Scale & Load Dispatcher", codename: "SCALE-20", role: "Dynamic Health-Based Router", lat: 50.1109, lng: 8.6821, status: "live", energyKw: 280.0, latencyMs: 17, connections: [1, 5], category: "core" },
];

export default function SolarNexusGlobe({
  selectedNodeId,
  onSelectNode,
}: {
  selectedNodeId?: number;
  onSelectNode: (node: PocketNodeData) => void;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [showWireframe, setShowWireframe] = useState<boolean>(true);
  const [solarFlowRate, setSolarFlowRate] = useState<number>(8450); // MWh
  const [activeHoverNode, setActiveHoverNode] = useState<PocketNodeData | null>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Convert lat/lng to 3D Cartesian coordinates on sphere of radius R
  const latLngToVector3 = (lat: number, lng: number, radius: number): THREE.Vector3 => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    // SCENE
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0c0f14); // Deep celestial obsidian

    // CAMERA
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 5, 28);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // STARFIELD BACKGROUND (3,000+ particle stars per GitBook spec)
    const starCount = 3200;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const idx = i * 3;
      const rad = 60 + Math.random() * 120;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPositions[idx] = rad * Math.sin(phi) * Math.cos(theta);
      starPositions[idx + 1] = rad * Math.sin(phi) * Math.sin(theta);
      starPositions[idx + 2] = rad * Math.cos(phi);

      // Gold-tinted & ice-white celestial palette
      const isGold = Math.random() > 0.7;
      starColors[idx] = isGold ? 0.77 : 0.9;
      starColors[idx + 1] = isGold ? 0.63 : 0.92;
      starColors[idx + 2] = isGold ? 0.49 : 1.0;
    }

    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute("color", new THREE.BufferAttribute(starColors, 3));
    const starMaterial = new THREE.PointsMaterial({
      size: 0.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // GLOBE GROUP
    const globeGroup = new THREE.Group();
    globeGroupRef.current = globeGroup;
    scene.add(globeGroup);

    // 1. Core Sphere (Dark Navy/Slate with soft gloss)
    const radius = 9;
    const sphereGeo = new THREE.SphereGeometry(radius, 48, 48);
    const sphereMat = new THREE.MeshPhongMaterial({
      color: 0x111923,
      emissive: 0x070c12,
      specular: 0xc5a27d,
      shininess: 18,
      transparent: true,
      opacity: 0.96,
    });
    const earthMesh = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(earthMesh);

    // 2. Wireframe Overlay (per GitBook specification)
    const wireGeo = new THREE.WireframeGeometry(sphereGeo);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x2a394a,
      transparent: true,
      opacity: 0.35,
    });
    const wireLines = new THREE.LineSegments(wireGeo, wireMat);
    wireLines.name = "wireframeMesh";
    globeGroup.add(wireLines);

    // 3. Atmosphere glow rim
    const atmoGeo = new THREE.SphereGeometry(radius * 1.08, 36, 36);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0xc5a27d,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    globeGroup.add(atmoMesh);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffeedd, 1.8);
    sunLight.position.set(30, 20, 25);
    scene.add(sunLight);

    const rimLight = new THREE.PointLight(0xc5a27d, 2.0, 50);
    rimLight.position.set(-20, -10, -10);
    scene.add(rimLight);

    // 5. Pocket Nodes (17+ nodes with glowing markers)
    const nodeMeshes: { mesh: THREE.Mesh; halo: THREE.Mesh; nodeData: PocketNodeData }[] = [];

    SOLAR_POCKET_NODES.forEach((node) => {
      const pos = latLngToVector3(node.lat, node.lng, radius * 1.02);

      // Node core pin
      const pinColor =
        node.category === "interpretability"
          ? 0x60a5fa // Sky blue for interpretability circuits
          : node.status === "live"
          ? 0x34d399 // Emerald for live
          : 0xc5a27d; // Muted Gold for ready

      const pinGeo = new THREE.SphereGeometry(0.32, 16, 16);
      const pinMat = new THREE.MeshStandardMaterial({
        color: pinColor,
        emissive: pinColor,
        emissiveIntensity: 0.8,
        roughness: 0.2,
      });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(pos);
      pinMesh.userData = { nodeId: node.id };
      globeGroup.add(pinMesh);

      // Node pulsing halo ring
      const ringGeo = new THREE.RingGeometry(0.45, 0.65, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: pinColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos.clone().multiplyScalar(1.005));
      ringMesh.lookAt(pos.clone().multiplyScalar(2));
      globeGroup.add(ringMesh);

      nodeMeshes.push({ mesh: pinMesh, halo: ringMesh, nodeData: node });
    });

    // 6. Dynamic Connection Splines between active nodes (GitBook feature)
    const drawnPairs = new Set<string>();
    const splineLines: THREE.Line[] = [];

    SOLAR_POCKET_NODES.forEach((source) => {
      const sourceVec = latLngToVector3(source.lat, source.lng, radius * 1.02);

      source.connections.forEach((targetId) => {
        const target = SOLAR_POCKET_NODES.find((n) => n.id === targetId);
        if (!target) return;

        const pairKey = [Math.min(source.id, target.id), Math.max(source.id, target.id)].join("-");
        if (drawnPairs.has(pairKey)) return;
        drawnPairs.add(pairKey);

        const targetVec = latLngToVector3(target.lat, target.lng, radius * 1.02);

        // Arc midpoint pushed outward for high-elevation orbital arc
        const midPoint = sourceVec.clone().add(targetVec).multiplyScalar(0.5);
        const distance = sourceVec.distanceTo(targetVec);
        const arcElevation = 1.0 + distance * 0.04;
        midPoint.normalize().multiplyScalar(radius * arcElevation);

        const curve = new THREE.QuadraticBezierCurve3(sourceVec, midPoint, targetVec);
        const points = curve.getPoints(28);
        const curveGeo = new THREE.BufferGeometry().setFromPoints(points);

        const isInterpretabilityArc =
          source.category === "interpretability" || target.category === "interpretability";

        const curveMat = new THREE.LineBasicMaterial({
          color: isInterpretabilityArc ? 0x60a5fa : 0xc5a27d,
          transparent: true,
          opacity: 0.45,
          linewidth: 1,
        });

        const line = new THREE.Line(curveGeo, curveMat);
        globeGroup.add(line);
        splineLines.push(line);
      });
    });

    // Raycasting for interactivity
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handlePointerDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / height) * 2 + 1;

      if (isDragging && globeGroupRef.current) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        globeGroupRef.current.rotation.y += deltaX * 0.005;
        globeGroupRef.current.rotation.x += deltaY * 0.005;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }

      // Check hover on nodes
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        nodeMeshes.map((m) => m.mesh),
        false
      );

      if (intersects.length > 0) {
        const hitId = intersects[0].object.userData.nodeId;
        const hitNode = SOLAR_POCKET_NODES.find((n) => n.id === hitId);
        if (hitNode) {
          container.style.cursor = "pointer";
          setActiveHoverNode(hitNode);
          return;
        }
      } else {
        container.style.cursor = isDragging ? "grabbing" : "default";
      }
    };

    const handlePointerUp = (e: MouseEvent) => {
      if (isDragging) {
        isDragging = false;
        // If not dragged far, treat as click
        const rect = container.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(
          nodeMeshes.map((m) => m.mesh),
          false
        );
        if (intersects.length > 0) {
          const hitId = intersects[0].object.userData.nodeId;
          const hitNode = SOLAR_POCKET_NODES.find((n) => n.id === hitId);
          if (hitNode) onSelectNode(hitNode);
        }
      }
    };

    container.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);

    // ANIMATION LOOP (Smooth 60 FPS per GitBook requirements)
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Rotate starfield slowly
      starField.rotation.y = elapsedTime * 0.015;

      // Auto-rotation of globe
      if (autoRotate && globeGroupRef.current && !isDragging) {
        globeGroupRef.current.rotation.y += 0.0025;
      }

      // Pulse halos
      nodeMeshes.forEach((item, idx) => {
        const pulse = 1.0 + Math.sin(elapsedTime * 3 + idx) * 0.25;
        item.halo.scale.set(pulse, pulse, 1);
      });

      // Animate spline opacity pulse
      splineLines.forEach((spline, idx) => {
        const mat = spline.material as THREE.LineBasicMaterial;
        mat.opacity = 0.35 + Math.sin(elapsedTime * 2 + idx * 0.4) * 0.2;
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      renderer.dispose();
    };
  }, [autoRotate, onSelectNode]);

  // Wireframe toggle effect
  useEffect(() => {
    if (globeGroupRef.current) {
      const wire = globeGroupRef.current.getObjectByName("wireframeMesh");
      if (wire) wire.visible = showWireframe;
    }
  }, [showWireframe]);

  return (
    <div className="relative w-full bg-[#0c0f14] border border-[#c5a27d]/30 overflow-hidden shadow-2xl rounded-sm">
      {/* HUD Header Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-[#0c0f14]/80 backdrop-blur-md border-b border-[#c5a27d]/20 px-4 py-2.5 flex items-center justify-between text-white">
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <div>
            <div className="text-xs font-serif font-bold text-[#c5a27d] flex items-center space-x-1.5">
              <span>THE SOLAR NEXUS — 3D ORBITAL GLOBE</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 bg-[#c5a27d]/20 text-[#c5a27d] border border-[#c5a27d]/40">
                17 CONNECTED POCKETS
              </span>
            </div>
            <div className="text-[10px] font-mono text-neutral-400">
              Connecting Humanity Solarly • Three.js 60FPS Dynamic Engine
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-2.5 py-1 text-[11px] font-mono flex items-center space-x-1.5 border transition-all ${
              autoRotate
                ? "bg-[#c5a27d] text-[#1a1a1a] border-[#c5a27d] font-bold"
                : "bg-black/40 text-neutral-300 border-neutral-700 hover:border-[#c5a27d]"
            }`}
          >
            <RotateCw className={`w-3 h-3 ${autoRotate ? "animate-spin" : ""}`} />
            <span>Auto-Rotate {autoRotate ? "ON" : "OFF"}</span>
          </button>

          <button
            onClick={() => setShowWireframe(!showWireframe)}
            className={`px-2.5 py-1 text-[11px] font-mono flex items-center space-x-1.5 border transition-all ${
              showWireframe
                ? "bg-[#1e293b] text-sky-300 border-sky-400"
                : "bg-black/40 text-neutral-400 border-neutral-700"
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Wireframe</span>
          </button>
        </div>
      </div>

      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="w-full h-[520px] cursor-grab active:cursor-grabbing" />

      {/* Hover/Selected Node HUD Panel */}
      {activeHoverNode && (
        <div className="absolute bottom-4 left-4 z-20 max-w-sm bg-[#111923]/90 backdrop-blur-md border border-[#c5a27d] p-3 text-white shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between border-b border-neutral-700 pb-1.5 mb-2">
            <div className="flex items-center space-x-2">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  activeHoverNode.status === "live"
                    ? "bg-emerald-400"
                    : activeHoverNode.category === "interpretability"
                    ? "bg-sky-400"
                    : "bg-[#c5a27d]"
                }`}
              />
              <span className="font-serif font-bold text-xs text-[#FAF7F2]">
                Pocket {activeHoverNode.id}: {activeHoverNode.name}
              </span>
            </div>
            <span className="text-[9px] font-mono uppercase px-1 py-0.5 bg-black/60 text-[#c5a27d] border border-[#c5a27d]/40">
              {activeHoverNode.codename}
            </span>
          </div>

          <div className="space-y-1 text-[11px] font-mono text-neutral-300">
            <p className="text-neutral-400 text-[10px] leading-tight">{activeHoverNode.role}</p>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-neutral-800">
              <div>
                <span className="text-[9px] text-neutral-500 uppercase block">Telemetry Coord</span>
                <span>
                  {activeHoverNode.lat.toFixed(2)}°, {activeHoverNode.lng.toFixed(2)}°
                </span>
              </div>
              <div>
                <span className="text-[9px] text-neutral-500 uppercase block">Solar Power</span>
                <span className="text-amber-400 font-bold">{activeHoverNode.energyKw} kW</span>
              </div>
              <div>
                <span className="text-[9px] text-neutral-500 uppercase block">Latency</span>
                <span className="text-emerald-400">{activeHoverNode.latencyMs} ms</span>
              </div>
              <div>
                <span className="text-[9px] text-neutral-500 uppercase block">Connections</span>
                <span className="text-sky-400">{activeHoverNode.connections.length} mesh arcs</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectNode(activeHoverNode)}
            className="mt-2.5 w-full py-1 text-center bg-[#c5a27d] hover:bg-[#d4b38e] text-[#1a1a1a] font-mono text-[10px] font-bold uppercase transition-colors"
          >
            Inspect Pocket in 20-Registry →
          </button>
        </div>
      )}

      {/* Orbit Helper Guide */}
      <div className="absolute bottom-4 right-4 z-20 pointer-events-none text-right">
        <span className="text-[10px] font-mono text-neutral-400 bg-black/60 px-2 py-1 border border-neutral-800 backdrop-blur-xs">
          Left-Click &amp; Drag to Orbit • Click Node to Inspect
        </span>
      </div>
    </div>
  );
}
