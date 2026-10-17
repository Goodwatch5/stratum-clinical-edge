# Stratum Zero-Trust Firestore Security Specification

This document details the security posture, data invariants, and verification strategies for the decentralized Stratum Clinical Edge platform database.

## 1. Core Data Invariants

1. **Clinician Ownership Boundary**: Patients and Audit logs strictly belong to the clinician (`ownerId`) who generated the record. Unauthorized cross-tenant reading or modifying is strictly blocked.
2. **Strict Document Schema Validation**: Every document created or updated must pass the custom schema validation helper checks (e.g. valid fields, types, string length bounds).
3. **Temporal Integrity**: The `createdAt` and `updatedAt` timestamps must strictly utilize Firebase `request.time` server timestamps.
4. **ID Sanitization**: All path parameters and unique identifiers matching patients must adhere to secure string lengths and formatting patterns to prevent resource poisoning.

---

## 2. Secure Rule Verifications (Adversarial Targets)

These specific scenarios represent our security invariants:

1. **Identity Spoofing**: Omit `ownerId` or set to someone else's UID -> blocked.
2. **Field Overflow**: Long string field sizes exceeding bounds -> blocked.
3. **Ghost Fields**: Extra properties injected into documents -> blocked.
4. **Temporal Manipulation**: Custom client timestamp bypasses -> blocked.
5. **Cross-Tenant Read**: Accessing another user's patient profile -> blocked.
