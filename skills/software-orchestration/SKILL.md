---
name: software-orchestration
description: Advance a WOIA Software project through selected phase and Release Hygiene contracts while delegating each responsibility through WOIA Core to its exact provider and validating gate receipts.
license: MIT
---

# WOIA Software Orchestration

Use WOIA Core as the control-plane runtime. This skill owns only the Software phase graph and gate reconciliation.

## Flow

1. Read .woia/project.json and .woia/departments/software.json once.
2. Incrementally reconcile any phase applicability invalidated by new evidence.
3. Determine the next unsatisfied active phase or transition gate.
4. Resolve its contract from contracts/ and provider identity from that contract.
5. Ask woia-core project-runtime to ensure the provider/custom role is runtime-ready; do not duplicate Core provider inventory.
6. Delegate the capability to the exact WOIA Software custom role/provider skill.
7. Validate and persist dev.woia.execution-receipt/v1.
8. Advance only the corresponding gate and preserve unrelated valid evidence.
9. Continue until a genuine human boundary, blocker, release boundary, or completion.

## Critical invariants

- No root fallback for provider-owned phase work.
- Code Review, Testing, Security and Release QA keep independent role/gate ownership.
- Review and Testing final evidence target the same relevant source candidate.
- Release Hygiene runs after phase 17 and before freezing phases 18-22 candidate.
- A mutation after candidate freeze invalidates only materially affected evidence and creates a new candidate when required.
- Production deployment remains explicitly authorized where required.
