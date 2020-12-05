const { resolve } = require("path");
const fs = require("fs");
const esbuild = require("esbuild");

const env = process.argv[2] == "dev" ? "dev" : "production";
const srcPath = "src";
const publicPath = "public";
const distPath = "dist";

const buildOpts = {
  entryPoints: [resolve(srcPath, "index.jsx")],
  outfile: resolve(distPath, "index.js"),
  bundle: true,
  platform: "browser",
  minify: env == "production",
  sourcemap: env == "dev" ? "inline" : false,
  define: {
    "process.env.NODE_ENV": `"${env}"`,
  },
};

esbuild.buildSync(buildOpts);
fs.readdirSync(resolve(publicPath)).forEach((path) => {
  fs.copyFileSync(resolve(publicPath, path), resolve(distPath, path));
});
