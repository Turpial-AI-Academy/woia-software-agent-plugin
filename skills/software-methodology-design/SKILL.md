---
name: software-methodology-design
description: Select and reconcile the minimum useful WOIA Software phase set from project type, risk, repository evidence, delivery model, data, infrastructure, and existing practices.
license: MIT
---

# WOIA Software Methodology Design

Select each of the 23 software phases as required, conditional, or not_applicable from current project evidence. Profiles are seeds, not rigid checklists.

## Principles

- Minimum sufficient evidence.
- Preserve healthy existing architecture/tooling/delivery controls.
- Problem and requirements before speculative implementation.
- A skipped phase never means a relevant risk is skipped; record where the risk is covered.
- Provider/runtime installation mechanics belong to woia-core project-runtime.

## Workflow

1. Inspect project/repository state and classify greenfield, existing, or production.
2. Select a profile seed from registry/profiles.json.
3. Reconcile every phase classification only as deeply as current evidence requires.
4. Activate Release Hygiene before release-candidate freeze.
5. Evaluate auxiliary recommendations only from concrete triggers.
6. Persist software methodology state under .woia/departments/software.json.
7. Hand the active contract/provider set to woia-core project-runtime for provider readiness/materialization.

Re-evaluate only classifications whose reason becomes invalidated by later evidence; do not rescan all 23 phases on every turn.
