#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { svgToSvelte } from "./index";

function main() {
  const args = process.argv.slice(2);

  if (args.length !== 2) {
    console.error("Usage: svg-to-svelte <input-dir-or-svg-file> <output-dir>");
    process.exit(1);
  }

  const [input, outputDir] = args;

  // Check if input exists
  if (!fs.existsSync(input)) {
    console.error(`Error: Input path does not exist: ${input}`);
    process.exit(1);
  }

  const stats = fs.statSync(input);

  if (stats.isFile()) {
    // Single file
    if (!input.endsWith(".svg")) {
      console.error("Error: Input file must be an SVG file (.svg)");
      process.exit(1);
    }
    processSvgFile(input, outputDir);
  } else if (stats.isDirectory()) {
    // Directory - process all .svg files
    const files = fs.readdirSync(input);
    const svgFiles = files.filter((f) => f.endsWith(".svg"));

    if (svgFiles.length === 0) {
      console.warn(`Warning: No .svg files found in ${input}`);
      process.exit(0);
    }

    console.log(`Found ${svgFiles.length} SVG file(s)`);

    let successCount = 0;
    let errorCount = 0;

    for (const file of svgFiles) {
      const inputPath = path.join(input, file);
      try {
        processSvgFile(inputPath, outputDir);
        successCount++;
      } catch (error) {
        errorCount++;
        console.error(`Failed to process ${file}:`);
        if (error instanceof Error) {
          console.error(`  ${error.message}`);
        }
      }
    }

    console.log(`\nComplete: ${successCount} succeeded, ${errorCount} failed`);

    if (errorCount > 0) {
      process.exit(1);
    }
  } else {
    console.error("Error: Input must be a file or directory");
    process.exit(1);
  }
}

function processSvgFile(inputPath: string, outputDir: string) {
  const fileName = path.basename(inputPath, ".svg");
  const outputPath = path.join(outputDir, `${fileName}.svelte`);

  console.log(`Processing: ${inputPath}`);

  // Read SVG content
  const svgContent = fs.readFileSync(inputPath, "utf-8");

  // Convert to Svelte
  const svelteComponent = svgToSvelte(svgContent);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  // Write output
  fs.writeFileSync(outputPath, svelteComponent, "utf-8");

  console.log(`  → ${outputPath}`);
}

main();
