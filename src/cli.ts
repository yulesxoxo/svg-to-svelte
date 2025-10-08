#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { svgToSvelte } from "./index";

export interface CliResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

export function runCli(args: string[]): CliResult {
  let stdout = "";
  let stderr = "";

  const log = (msg: string) => {
    stdout += msg + "\n";
  };

  const error = (msg: string) => {
    stderr += msg + "\n";
  };

  if (args.length !== 2) {
    error("Usage: svg-to-svelte <input-dir-or-svg-file> <output-dir>");
    return { exitCode: 1, stdout, stderr };
  }

  const [input, outputDir] = args;

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
      processSvgFile(input, outputDir, log);
      return { exitCode: 0, stdout, stderr };
    } catch (err) {
      error(`Failed to process ${path.basename(input)}:`);
      if (err instanceof Error) {
        error(`  ${err.message}`);
      }
      return { exitCode: 1, stdout, stderr };
    }
  } else if (stats.isDirectory()) {
    const files = fs.readdirSync(input);
    const svgFiles = files.filter((f) => f.endsWith(".svg"));

    if (svgFiles.length === 0) {
      error(`Error: No .svg files found in ${input}`);
      return { exitCode: 1, stdout, stderr };
    }

    log(`Found ${svgFiles.length} SVG file(s)`);

    let successCount = 0;
    let errorCount = 0;

    for (const file of svgFiles) {
      const inputPath = path.join(input, file);
      try {
        processSvgFile(inputPath, outputDir, log);
        successCount++;
      } catch (err) {
        errorCount++;
        error(`Failed to process ${file}:`);
        if (err instanceof Error) {
          error(`  ${err.message}`);
        }
      }
    }

    log(`\nComplete: ${successCount} succeeded, ${errorCount} failed`);

    return { exitCode: errorCount > 0 ? 1 : 0, stdout, stderr };
  } else {
    error("Error: Input must be a file or directory");
    return { exitCode: 1, stdout, stderr };
  }
}

function processSvgFile(inputPath: string, outputDir: string, log: (msg: string) => void) {
  const fileName = path.basename(inputPath, ".svg");
  const outputPath = path.join(outputDir, `${fileName}.svelte`);

  log(`Processing: ${inputPath}`);
  const svgContent = fs.readFileSync(inputPath, "utf-8");
  const svelteComponent = svgToSvelte(svgContent);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, svelteComponent, "utf-8");

  log(`  → ${outputPath}`);
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