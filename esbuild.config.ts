import { build } from "esbuild";

await build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  target: "node24",
  format: "esm",
  outdir: "dist",
  sourcemap: true,
  minify: false,
  external: ["express"],
  alias: {
    "#lib": "./src/lib",
    "#config": "./src/config",
    "#middlewares": "./src/middlewares",
  },
});
