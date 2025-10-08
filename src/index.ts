import { preprocessSvg } from "./preprocessor";
import { parseSvg } from "./parser";
import { generateSvelteComponent } from "./generator";

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
