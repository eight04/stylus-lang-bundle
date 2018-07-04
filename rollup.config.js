import path from "path";
import builtins from "rollup-plugin-node-builtins";
import cjs from "rollup-plugin-cjs-es";
import inject from "rollup-plugin-inject";
import json from "rollup-plugin-json";
import re from "rollup-plugin-re";
import resolve from "rollup-plugin-node-resolve";
import {terser} from "rollup-plugin-terser";
import {plugin as analyzer} from "rollup-plugin-analyzer";

export default {
	input: {
    "stylus.min": "bundle.js"
  },
  output: {
    format: "iife",
    name: "StylusRenderer",
    dir: "dist"
  },
  plugins: [
    shimEmpty([
      "node_modules/stylus/lib/visitor/sourcemapper.js",
      "node_modules/glob/glob.js",
      "node_modules/stylus/lib/functions/image-size.js",
      "node_modules/debug/src/index.js"
    ]),
    resolve({
      extensions: [".js", ".json"]
    }),
    json(),
    re({
      patterns: [{
        match: /selector.js$/,
        test: /\bnew require\b/g,
        replace: "require"
      }, {
        match: /renderer.js$/,
        test: /module\.exports = /g,
        replace: "module.exports.Renderer = "
      }]
    }),
    cjs({nested: true}),
    builtins(),
    inject({
      global: path.resolve("inject/global.js")
    }),
    terser(),
    process.env.analyze && analyzer()
  ].filter(Boolean),
  experimentalCodeSplitting: true
};

function shimEmpty(files) {
  files = files.map(f => path.resolve(f));
  return {
    transform(code, id) {
      if (id[0] === "\x00") {
        return;
      }
      if (files.includes(id)) {
        return {
          code: `
            const noop = () => noop;
            module.exports = noop;
          `
        };
      }
    }
  };
}
