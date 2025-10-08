import { describe, it, expect } from "vitest";
import { parseSvg } from "../src/parser.js";
import { SvgElement } from "../src/types";
import fs from "fs";
import path from "path";

describe("parseSvg", () => {
  it("should parse a simple SVG", () => {
    const svg = `
    <svg width="24" height="24" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/>
    </svg>`;

    const result = parseSvg(svg);

    expect(result.width).toBe("24");
    expect(result.height).toBe("24");
    expect(result.viewBox).toBe("0 0 24 24");
    expect(typeof result.circle).toBe("object");
    const circle = result.circle as SvgElement;
    expect(circle.cx).toBe("12");
  });

  it("should parse SVG with single quotes", () => {
    const svg = `
    <svg width='100' height='100'>
        <rect x='0' y='0' width='100' height='100'/>
    </svg>`;

    const result = parseSvg(svg);

    expect(result.width).toBe("100");
    expect(result.height).toBe("100");
  });

  it("should parse SVG with multiples of same tag for child elements", () => {
    const svg = `
    <svg width='150' height='150'>
        <rect x='0' y='0' width='100' height='100'/>
        <rect x='50' y='50' width='100' height='100'/>
    </svg>`;

    const result = parseSvg(svg);

    expect(result.rect).toBeInstanceOf(Array);
    expect(result.rect).toHaveLength(2);
  });

  it("should parse SVG with multiple attributes", () => {
    const svg = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7v10l10 5 10-5V7L12 2z"/>
    </svg>`;

    const result = parseSvg(svg);

    expect(result.width).toBe("24");
    expect(result.height).toBe("24");
    expect(result.viewBox).toBe("0 0 24 24");
    expect(result.fill).toBe("none");
    expect(result.stroke).toBe("currentColor");
    expect(result.xmlns).toBe("http://www.w3.org/2000/svg");
  });

  it("should parse SVG with hyphenated attributes", () => {
    const svg = `
    <svg xmlns:xlink="http://www.w3.org/1999/xlink" stroke-width="2">
        <path d="M0 0"/>
    </svg>`;

    const result = parseSvg(svg);

    expect(result["xmlns:xlink"]).toBe("http://www.w3.org/1999/xlink");
    expect(result["stroke-width"]).toBe("2");
  });

  it("should extract content between svg tags", () => {
    const svg = `
    <svg width="24" height="24">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 2L2 7"/>
    </svg>`;

    const result = parseSvg(svg);
    expect(typeof result.circle).toBe("object");
    const circle = result.circle as SvgElement;
    expect(circle.cx).toBe("12");
    expect(typeof result.path).toBe("object");
    const path = result.path as SvgElement;
    expect(path.d).toContain("M12 2L2 7");
  });

  it("should throw error for invalid SVG without opening tag", () => {
    const invalid = "<div>Not an SVG</div>";

    expect(() => parseSvg(invalid)).toThrow(
      "Invalid SVG: Content must start with <svg> tag",
    );
  });

  it("should throw error for SVG without closing tag", () => {
    const invalid = `
    <svg width="24" height="24">
        <circle cx="12" cy="12" r="10"/>`;

    expect(() => parseSvg(invalid)).toThrow(
      "Invalid SVG: Unclosed tag 'svg'. at line 1",
    );
  });

  it("should handle SVG with no attributes", () => {
    const svg = `
    <svg>
        <circle cx="12" cy="12" r="10"/>
    </svg>`;

    const result = parseSvg(svg);
    expect(typeof result.circle).toBe("object");
    const circle = result.circle as SvgElement;
    expect(circle.cx).toBe("12");
  });

  it("should throw error for empty SVG", () => {
    const svg1 = "<svg/>";
    const svg2 = "<svg></svg>";

    expect(() => parseSvg(svg1)).toThrow("Invalid SVG: No SVG element found");

    expect(() => parseSvg(svg2)).toThrow("Invalid SVG: No SVG element found");
  });

  it("should throw error for multiple SVGs in single file", () => {
    const svg = `
    <svg width="24" height="24">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 2L2 7"/>
    </svg>`;

    expect(() => parseSvg(svg + svg)).toThrow(
      "Invalid SVG: Multiple possible root nodes found. at line 5",
    );
  });

  it("should throw error for non SVG root nodes", () => {
    const svg = `
    <svg2 width="24" height="24">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 2L2 7"/>
    </svg2>`;

    expect(() => parseSvg(svg)).toThrow("Invalid SVG: No SVG element found");
  });

  it("should throw error for nested SVG elements", () => {
    const svg = `
    <svg width="750" height="500" style="background: gray">
        <svg x="200" y="200">
            <circle cx="50" cy="50" r="50" style="fill: red" />
        </svg>
        <circle cx="50" cy="50" r="50" style="fill: yellow" />
    </svg>`;

    expect(() => parseSvg(svg)).toThrow(
      "Invalid SVG: Nested SVG elements are not supported",
    );
  });

  it("test feather activity.svg", () => {
    const svgPath = path.resolve(__dirname, "data/feather/activity.svg");
    const svg = fs.readFileSync(svgPath, "utf8");

    expect(() => parseSvg(svg)).not.toThrow();
    // Optionally, you can add more assertions depending on what parseSvg returns
    const result = parseSvg(svg);
    expect(result).toBeDefined();
  });
});

