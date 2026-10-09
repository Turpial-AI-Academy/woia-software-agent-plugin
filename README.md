# WOIA Software

WOIA Software is the Software department orchestrator for WOIA v0.5.7, refactored from ASPS 2.6.0.

## Architecture

- woia-core owns Project bootstrap, provider/install/update/runtime generations, Tasks/agents/receipts/effects/improvements/overlays.
- woia-software owns Software methodology: phase selection, software contracts, gates, preserve-first adoption, Release Hygiene and software-specific auxiliary triggers.
- provider plugins own capability execution.

## Methodology

23 delivery phases remain stable:

1 Discovery; 2 Business Rules; 3 Requirements; 4 UX/UI; 5 Stack; 6 Architecture; 7 Technical Design; 8 Development Conventions; 9 Planning; 10 Repository Environment; 11 CI/CD; 12 SPEC; 13 Tasks; 14 Development; 15 Code Review; 16 Testing; 17 Git Integration; Release Hygiene; 18 Release QA; 19 Security; 20 Release Preparation; 21 Observability; 22 Documentation; 23 Deployment.

The methodology is adaptive: each phase is required, conditional, or not-applicable from current project evidence.

## Consumer entry

A user should be able to install the WOIA Software marketplace/orchestrator and say: “Use WOIA Software for this project.” The root agent uses woia-core for setup/providers/custom agents and WOIA Software for methodology.

## Migration

Existing ASPS Projects are migrated preserve-first. Legacy .asps state remains immutable evidence; the new state lives under .woia.

## Maintenance

Edit only this canonical repository. Keep `plugin.json`, `package.json` and `dev.woia/manifest.json` versions aligned. From the canonical WOIA Ecosystem repository, run `mise run plugin:certify-thin --repo <absolute-plugin-repository>`, then use its release preparation/publication tasks. Install and update consumers from immutable published artifacts; keep Project personalization in overlays.
