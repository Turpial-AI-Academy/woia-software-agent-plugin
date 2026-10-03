import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

function parseArgs(argv){
  let input=null, output=null;
  for(let i=0;i<argv.length;i++){
    if(argv[i]==="--input"){input=argv[++i];continue}
    if(argv[i]==="--output"){output=argv[++i];continue}
    throw new Error("unknown argument: "+argv[i]);
  }
  if(!input||!output) throw new Error("--input and --output are required");
  return {input:path.resolve(input),output:path.resolve(output)};
}
function assert(condition,message){if(!condition)throw new Error(message)}
function normalizeStatus(value){
  if(value==="not-applicable") return "not_applicable";
  if(["required","conditional","not_applicable"].includes(value)) return value;
  throw new Error("unsupported legacy phase status: "+value);
}
function normalizeGate(value){
  if(value==="pass"||value==="satisfied") return "satisfied";
  if(value==="blocked"||value==="failed") return "blocked";
  if(value==="pending"||value==null) return "pending";
  throw new Error("unsupported legacy gate_status: "+value);
}
function evidenceOf(gate){
  const e=gate?.gate_evidence;
  if(!e||typeof e!=="object") return [];
  return Array.isArray(e.evidence)?e.evidence.filter(v=>typeof v==="string"&&v):[];
}
function receiptOf(gate){
  const id=gate?.gate_evidence?.receipt_id;
  return typeof id==="string"&&id?id:null;
}
export function migrateAspsState(legacy,{sourcePath=".asps/methodology.json"}={}){
  assert(legacy&&typeof legacy==="object","legacy ASPS state must be an object");
  assert(typeof legacy.schema_version==="string"&&legacy.schema_version.startsWith("2."),"only ASPS 2.x methodology state is supported");
  assert(typeof legacy.asps_version==="string"&&legacy.asps_version.startsWith("2."),"ASPS 2.x asps_version is required");
  assert(Array.isArray(legacy.phases)&&legacy.phases.length===23,"legacy ASPS state must contain exactly 23 phases");
  const seen=new Set();
  const phases=legacy.phases.map(p=>{
    assert(Number.isInteger(p.number)&&p.number>=1&&p.number<=23,"invalid phase number");
    assert(!seen.has(p.number),"duplicate phase number "+p.number); seen.add(p.number);
    return {
      number:p.number,
      capability:String(p.capability),
      contract:String(p.contract),
      status:normalizeStatus(p.status),
      reason_or_trigger:typeof p.reason_or_trigger==="string"?p.reason_or_trigger:"",
      gate_status:normalizeGate(p.gate_status),
      receipt_ref:receiptOf(p),
      adopted_evidence:evidenceOf(p)
    };
  }).sort((a,b)=>a.number-b.number);
  const transitions=(legacy.transition_gates??[]).map(g=>({
    key:String(g.key),
    capability:String(g.capability),
    contract:String(g.contract),
    status:normalizeStatus(g.status),
    gate_status:normalizeGate(g.gate_status),
    receipt_ref:receiptOf(g)
  }));
  const recommendations=(legacy.auxiliary_capabilities?.recommendations??[]).map(r=>({
    name:String(r.name??r.capability??""),
    responsibility:String(r.responsibility??""),
    trigger:String(r.trigger??r.reason??"")
  })).filter(r=>r.name&&r.responsibility&&r.trigger);
  const date=typeof legacy.updated==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(legacy.updated)
    ? legacy.updated+"T00:00:00Z"
    : new Date().toISOString();
  return {
    schema:"dev.woia.software-methodology-state/v1",
    software_version:"0.5.0",
    profile_seed:legacy.project?.profile_seed??null,
    phases,
    transition_gates:transitions,
    auxiliary_capabilities:{recommendations},
    migration:{
      source:"asps-2.x",
      status:"migrated",
      source_version:legacy.asps_version,
      source_path:sourcePath
    },
    updated_at:date
  };
}

const isMain=process.argv[1]&&path.resolve(process.argv[1])===path.resolve(fileURLToPath(import.meta.url));
if(isMain){
  const {input,output}=parseArgs(process.argv.slice(2));
  const legacy=JSON.parse(await readFile(input,"utf8"));
  const migrated=migrateAspsState(legacy,{sourcePath:input});
  await mkdir(path.dirname(output),{recursive:true});
  await writeFile(output,JSON.stringify(migrated,null,2)+"\n","utf8");
  console.log(JSON.stringify({result:"MIGRATED",source:input,output,source_version:legacy.asps_version},null,2));
}
