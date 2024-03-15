const postcss = require("rollup-plugin-postcss");
const svgr = require("@svgr/rollup");
const url = require("@rollup/plugin-url");
const copy = require("rollup-plugin-copy");

module.exports = {
  rollup(config, options) {
    config.plugins.push(
      postcss({
        config: {
          path: "./postcss.config.js",
        },
        extensions: [".css", ".scss"],
        minimize: true,
        inject: {
          insertAt: "top",
        },
      }),
    );

    config.plugins.push(svgr({ icon: true }));
    config.plugins.push(
      url({
        limit: 0, // Always emit files as separate assets
        include: ["**/illustrations/*.svg"], // You can adjust the pattern to match other images if needed
        fileName: "assets/[name][extname]",
        // publicPath: '/static/', // Adjust the public path as needed
      }),
    );

    // Copy src/fonts folder to dist/fonts
    config.plugins.push(
      copy({
        targets: [
          { src: "src/fonts/*", dest: "dist/fonts" },
        ],
        // Set to true to enable verbose output
        verbose: false,
      })
    );

    return config; // Always return a config.
  },
};
