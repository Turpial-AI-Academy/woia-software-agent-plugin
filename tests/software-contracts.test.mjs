import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import Ajv2020 from "ajv/dist/2020.js";
import { migrateAspsState } from "../skills/software-adoption/scripts/migrate-asps-state.mjs";

const ROOT=path.resolve(".");

test("software registry has exactly 23 ordered phases and one contract per phase", async()=>{
  const registry=JSON.parse(await readFile("registry/phases.json","utf8"));
  const phases=registry.phases;
  assert.equal(phases.length,23);
  assert.deepEqual(phases.map(p=>p.number),Array.from({length:23},(_,i)=>i+1));
  for(const phase of phases){
    const contractPath=path.join(ROOT,"contracts",phase.capability+".json");
    await access(contractPath);
    const contract=JSON.parse(await readFile(contractPath,"utf8"));
    assert.equal(contract.phase,phase.number);
    assert.equal(contract.capability,phase.capability);
    assert.equal(contract.provider_plugin.marketplace,"woia-marketplace-software");
    assert.match(contract.provider_plugin.name,/^woia-software-/);
  }
});

test("Release Hygiene remains a transition gate and not a numbered phase", async()=>{
  const registry=JSON.parse(await readFile("registry/phases.json","utf8"));
  assert.ok(!registry.phases.some(p=>p.capability==="repository-hygiene"));
  const hygiene=JSON.parse(await readFile("contracts/repository-hygiene.json","utf8"));
  assert.equal(hygiene.transition_gate,"release-hygiene");
  assert.equal(hygiene.provider_plugin.name,"woia-software-repository-hygiene");
});

test("ASPS auxiliaries reconcile into WOIA provider identities including shared ComfyUI", async()=>{
  const aux=JSON.parse(await readFile("registry/auxiliary-capabilities.json","utf8"));
  const map=Object.fromEntries(aux.capabilities.map(x=>[x.name,x.plugin]));
  assert.equal(map["delivery-sandbox"].name,"woia-software-delivery-sandbox");
  assert.equal(map["windows-app-trust"].name,"woia-software-windows-app-trust");
  assert.equal(map["comfyui-local"].name,"woia-comfyui-local");
  for(const plugin of Object.values(map)) assert.equal(plugin.marketplace,"woia-marketplace-software");
});

test("ASPS 2.x migration preserves methodology evidence and drops stale runtime readiness", async()=>{
  const phases=Array.from({length:23},(_,i)=>({
    number:i+1,
    capability:"phase-"+(i+1),
    contract:"phase-"+(i+1)+"/v1",
    status:i===0?"required":"conditional",
    reason_or_trigger:"fixture",
    gate_status:i===0?"pass":"pending",
    gate_evidence:{provenance:i===0?"provider-receipt":"none",receipt_id:i===0?"receipt-1":null,evidence:i===0?["evidence://1"]:[]}
  }));
  const legacy={
    schema_version:"2.3.0",
    asps_version:"2.6.0",
    project:{profile_seed:"existing-project"},
    phases,
    plugin_resolution:{status:"runtime_ready",verified:["legacy-provider"]},
    custom_agents:{materialized_generation:42,loaded_generation:42},
    orchestration:{status:"runtime_ready"},
    transition_gates:[{key:"release-hygiene",capability:"repository-hygiene",contract:"repository-hygiene/v1",status:"required",gate_status:"pending",gate_evidence:{receipt_id:null,evidence:[]}}],
    auxiliary_capabilities:{recommendations:[{name:"comfyui-local",responsibility:"ux-ui",trigger:"requested-creative-asset"}]},
    updated:"2026-10-03"
  };
  const migrated=migrateAspsState(legacy);
  assert.equal(migrated.software_version,"0.5.0");
  assert.equal(migrated.migration.source_version,"2.6.0");
  assert.equal(migrated.phases[0].gate_status,"satisfied");
  assert.equal(migrated.phases[0].receipt_ref,"receipt-1");
  assert.deepEqual(migrated.phases[0].adopted_evidence,["evidence://1"]);
  assert.equal("plugin_resolution" in migrated,false);
  assert.equal("custom_agents" in migrated,false);
  assert.equal(migrated.auxiliary_capabilities.recommendations[0].name,"comfyui-local");

  const schema=JSON.parse(await readFile("dev.woia/schemas/software-methodology-state.schema.json","utf8"));
  const ajv=new Ajv2020({strict:false,allErrors:true,formats:{"date-time":true}});
  const validate=ajv.compile(schema);
  assert.equal(validate(migrated),true,JSON.stringify(validate.errors));
});
