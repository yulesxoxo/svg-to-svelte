import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { runCli } from "../src/cli";

describe("CLI", () => {
  const testOutputDir = path.resolve(__dirname, "temp-output");
  const cliPath = path.resolve(__dirname, "../src/cli.ts");

  // Helper to run CLI command via npx (for integration tests)
  const runCliIntegration = (args: string[]) => {
    try {
      const result = execSync(
        `npx tsx ${cliPath} ${args.join(" ")}`,
        { encoding: "utf8", stdio: "pipe" }
      );
      return { stdout: result, stderr: "", exitCode: 0 };
    } catch (error: any) {
      return {
        stdout: error.stdout || "",
        stderr: error.stderr || "",
        exitCode: error.status || 1,
      };
    }
  };

  beforeEach(() => {
    // Clean up test output directory before each test
    if (fs.existsSync(testOutputDir)) {
      fs.rmSync(testOutputDir, { recursive: true, force: true });
    }
  });

  afterEach(() => {
    // Clean up test output directory after each test
    if (fs.existsSync(testOutputDir)) {
      fs.rmSync(testOutputDir, { recursive: true, force: true });
    }
  });

  describe("argument validation", () => {
    it("should exit with error when no arguments provided", () => {
      const result = runCli([]);
      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain("Usage: svg-to-svelte");
    });

    it("should exit with error when only one argument provided", () => {
      const result = runCli(["input.svg"]);
      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain("Usage: svg-to-svelte");
    });

    it("should exit with error when input path does not exist", () => {
      const result = runCli(["non-existent-file.svg", testOutputDir]);
      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain("Input path does not exist");
    });
  });

  describe("single file processing", () => {
    it("should convert a single SVG file to Svelte component", () => {
      const inputPath = path.resolve(__dirname, "data/feather/activity.svg");
      const result = runCli([inputPath, testOutputDir]);

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain("Processing:");
      expect(result.stdout).toContain("activity.svg");

      // Check output file was created
      const outputPath = path.join(testOutputDir, "activity.svelte");
      expect(fs.existsSync(outputPath)).toBe(true);

      // Verify content matches expected
      const expectedPath = path.resolve(
        __dirname,
        "data/feather/Activity.svelte"
      );
      const output = fs.readFileSync(outputPath, "utf8");
      const expected = fs.readFileSync(expectedPath, "utf8");
      expect(output.split(/\r?\n/)).toEqual(expected.split(/\r?\n/));
    });

    it("should handle different SVG files correctly", () => {
      const inputPath = path.resolve(__dirname, "data/custom/square.svg");
      const result = runCli([inputPath, testOutputDir]);

      expect(result.exitCode).toBe(0);

      const outputPath = path.join(testOutputDir, "square.svelte");
      expect(fs.existsSync(outputPath)).toBe(true);

      const expectedPath = path.resolve(
        __dirname,
        "data/custom/Square.svelte"
      );
      const output = fs.readFileSync(outputPath, "utf8");
      const expected = fs.readFileSync(expectedPath, "utf8");
      expect(output.split(/\r?\n/)).toEqual(expected.split(/\r?\n/));
    });

    it("should exit with error when input file is not SVG", () => {
      // Create a temporary non-SVG file
      const tempFile = path.join(testOutputDir, "test.txt");
      fs.mkdirSync(testOutputDir, { recursive: true });
      fs.writeFileSync(tempFile, "not an svg");

      const result = runCli([tempFile, testOutputDir]);
      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain("must be an SVG file");
    });

    it("should create output directory if it doesn't exist", () => {
      const inputPath = path.resolve(__dirname, "data/feather/activity.svg");
      const newOutputDir = path.join(testOutputDir, "nested", "output");

      const result = runCli([inputPath, newOutputDir]);

      expect(result.exitCode).toBe(0);
      expect(fs.existsSync(newOutputDir)).toBe(true);
      expect(fs.existsSync(path.join(newOutputDir, "activity.svelte"))).toBe(
        true
      );
    });
  });

  describe("directory processing", () => {
    it("should convert all SVG files in a directory", () => {
      const inputDir = path.resolve(__dirname, "data/feather");
      const result = runCli([inputDir, testOutputDir]);

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain("Found");
      expect(result.stdout).toContain("SVG file(s)");
      expect(result.stdout).toContain("Complete:");
      expect(result.stdout).toContain("succeeded");

      // Check that output files were created
      const expectedFiles = [
        "activity.svelte",
        "dribbble.svelte",
        "git-branch.svelte",
        "mic-off.svelte",
        "more-horizontal.svelte",
        "slack.svelte",
      ];

      expectedFiles.forEach((file) => {
        const outputPath = path.join(testOutputDir, file);
        expect(fs.existsSync(outputPath)).toBe(true);
      });
    });

    it("should process custom directory correctly", () => {
      const inputDir = path.resolve(__dirname, "data/custom");
      const result = runCli([inputDir, testOutputDir]);

      expect(result.exitCode).toBe(0);

      const expectedFiles = ["square.svelte", "group.svelte"];

      expectedFiles.forEach((file) => {
        const outputPath = path.join(testOutputDir, file);
        expect(fs.existsSync(outputPath)).toBe(true);
      });
    });

    it("should warn when directory contains no SVG files", () => {
      // Create empty directory
      const emptyDir = path.join(testOutputDir, "empty");
      fs.mkdirSync(emptyDir, { recursive: true });

      const result = runCli([emptyDir, testOutputDir]);

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain("No .svg files found");
    });

    it("should report success and error counts", () => {
      const inputDir = path.resolve(__dirname, "data/feather");
      const result = runCli([inputDir, testOutputDir]);

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toMatch(/Complete: \d+ succeeded, \d+ failed/);
    });
  });

  describe("output verification", () => {
    it("should generate correct Svelte components for feather icons", () => {
      const inputDir = path.resolve(__dirname, "data/feather");
      const result = runCli([inputDir, testOutputDir]);

      expect(result.exitCode).toBe(0);

      const testFiles = {
        "activity.svelte": "Activity.svelte",
        "dribbble.svelte": "Dribbble.svelte",
        "git-branch.svelte": "GitBranch.svelte",
      };

      Object.entries(testFiles).forEach(([outputFile, expectedFile]) => {
        const outputPath = path.join(testOutputDir, outputFile);
        const expectedPath = path.resolve(
          __dirname,
          `data/feather/${expectedFile}`
        );

        const output = fs.readFileSync(outputPath, "utf8");
        const expected = fs.readFileSync(expectedPath, "utf8");

        expect(output.split(/\r?\n/)).toEqual(expected.split(/\r?\n/));
      });
    });

    it("should generate correct Svelte components for custom icons", () => {
      const inputDir = path.resolve(__dirname, "data/custom");
      const result = runCli([inputDir, testOutputDir]);

      expect(result.exitCode).toBe(0);

      const testFiles = {
        "square.svelte": "Square.svelte",
        "group.svelte": "Group.svelte",
      };

      Object.entries(testFiles).forEach(([outputFile, expectedFile]) => {
        const outputPath = path.join(testOutputDir, outputFile);
        const expectedPath = path.resolve(
          __dirname,
          `data/custom/${expectedFile}`
        );

        const output = fs.readFileSync(outputPath, "utf8");
        const expected = fs.readFileSync(expectedPath, "utf8");

        expect(output.split(/\r?\n/)).toEqual(expected.split(/\r?\n/));
      });
    });
  });

  describe("integration tests (via npx tsx)", () => {
    it("should work when called via npx tsx - success case", () => {
      const inputPath = path.resolve(__dirname, "data/feather/activity.svg");
      const result = runCliIntegration([inputPath, testOutputDir]);

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain("Processing:");

      const outputPath = path.join(testOutputDir, "activity.svelte");
      expect(fs.existsSync(outputPath)).toBe(true);
    });

    it("should work when called via npx tsx - failure case", () => {
      const result = runCliIntegration(["non-existent.svg", testOutputDir]);

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain("Input path does not exist");
    });
  });
});