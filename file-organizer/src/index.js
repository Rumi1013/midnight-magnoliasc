#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import commands
import { scanCommand } from "./commands/scan.js";
import { analyzeCommand } from "./commands/analyze.js";
import { organizeCommand } from "./commands/organize.js";

// ASCII art for Midnight Magnolia
const displayBanner = () => {
  console.log(chalk.magenta(`
  ╔═══════════════════════════════════════════════════════════════════════════╗
  ║                                                                           ║
  ║   ${chalk.bold("Midnight Magnolia File Organizer")}                                       ║
  ║                                                                           ║
  ║   ${chalk.italic("Organize, Analyze, and Optimize Your Digital Content")}                 ║
  ║                                                                           ║
  ╚═══════════════════════════════════════════════════════════════════════════╝
  `));
};

// Create CLI program
const program = new Command();

// Set program information
program
  .name("midnight-magnolia-file-organizer")
  .description("File organization and analysis system for Midnight Magnolia")
  .version("1.0.0");

// Register commands
scanCommand(program);
analyzeCommand(program);
organizeCommand(program);

// Display banner and parse arguments
displayBanner();
program.parse(process.argv);

// If no arguments, display help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
