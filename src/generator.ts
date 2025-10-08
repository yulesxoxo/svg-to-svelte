import { SvgElement } from "./types";

/**
 * Generates a Svelte component from a parsed SVG element
 */
export function generateSvelteComponent(
  svg: SvgElement,
): string {
  const svgProps = getSvgProps(svg);

  const propsSection = buildPropsSection(svgProps);

  const svgAttributes = buildSvgAttributes(svgProps);

  // Build child elements
  const children = buildChildren(svg);

  return `<script lang="ts">
${propsSection}
</script>

<svg${svgAttributes}>
${children}
</svg>
`;
}

function buildPropsSection(svgProps: Record<string, string>): string {
  // TODO
  return ""
}

function getSvgProps(
    svg: SvgElement,
): Record<string, string> {
  const svgProps: Record<string, string> = {};

  for (const [key, value] of Object.entries(svg)) {
    if (typeof value === 'string') {
      svgProps[key] = value;
    }

    if (key === 'title' && typeof value === 'string' && value.trim() !== '') {
      svgProps['aria-label'] = value.trim();
    }

    if (key === 'desc' && typeof value === 'string' && value.trim() !== '') {
      svgProps['aria-description'] = value.trim();
    }

    for (const [key, value] of Object.entries(svgProps)) {
      if (value.trim() === '') {
        delete svgProps[key];
      }
    }
  }

  return svgProps
}

function buildSvgAttributes(
  svgProps: Record<string, string>
): string {
  const attributes: string[] = [];

  for (const [key, value] of Object.entries(svgProps)) {
    attributes.push(`${key}="${value}"`);
  }

  attributes.push("{...rest}");


  if (attributes.length === 0) {
    return "";
  }

  return "\n  " + attributes.join("\n  ") + "\n";
}

function buildChildren(svg: SvgElement, indent = "  "): string {
  const childElements: string[] = [];

  for (const [key, value] of Object.entries(svg)) {
    // Skip string attributes
    if (typeof value === "string") {
      continue;
    }

    // Handle array of elements
    if (Array.isArray(value)) {
      for (const item of value) {
        childElements.push(buildElement(key, item, indent));
      }
    } else {
      // Single element
      childElements.push(buildElement(key, value, indent));
    }
  }

  return childElements.join("\n");
}

function buildElement(
  tagName: string,
  element: SvgElement,
  indent: string
): string {
  const attributes: string[] = [];

  // Check if element has any child elements
  let hasChildren = false;

  for (const [key, value] of Object.entries(element)) {
    if (typeof value === "string") {
      attributes.push(`${key}="${value}"`);
    } else {
      hasChildren = true;
    }
  }

  const attrString = attributes.length > 0 ? " " + attributes.join(" ") : "";

  if (hasChildren) {
    const children = buildChildren(element, indent + "  ");
    return `${indent}<${tagName}${attrString}>\n${children}\n${indent}</${tagName}>`;
  } else {
    return `${indent}<${tagName}${attrString} />`;
  }
}