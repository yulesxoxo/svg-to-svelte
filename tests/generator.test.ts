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
        d: "M22 12 18 12 15 21 9 3 6 12 2 12"
      },
    };

    const result = generateSvelteComponent(svg);

    const svelteComponentPath = path.resolve(__dirname, "data/feather/activity.svelte");
    const svelteComponent = fs.readFileSync(svelteComponentPath, "utf8");
    // workaround for windows line-endings
    expect(result.split(/\r?\n/)).toEqual(svelteComponent.split(/\r?\n/));
  });
});