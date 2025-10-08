/**
 * Represents a single SVG element with its attributes and potential child elements
 */
export interface SvgElement {
  [key: string]: string | SvgElement | SvgElement[];
}
