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
      fill: "none",
      stroke: "currentColor",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      viewBox: "0 0 24 24",
      path: {
        d: "M22 12 18 12 15 21 9 3 6 12 2 12",
      },
    };

    const result = generateSvelteComponent(svg);

    const svelteComponentPath = path.resolve(
      __dirname,
      "data/feather/Activity.svelte",
    );
    const svelteComponent = fs.readFileSync(svelteComponentPath, "utf8");
    // workaround for windows line-endings
    expect(result.split(/\r?\n/)).toEqual(svelteComponent.split(/\r?\n/));
  });


  it("should handle svg with <title> element and add aria-label", () => {
    const svg: SvgElement = {
      title: "Home Icon",
    };

    const result = generateSvelteComponent(svg);

    // Should include aria-label prop
    expect(result).toContain('"aria-label": ariaLabel = "Home Icon"');

    // Should use aria-label in svg attributes
    expect(result).toContain('aria-label={ariaLabel}');

    // Should not include title in the props section
    expect(result).not.toContain('title');
  });

  it("should handle svg with <desc> element and add aria-description", () => {
    const svg: SvgElement = {
      desc: "A simple home icon with a roof and door",
    };

    const result = generateSvelteComponent(svg);

    // Should include aria-description prop
    expect(result).toContain('"aria-description": ariaDescription = "A simple home icon with a roof and door"');

    // Should use aria-description in svg attributes
    expect(result).toContain('aria-description={ariaDescription}');

    // Should not include desc in the props section
    expect(result).not.toContain('desc =');
  });

  it("should handle svg with both <title> and <desc> elements", () => {
    const svg: SvgElement = {
      title: "Home Icon",
      desc: "A simple home icon with a roof and door",
    };

    const result = generateSvelteComponent(svg);

    // Should include both aria-label and aria-description
    expect(result).toContain('"aria-label": ariaLabel = "Home Icon"');
    expect(result).toContain('"aria-description": ariaDescription = "A simple home icon with a roof and door"');

    // Should use both in svg attributes
    expect(result).toContain('aria-label={ariaLabel}');
    expect(result).toContain('aria-description={ariaDescription}');
  });

  it("should remove empty string attributes", () => {
    const svg: SvgElement = {
      fill: "",
      stroke: "currentColor",
    };

    const result = generateSvelteComponent(svg);

    // Should not include fill prop since it's empty
    expect(result).not.toContain('fill =');
    expect(result).not.toContain('fill={fill}');
    expect(result).not.toContain('{fill}');

    // Should include stroke prop
    expect(result).toContain('stroke = "currentColor"');
  });

  it("should remove attributes with only whitespace", () => {
    const svg: SvgElement = {
      fill: "   ",
      "stroke-width": "  ",
      stroke: "currentColor",
    };

    const result = generateSvelteComponent(svg);

    // Should not include fill or stroke-width props since they're whitespace-only
    expect(result).not.toContain('fill =');
    expect(result).not.toContain('strokeWidth =');
    expect(result).not.toContain('stroke-width');

    // Should include stroke prop
    expect(result).toContain('stroke = "currentColor"');
  });

  it("should trim whitespace from title and desc before using as aria attributes", () => {
    const svg: SvgElement = {
      title: "  Home Icon  ",
      desc: "  A simple home icon  ",
    };

    const result = generateSvelteComponent(svg);

    // Should trim whitespace in aria-label and aria-description
    expect(result).toContain('"aria-label": ariaLabel = "Home Icon"');
    expect(result).toContain('"aria-description": ariaDescription = "A simple home icon"');
  });

  it("should not add aria-label if title is empty or whitespace-only", () => {
    const svg: SvgElement = {
      title: "   ",
    };

    const result = generateSvelteComponent(svg);

    // Should not include aria-label
    expect(result).not.toContain('aria-label');
    expect(result).not.toContain('ariaLabel');
  });

  it("should not add aria-description if desc is empty or whitespace-only", () => {
    const svg: SvgElement = {
      desc: "",
    };

    const result = generateSvelteComponent(svg);

    // Should not include aria-description
    expect(result).not.toContain('aria-description');
    expect(result).not.toContain('ariaDescription');
  });

  it("should work with groups", () => {
    const svg: SvgElement = {
      g: {
        rect: {
          x: "10"
        }
      }
    };

    const result = generateSvelteComponent(svg);
    const expected = `<g>
    <rect x="10" />
  </g>`
    expect(result).toContain(expected)
  });

  it("should include class if configured", () => {
    const svg: SvgElement = {
      class: "size-6",
    }

    const result = generateSvelteComponent(svg, {includeClass: true});
    expect(result).toContain('class: className = "size-6"')
    expect(result).toContain("class={className}")
  });
});