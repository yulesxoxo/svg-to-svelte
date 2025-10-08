import { describe, it, expect } from "vitest";
import { generateSvelteComponent } from "../src/generator.js";
import { SvgElement } from "../src/types";
import path from "path";
import fs from "fs";

describe("generateSvelteComponent", () => {
  it("should generate basic Svelte component with default props", () => {
    const svg: SvgElement = {
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      stroke: "currentColor",
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      polyline: {
        points: "22 12 18 12 15 21 9 3 6 12 2 12",
      },
    };

    const result = generateSvelteComponent(svg);

    const svelteComponentPath = path.resolve(__dirname, "data/feather/activity.svelte");
    const svelteComponent = fs.readFileSync(svelteComponentPath, "utf8");
    expect(result).toEqual(svelteComponent);
  });

  it("should use SVG's width and height as defaults", () => {
    const svg: SvgElement = {
      width: "100",
      height: "50",
      circle: { cx: "12", cy: "12", r: "10" },
    };

    const result = generateSvelteComponent(svg);

    expect(result).toContain("width = 100");
    expect(result).toContain("height = 50");
  });

  it("should handle multiple elements of the same type", () => {
    const svg: SvgElement = {
      width: "150",
      height: "150",
      rect: [
        { x: "0", y: "0", width: "100", height: "100" },
        { x: "50", y: "50", width: "100", height: "100" },
      ],
    };

    const result = generateSvelteComponent(svg);

    expect(result).toContain('<rect x="0" y="0" width="100" height="100" />');
    expect(result).toContain(
      '<rect x="50" y="50" width="100" height="100" />'
    );
    const matches = result.match(/<rect/g);
    expect(matches).toHaveLength(2);
  });

  it("should handle nested elements", () => {
    const svg: SvgElement = {
      width: "24",
      height: "24",
      g: {
        fill: "none",
        circle: { cx: "12", cy: "12", r: "10" },
      },
    };

    const result = generateSvelteComponent(svg);

    expect(result).toContain('<g fill="none">');
    expect(result).toContain('<circle cx="12" cy="12" r="10" />');
    expect(result).toContain("</g>");
  });

  it("should handle custom prop options", () => {
    const svg: SvgElement = {
      width: "24",
      height: "24",
      circle: { cx: "12", cy: "12", r: "10" },
    };

    const result = generateSvelteComponent(svg, {
      props: {
        width: 32,
        height: 32,
      },
    });

    expect(result).toContain("width = 32");
    expect(result).toContain("height = 32");
    expect(result).not.toContain("class:");
    expect(result).not.toContain("className");
  });

  it("should handle props with only width", () => {
    const svg: SvgElement = {
      width: "24",
      height: "24",
      circle: { cx: "12", cy: "12", r: "10" },
    };

    const result = generateSvelteComponent(svg, {
      props: {
        width: 24,
      },
    });

    expect(result).toContain("width = 24");
    expect(result).not.toContain("height");
    expect(result).not.toContain("className");
    expect(result).toContain('height="24"');
  });

  it("should handle SVG with no props exposed", () => {
    const svg: SvgElement = {
      width: "24",
      height: "24",
      circle: { cx: "12", cy: "12", r: "10" },
    };

    const result = generateSvelteComponent(svg, {
      props: {},
    });

    expect(result).not.toContain("$props()");
    expect(result).toContain('width="24"');
    expect(result).toContain('height="24"');
  });

  it("should handle hyphenated attributes", () => {
    const svg: SvgElement = {
      "xmlns:xlink": "http://www.w3.org/1999/xlink",
      "stroke-width": "2",
      "stroke-linecap": "round",
      path: { d: "M0 0" },
    };

    const result = generateSvelteComponent(svg);

    expect(result).toContain('xmlns:xlink="http://www.w3.org/1999/xlink"');
    expect(result).toContain('stroke-width="2"');
    expect(result).toContain('stroke-linecap="round"');
  });

  it("should preserve attribute order (props first, then others, class last)", () => {
    const svg: SvgElement = {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      class: "test-class",
      circle: { cx: "12", cy: "12", r: "10" },
    };

    const result = generateSvelteComponent(svg);

    const svgTagMatch = result.match(/<svg[^>]*>/);
    expect(svgTagMatch).toBeTruthy();
    const svgTag = svgTagMatch![0];

    const widthIndex = svgTag.indexOf("{width}");
    const heightIndex = svgTag.indexOf("{height}");
    const viewBoxIndex = svgTag.indexOf("viewBox");
    const classIndex = svgTag.indexOf("class={className}");

    expect(widthIndex).toBeLessThan(heightIndex);
    expect(heightIndex).toBeLessThan(viewBoxIndex);
    expect(viewBoxIndex).toBeLessThan(classIndex);
  });

  it("should handle deeply nested elements", () => {
    const svg: SvgElement = {
      width: "24",
      height: "24",
      g: {
        id: "layer1",
        g: {
          id: "layer2",
          circle: { cx: "12", cy: "12", r: "10" },
        },
      },
    };

    const result = generateSvelteComponent(svg);

    expect(result).toContain('<g id="layer1">');
    expect(result).toContain('<g id="layer2">');
    expect(result).toContain('<circle cx="12" cy="12" r="10" />');
    expect(result).toContain("</g>");
    const closingTags = result.match(/<\/g>/g);
    expect(closingTags).toHaveLength(2);
  });

  it("should handle elements with no attributes", () => {
    const svg: SvgElement = {
      width: "24",
      height: "24",
      g: {
        circle: { cx: "12", cy: "12", r: "10" },
      },
    };

    const result = generateSvelteComponent(svg);

    expect(result).toContain("<g>");
    expect(result).toContain("</g>");
  });

  it("should format output with proper indentation", () => {
    const svg: SvgElement = {
      width: "24",
      height: "24",
      g: {
        circle: { cx: "12", cy: "12", r: "10" },
      },
    };

    const result = generateSvelteComponent(svg);

    const lines = result.split("\n");

    // Check script indentation
    const propsLine = lines.find((l) => l.includes("let {"));
    expect(propsLine).toMatch(/^  let/);

    // Check SVG child indentation
    const gLine = lines.find((l) => l.includes("<g>"));
    expect(gLine).toMatch(/^  <g>/);

    // Check nested element indentation
    const circleLine = lines.find((l) => l.includes("<circle"));
    expect(circleLine).toMatch(/^    <circle/);
  });

  it("should handle SVG without dimensions", () => {
    const svg: SvgElement = {
      viewBox: "0 0 24 24",
      circle: { cx: "12", cy: "12", r: "10" },
    };

    const result = generateSvelteComponent(svg);

    expect(result).toContain("width = 24");
    expect(result).toContain("height = 24");
    expect(result).toContain("{width}");
    expect(result).toContain("{height}");
  });

  it("should generate complete component matching example output", () => {
    const svg: SvgElement = {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      class: "feather feather-activity",
      polyline: {
        points: "22 12 18 12 15 21 9 3 6 12 2 12",
      },
    };

    const result = generateSvelteComponent(svg);

    // Should have all main sections
    expect(result).toContain("<script lang=\"ts\">");
    expect(result).toContain("</script>");
    expect(result).toContain("<svg");
    expect(result).toContain("</svg>");

    // Should not include original class
    expect(result).not.toContain("feather feather-activity");

    // Should have reactive props
    expect(result).toContain("{width}");
    expect(result).toContain("{height}");
    expect(result).toContain("class={className}");

    // Should preserve other attributes
    expect(result).toContain('viewBox="0 0 24 24"');
    expect(result).toContain('stroke="currentColor"');
  });
});