import { describe, it, expect } from "vitest";
import path from "path";
import fs from "fs";
import { svgToSvelte } from "../src";

describe("svgToSvelte", () => {
  const svgSvelteMap = {
    "activity.svg": "Activity.svelte",
    "dribbble.svg": "Dribbble.svelte",
    "git-branch.svg": "GitBranch.svelte",
    "mic-off.svg": "MicOff.svelte",
    "more-horizontal.svg": "MoreHorizontal.svelte",
    "slack.svg": "Slack.svelte",
  };

  Object.entries(svgSvelteMap).forEach(([svgFile, svelteFile]) => {
    it(`should convert ${svgFile} to ${svelteFile} component`, () => {
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
});
