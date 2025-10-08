import { preprocessSvg } from "./preprocessor.js";
import { parseSvg } from "./parser.js";
import { generateSvelteComponent } from "./generator.js";

export interface Options {
  includeClass?: boolean; // whether to include the class property
}

/**
 * Converts SVG content to a Svelte component
 */
export function svgToSvelte(svgContent: string, options: Options = {}): string {
  const preprocessed = preprocessSvg(svgContent);
  const parsed = parseSvg(preprocessed);

  return generateSvelteComponent(parsed, options);
}
