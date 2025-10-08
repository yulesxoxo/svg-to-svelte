import { preprocessSvg } from "./preprocessor";
import { parseSvg } from "./parser";
import { generateSvelteComponent } from "./generator";

/**
 * Converts SVG content to a Svelte component
 */
export function svgToSvelte(svgContent: string): string {
  const preprocessed = preprocessSvg(svgContent);
  const parsed = parseSvg(preprocessed);

  return generateSvelteComponent(parsed);
}
