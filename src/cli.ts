#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { Options, svgToSvelte } from "./index";

export interface CliResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

export function runCli(args: string[]): CliResult {
  let stdout = "";
  let stderr = "";

  const log = (msg: string) => { stdout += msg + "\n"; };
  const error = (msg: string) => { stderr += msg + "\n"; };

  if (args.length < 1) {
    error("Usage: svg-to-svelte <input-dir-or-svg-file> [output-dir] [--include-class]");
    return { exitCode: 1, stdout, stderr };
  }

  const input = args[0];
  // If output directory is not provided, default to the input's directory
  let outputDir: string;
  const outputArg = args[1];
  if (outputArg && !outputArg.startsWith("--")) {
    outputDir = outputArg;
  } else {
    outputDir = fs.statSync(input).isDirectory() ? input : path.dirname(input);
  }

  const includeClass = args.includes("--include-class");

  if (!fs.existsSync(input)) {
    error(`Error: Input path does not exist: ${input}`);
    return { exitCode: 1, stdout, stderr };
  }

  const stats = fs.statSync(input);

  if (stats.isFile()) {
    if (!input.endsWith(".svg")) {
      error("Error: Input file must be an SVG file (.svg)");
      return { exitCode: 1, stdout, stderr };
    }
    try {
      processSvgFile(input, outputDir, log, { includeClass });
      return { exitCode: 0, stdout, stderr };
    } catch (err) {
      error(`Failed to process ${path.basename(input)}:`);
      if (err instanceof Error) error(`  ${err.message}`);
      return { exitCode: 1, stdout, stderr };
    }
  } else if (stats.isDirectory()) {
    const files = fs.readdirSync(input).filter(f => f.endsWith(".svg"));
    if (files.length === 0) {
      error(`Error: No .svg files found in ${input}`);
      return { exitCode: 1, stdout, stderr };
    }

    log(`Found ${files.length} SVG file(s)`);

    let successCount = 0, errorCount = 0;
    for (const file of files) {
      const inputPath = path.join(input, file);
      try {
        processSvgFile(inputPath, outputDir, log, { includeClass });
        successCount++;
      } catch (err) {
        errorCount++;
        error(`Failed to process ${file}:`);
        if (err instanceof Error) error(`  ${err.message}`);
      }
    }

    log(`\nComplete: ${successCount} succeeded, ${errorCount} failed`);
    return { exitCode: errorCount > 0 ? 1 : 0, stdout, stderr };
  } else {
    error("Error: Input must be a file or directory");
    return { exitCode: 1, stdout, stderr };
  }
}

function processSvgFile(
  inputPath: string,
  outputDir: string,
  log: (msg: string) => void,
  options: Options
) {
  const svelteFileName = getSvelteFileName(inputPath);
  const outputPath = path.join(outputDir, svelteFileName);

  log(`Processing: ${inputPath}`);
  const svgContent = fs.readFileSync(inputPath, "utf-8");

  const svelteComponent = svgToSvelte(svgContent, options);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, svelteComponent, "utf-8");

  log(`  → ${outputPath}`);
}

/**
 * Generates the .svelte component file name for an SVG file.
 * Example: "arrow-left.svg" → "ArrowLeft.svelte"
 */
export function getSvelteFileName(inputPath: string): string {
  const baseName = path.basename(inputPath, ".svg");
  return `${toPascalCase(baseName)}.svelte`;
}

/**
 * Converts a string like:
 * - "icon-name" → "IconName"
 * - "icon_name" → "IconName"
 * - "iconName" → "IconName"
 */
export function toPascalCase(name: string): string {
  return name
    // replace separators with spaces
    .replace(/[-_]/g, " ")
    // add space before uppercase letters (camelCase support)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    // split by spaces, capitalize and join
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}


// Only run main when executed directly (not when imported)
if (require.main === module) {
  const result = runCli(process.argv.slice(2));

  if (result.stdout) {
    console.log(result.stdout);
  }

  if (result.stderr) {
    console.error(result.stderr);
  }

  process.exit(result.exitCode);
}