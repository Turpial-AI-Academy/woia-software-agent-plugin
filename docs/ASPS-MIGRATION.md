# ASPS 2.x migration

WOIA Software supports preserve-first migration from legacy `.asps/methodology.json`.

## Preserved

- profile seed;
- all 23 phase applicability states and reasons;
- gate states;
- receipt IDs/evidence pointers;
- Release Hygiene transition gate;
- evidence-triggered auxiliary recommendations;
- exact legacy ASPS version/path as migration provenance.

## Deliberately not copied

- PluginStore/discoverability/install/enablement/runtime readiness;
- materialized custom-agent generation;
- current runtime restart state;
- install authorization tokens/plans.

Those are runtime facts and are recalculated by `woia-core` in the new environment.

## Deterministic helper

`skills/software-adoption/scripts/migrate-asps-state.mjs --input <legacy-methodology.json> --output <.woia/departments/software.json>`

The helper accepts only ASPS 2.x and fails closed on unsupported/contradictory phase/gate states. It does not delete or modify the legacy `.asps` tree.
