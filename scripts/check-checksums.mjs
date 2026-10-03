import { ROOT, validateChecksums } from "./lib/plugin.mjs";

await validateChecksums(ROOT);
console.log("checksums: optional source checksum manifest matches portable content");
