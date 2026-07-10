/// <reference types="node" />
import { readFileSync } from "node:fs";
import { build } from "esbuild";

const pkg = JSON.parse(readFileSync("./package.json", "utf-8")) as {
  dependencies?: Record<string, string>;
};

const external = Object.keys(pkg.dependencies ?? {});

await build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  target: "node24",
  format: "esm",
  outdir: "dist",
  sourcemap: true,
  minify: false,
  external,
  alias: {
    "#lib": "./src/lib",
    "#config": "./src/config",
    "#middlewares": "./src/middlewares",
  },
});
