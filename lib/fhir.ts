// HL7 FHIR R4 Interoperability Exporter for Stratum Clinical Edge
// Provides standard healthcare data structures for hospital integration & investor due-diligence

export interface StrongholdInput {
  id: string;
  name: string;
  age: number; // Care cadre level
  vitals: string; // Resources & physiological metrics
  notes: string; // Clinical intelligence
  lat?: number;
  lon?: number;
}

export function generateStrongholdFhirBundle(stronghold: StrongholdInput) {
  const timestamp = new Date().toISOString();
  const bundleId = `stratum-bundle-${stronghold.id.toLowerCase()}-${Date.now()}`;

  return {
    resourceType: "Bundle",
    id: bundleId,
    meta: {
      versionId: "1",
      lastUpdated: timestamp,
      profile: ["http://hl7.org/fhir/StructureDefinition/Bundle"],
    },
    type: "collection",
    timestamp: timestamp,
    entry: [
      // 1. Organization Resource
      {
        fullUrl: `urn:uuid:org-${stronghold.id}`,
        resource: {
          resourceType: "Organization",
          id: `org-${stronghold.id}`,
          identifier: [
            {
              system: "urn:ietf:rfc:3986",
              value: `urn:stratum:citadel:${stronghold.id}`,
            },
          ],
          active: true,
          name: stronghold.name,
          alias: ["Stratum Clinical Outpost", "Sovereign Edge Node"],
          telecom: [
            {
              system: "url",
              value: "https://ais-dev-ucamfjc2ipikqim5busbet-612821199205.us-west2.run.app",
            },
          ],
        },
      },

      // 2. HealthcareService Resource
      {
        fullUrl: `urn:uuid:service-${stronghold.id}`,
        resource: {
          resourceType: "HealthcareService",
          id: `service-${stronghold.id}`,
          active: true,
          providedBy: {
            reference: `urn:uuid:org-${stronghold.id}`,
            display: stronghold.name,
          },
          category: [
            {
              coding: [
                {
                  system: "http://terminology.hl7.org/CodeSystem/service-category",
                  code: "emergency",
                  display: "Emergency & Edge Triage Services",
                },
              ],
            },
          ],
          name: `${stronghold.name} Care Cadre`,
          comment: `Care Staffing Index: Level ${stronghold.age} (${stronghold.age * 100} clinicians active)`,
        },
      },

      // 3. Location Resource (Spatial Coordinates)
      {
        fullUrl: `urn:uuid:loc-${stronghold.id}`,
        resource: {
          resourceType: "Location",
          id: `loc-${stronghold.id}`,
          status: "active",
          name: `${stronghold.name} Spatial Sector`,
          position: {
            longitude: stronghold.lon ?? -72.85,
            latitude: stronghold.lat ?? 4.35,
          },
          managingOrganization: {
            reference: `urn:uuid:org-${stronghold.id}`,
            display: stronghold.name,
          },
        },
      },

      // 4. Observation Resource (Telemetry & Medical Provisions)
      {
        fullUrl: `urn:uuid:obs-${stronghold.id}`,
        resource: {
          resourceType: "Observation",
          id: `obs-${stronghold.id}`,
          status: "final",
          code: {
            coding: [
              {
                system: "http://loinc.org",
                code: "9843-8",
                display: "Clinical resource reserve and telemetry assessment",
              },
            ],
            text: "Edge Provisions & Reserve Index",
          },
          subject: {
            reference: `urn:uuid:org-${stronghold.id}`,
            display: stronghold.name,
          },
          effectiveDateTime: timestamp,
          valueString: stronghold.vitals,
          note: [
            {
              text: stronghold.notes,
              time: timestamp,
            },
          ],
        },
      },
    ],
  };
}

export function downloadJsonFile(data: object, filename: string) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
