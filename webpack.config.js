import path from "node:path";
import CopyWebpackPlugin from "copy-webpack-plugin";

const cMapsDir = path.join(
  path.dirname(require.resolve("pdfjs-dist/package.json")),
  "cmaps"
);

const standardFontsDir = path.join(
  path.dirname(require.resolve("pdfjs-dist/package.json")),
  "standard_fonts"
);

module.exports = {
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: cMapsDir,
          to: "cmaps/",
        },
        {
          from: standardFontsDir,
          to: "standard_fonts/",
        },
      ],
    }),
  ],
};
