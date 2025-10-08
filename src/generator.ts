import { SvgElement } from "./types";

export interface GeneratorOptions {
  /**
   * Properties to expose as component props with their default values
   */
  props?: {
    width?: string | number;
    height?: string | number;
  };
}

/**
 * Generates a Svelte component from a parsed SVG element
 */
export function generateSvelteComponent(
  svg: SvgElement,
  options: GeneratorOptions = {}
): string {
  const {
    props = {
      width: 24,
      height: 24,
    },
  } = options;

  // Extract values from SVG
  const svgWidth = svg.width as string | undefined;
  const svgHeight = svg.height as string | undefined;

  // Build props section
  const propsSection = buildPropsSection(props, svgWidth, svgHeight);

  // Build SVG attributes
  const svgAttributes = buildSvgAttributes(svg, props);

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

function buildPropsSection(
  props: NonNullable<GeneratorOptions["props"]>,
  svgWidth?: string,
  svgHeight?: string
): string {
  const propLines: string[] = [];

  if (props.width !== undefined) {
    const defaultWidth = svgWidth || props.width;
    propLines.push(`width = ${defaultWidth}`);
  }

  if (props.height !== undefined) {
    const defaultHeight = svgHeight || props.height;
    propLines.push(`height = ${defaultHeight}`);
  }

  propLines.push(`class: className`);


  if (propLines.length === 0) {
    return "";
  }

  const formattedProps = propLines.join(",\n    ");
  return `  let { \n    ${formattedProps} \n  } = $props();`;
}

function buildSvgAttributes(
  svg: SvgElement,
  props: NonNullable<GeneratorOptions["props"]>
): string {
  const attributes: string[] = [];

  for (const [key, value] of Object.entries(svg)) {
    // Skip child elements (objects and arrays)
    if (typeof value !== "string") {
      continue;
    }

    // Skip width and height if they're exposed as props
    if (key === "width" && props.width !== undefined) {
      continue;
    }
    if (key === "height" && props.height !== undefined) {
      continue;
    }

    if (key === "class") {
      continue;
    }

    // Add regular attributes
    attributes.push(`${key}="${value}"`);
  }

  // Add prop-based attributes
  if (props.width !== undefined) {
    attributes.unshift("{width}");
  }
  if (props.height !== undefined) {
    attributes.unshift("{height}");
  }

  attributes.push("class={className}");


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