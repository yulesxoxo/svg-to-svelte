import { optimize, Config } from "svgo";

const DEFAULT_SVGO_CONFIG: Config = {
  plugins: [
    "cleanupAttrs",
    "cleanupEnableBackground",
    "cleanupListOfValues",
    "cleanupNumericValues",
    "collapseGroups",
    "convertColors",
    "convertEllipseToCircle",
    "convertOneStopGradients",
    "convertPathData",
    "convertShapeToPath",
    "convertStyleToAttrs",
    "convertTransform",
    "inlineStyles",
    "mergePaths",
    "mergeStyles",
    "minifyStyles",
    "moveElemsAttrsToGroup",
    "moveGroupAttrsToElems",
    "removeComments",
    "removeDeprecatedAttrs",
    "removeDesc",
    "removeDoctype",
    "removeEditorsNSData",
    "removeEmptyAttrs",
    "removeEmptyContainers",
    "removeEmptyText",
    "removeHiddenElems",
    "removeMetadata",
    "removeNonInheritableGroupAttrs",
    "removeOffCanvasPaths",
    // "removeRasterImages", will throw an Error in the parser
    // "removeStyleElement", will throw an Error in the parser
    "removeUnknownsAndDefaults",
    "removeUnusedNS",
    "removeUselessDefs",
    "removeUselessStrokeAndFill",
    "removeXMLNS",
    "removeXMLProcInst",
    "removeXlink",
    "sortAttrs",
    "sortDefsChildren",
  ],
};

/**
 * Preprocesses an SVG string using SVGO to optimize and clean it up
 */
export function preprocessSvg(svgContent: string): string {
  try {
    const result = optimize(svgContent, DEFAULT_SVGO_CONFIG);
    return result.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`SVG preprocessing failed: ${error.message}`);
    }
    throw new Error("SVG preprocessing failed");
  }
}
