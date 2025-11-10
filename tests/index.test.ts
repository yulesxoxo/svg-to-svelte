import { describe, it, expect } from "vitest";
import path from "path";
import fs from "fs";
import { svgToSvelte } from "../src/index.js";

describe("svgToSvelte", () => {
  const featherSvgSvelteMap = {
    "activity.svg": "Activity.svelte",
    "dribbble.svg": "Dribbble.svelte",
    "git-branch.svg": "GitBranch.svelte",
    "mic-off.svg": "MicOff.svelte",
    "more-horizontal.svg": "MoreHorizontal.svelte",
    "slack.svg": "Slack.svelte",
  };

  Object.entries(featherSvgSvelteMap).forEach(([svgFile, svelteFile]) => {
    it(`should convert feather ${svgFile} to ${svelteFile} component`, () => {
      const svgPath = path.resolve(__dirname, `data/feather/${svgFile}`);
      const svg = fs.readFileSync(svgPath, "utf8");
      const result = svgToSvelte(svg);

      const svelteComponentPath = path.resolve(
        __dirname,
        `data/feather/${svelteFile}`,
      );
      const svelteComponent = fs.readFileSync(svelteComponentPath, "utf8");

      expect(result.split(/\r?\n/)).toEqual(svelteComponent.split(/\r?\n/));
    });
  });

  const customSvgSvelteMap = {
    "square.svg": "Square.svelte",
    "group.svg": "Group.svelte",
  };

  Object.entries(customSvgSvelteMap).forEach(([svgFile, svelteFile]) => {
    it(`should convert custom ${svgFile} to ${svelteFile} component`, () => {
      const svgPath = path.resolve(__dirname, `data/custom/${svgFile}`);
      const svg = fs.readFileSync(svgPath, "utf8");
      const result = svgToSvelte(svg);

      const svelteComponentPath = path.resolve(
        __dirname,
        `data/custom/${svelteFile}`,
      );
      const svelteComponent = fs.readFileSync(svelteComponentPath, "utf8");

      expect(result.split(/\r?\n/)).toEqual(svelteComponent.split(/\r?\n/));
    });
  });

  const lucideSvgSvelteMap = {
    "skull.svg": "Skull.svelte",
    "thermometer-snowflake.svg": "ThermometerSnowflake.svelte",
  };

  Object.entries(lucideSvgSvelteMap).forEach(([svgFile, svelteFile]) => {
    it(`should convert Lucide ${svgFile} to ${svelteFile} component`, () => {
      const svgPath = path.resolve(__dirname, `data/lucide/${svgFile}`);
      const svg = fs.readFileSync(svgPath, "utf8");
      const result = svgToSvelte(svg);

      const svelteComponentPath = path.resolve(
        __dirname,
        `data/lucide/${svelteFile}`,
      );
      const svelteComponent = fs.readFileSync(svelteComponentPath, "utf8");

      expect(result.split(/\r?\n/)).toEqual(svelteComponent.split(/\r?\n/));
    });
  });
});
