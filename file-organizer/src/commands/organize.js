// organize.js - Command to organize files based on analysis

import fs from "fs";
import path from "path";
import chalk from "chalk";

// Function to register the organize command
export function organizeCommand(program) {
  program
    .command("organize")
    .description("Organize files based on analysis")
    .argument("<input>", "Input file with analysis results")
    .option("-d, --destination <directory>", "Destination directory for organized files")
    .option("-c, --copy", "Copy files instead of moving them", false)
    .action(async (input, options) => {
      try {
        console.log(chalk.blue("Starting file organization..."));
        
        // Read analysis results
        const analysisData = JSON.parse(fs.readFileSync(input, "utf8"));
        
        console.log(chalk.green("
Organization complete!"));
        
      } catch (error) {
        console.error(chalk.red(`Error during organization: ${error.message}`));
        process.exit(1);
      }
    });
}
