import { describe, it, expect } from "vitest";
import path from "path";
import fs from "fs";
import { svgToSvelte } from "../src";

describe("svgToSvelte", () => {
  it("should convert .svg to .svelte component", () => {

    const svgPath = path.resolve(__dirname, "data/feather/activity.svg");
    const svg =  fs.readFileSync(svgPath, "utf8");
    const svelteComponentPath = path.resolve(__dirname, "data/feather/activity.svelte");
    const svelteComponent = fs.readFileSync(svelteComponentPath, "utf8");

    const result = svgToSvelte(svg);

    expect(result.split(/\r?\n/)).toEqual(svelteComponent.split(/\r?\n/));
  });
});