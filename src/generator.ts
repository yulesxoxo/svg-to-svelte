import { SvgElement } from "./types";
import { Options } from "./index";

const nonEditableProperties = ["viewBox", "preserveAspectRatio"] as const;

/**
 * Generates a Svelte component from a parsed SVG element
 */
export function generateSvelteComponent(
  svg: SvgElement,
  options: Options = {},
): string {
  const svgProps = getSvgProps(svg, options);

  const propsSection = buildPropsSection(svgProps);

  const svgAttributes = buildSvgAttributes(svgProps);

  // Build child elements
  const children = buildChildren(svg);

  return `<script lang="ts">
${propsSection}
</script>

<svg
${svgAttributes}
>
${children}
</svg>
`;
}

function kebabToCamel(key: string): string {
  return key.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}

function buildPropsSection(svgProps: Record<string, string>): string {
  const propDefaults: string[] = [];

  for (const [key, value] of Object.entries(svgProps)) {
    if (nonEditableProperties.includes(key as any)) {
      continue;
    }

    if (key === "class") {
      propDefaults.push(`    class: className = "${value}"`);
      continue;
    }

    const varName = /^[a-z][a-zA-Z0-9]*$/.test(key) ? key : kebabToCamel(key);
    if (varName !== key) {
      propDefaults.push(`    "${key}": ${varName} = "${value}"`);
    } else {
      propDefaults.push(`    ${key} = "${value}"`);
    }
  }

  propDefaults.push(`    ...rest`);

  return `  let {\n${propDefaults.join(",\n")}\n  } = $props();`;
}

function getSvgProps(
  svg: SvgElement,
  options: Options,
): Record<string, string> {
  const svgProps: Record<string, string> = {};

  for (const [key, value] of Object.entries(svg)) {
    if (key === "class" && !options.includeClass) {
      continue;
    }

    function setAriaAttribute(
      attr: string,
      value: string | SvgElement | SvgElement[],
    ) {
      if (typeof value === "string" && value.trim() !== "") {
        svgProps[attr] = value.trim();
      } else if (
        typeof value === "object" &&
        value !== null &&
        "#text" in value &&
        typeof value["#text"] === "string"
      ) {
        svgProps[attr] = value["#text"];
      }
    }

    if (key === "title") {
      setAriaAttribute("aria-label", value);
      continue;
    }

    if (key === "desc") {
      setAriaAttribute("aria-description", value);
      continue;
    }

    if (typeof value === "string") {
      svgProps[key] = value;
    }
  }

  // Remove empty values
  for (const key of Object.keys(svgProps)) {
    if (svgProps[key].trim() === "") {
      delete svgProps[key];
    }
  }

  return svgProps;
}

function buildSvgAttributes(svgProps: Record<string, string>): string {
  const attributes: string[] = [];

  for (const [key, value] of Object.entries(svgProps)) {
    if (nonEditableProperties.includes(key as any)) {
      attributes.push(`${key}="${value}"`);
      continue;
    }

    if (key === "class") {
      attributes.push("class={className}");
      continue;
    }

    const varName = /^[a-z][a-zA-Z0-9]*$/.test(key) ? key : kebabToCamel(key);
    attributes.push(key.includes("-") ? `${key}={${varName}}` : `{${varName}}`);
  }

  attributes.push("{...rest}");

  return "  " + attributes.join("\n  ");
}

function buildChildren(svg: SvgElement, indent = "  "): string {
  const childElements: string[] = [];

  for (const [key, value] of Object.entries(svg)) {
    if (typeof value === "string") continue;
    if (key === "title" || key === "desc") {
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        childElements.push(buildElement(key, item, indent));
      }
    } else {
      childElements.push(buildElement(key, value, indent));
    }
  }

  return childElements.join("\n");
}

function buildElement(
  tagName: string,
  element: SvgElement,
  indent: string,
): string {
  const attributes: string[] = [];
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
