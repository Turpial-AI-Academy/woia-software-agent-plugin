---
name: software-adoption
description: Adopt WOIA Software into an existing or production repository preserve-first, including safe migration from legacy ASPS 2.x state without deleting historical evidence.
license: MIT
---

# WOIA Software Adoption

Start read-only. Existing/production repositories are evidence sources, not greenfield templates.

## Existing repository adoption

1. Inventory current project truth, instructions, architecture, environment, delivery/release/deployment controls and current evidence.
2. Map healthy existing evidence to WOIA Software phase gates with explicit adopted-existing provenance.
3. Add only the minimum missing WOIA state/provider integration.
4. Keep production-impacting changes behind their own authorization.

## Legacy ASPS 2.x migration

Do not rewrite or delete .asps history.

1. Read .asps/methodology.json and validate that it is an ASPS 2.x state.
2. Create .woia project state through woia-core if missing.
3. Use the bundled migrate-asps-state deterministic helper to create .woia/departments/software.json.
4. Preserve phase status, reasons, gate status and receipt/evidence pointers where semantically valid.
5. Preserve Release Hygiene transition state.
6. Record source ASPS version/path and migration status.
7. Re-resolve provider runtime readiness from the WOIA Software marketplace through Core; do not blindly copy old PluginStore readiness.
8. Keep legacy .asps receipts/files immutable as historical evidence until an explicit archival policy exists.
9. Materialize WOIA roles/config, require a fresh runtime generation, then resume.

A migration must fail closed if legacy state is contradictory or cannot be mapped without inventing evidence.
