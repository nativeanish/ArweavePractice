import { build } from "esbuild";
import replace from "replace-in-file";
const contracts = ["/hello.ts"];

build({
  entryPoints: contracts.map((source) => {
    return `./contract${source}`;
  }),
  outdir: "./dist",
  minify: false,
  bundle: true,
  format: "iife",
})
  .catch(() => process.exit(1))
  .finally(() => {
    const files = contracts.map((source) => {
      return `./dist${source}`.replace(".js", ".ts");
    });
    replace.sync({
      files: files,
      from: [/\(\(\) => {/g, /}\)\(\);/g],
      to: "",
      countMatches: true,
    });
  });
