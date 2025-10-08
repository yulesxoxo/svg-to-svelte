import { XMLValidator, XMLParser } from "fast-xml-parser";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  parseAttributeValue: false, // Keep all attributes as strings
  trimValues: true,
});

/**
 * Represents a single SVG element with its attributes and potential child elements
 */
export interface SvgElement {
  [key: string]: string | SvgElement | SvgElement[];
}

/**
 * Parses an SVG string and extracts attributes and content
 */
export function parseSvg(svgContent: string): SvgElement {
  const trimmed = svgContent.trim();

  if (!trimmed.startsWith("<svg")) {
    throw new Error("Invalid SVG: Content must start with <svg> tag");
  }

  const validationResult = XMLValidator.validate(trimmed);
  if (validationResult !== true) {
    throw new Error(
      `Invalid SVG: ${validationResult.err.msg} at line ${validationResult.err.line}`,
    );
  }

  let parsed;
  try {
    parsed = parser.parse(trimmed);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Invalid SVG: ${error.message}`);
    }
    throw new Error("Invalid SVG: Failed to parse");
  }

  if (parsed.svg === undefined) {
    throw new Error("Invalid SVG: No SVG element found");
  }

  if (typeof parsed.svg !== "object") {
    throw new Error("Invalid SVG: No SVG element found");
  }

  const svg: SvgElement = parsed.svg;

  validate(svg);

  return svg;
}

function validate(svg: SvgElement) {
  validateSvgHasChildElements(svg);
  validateNoNestedSvgs(svg);
}

function validateSvgHasChildElements(svg: SvgElement) {
  for (const value of Object.values(svg)) {
    if (typeof value === "object") {
      return;
    }
  }

  throw new Error("Invalid SVG: SVG has no child elements found");
}

function validateNoNestedSvgs(svg: SvgElement) {
  for (const [key, value] of Object.entries(svg)) {
    if (key === "svg") {
      throw new Error("Invalid SVG: Nested SVG elements are not supported");
    }

    if (typeof value === "object") {
      if (Array.isArray(value)) {
        for (const item of value) {
          if (typeof item === "object") {
            validateNoNestedSvgs(item);
          }
        }
      } else {
        validateNoNestedSvgs(value);
      }
    }
  }
}
