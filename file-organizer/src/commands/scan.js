// scan.js - Command to scan directories and catalog files

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import chalk from 'chalk';
import ProgressBar from 'progress';
import { fileTypeFromFile } from 'file-type';
import md5File from 'md5-file';

// Function to register the scan command
export function scanCommand(program) {
  program
    .command('scan')
    .description('Scan directories and catalog files')
    .argument('[directories...]', 'Directories to scan (default: home directory)')
    .option('-d, --depth <number>', 'Maximum depth for recursive scanning', parseInt)
    .option('-e, --exclude <patterns>', 'Patterns to exclude (comma-separated)')
    .option('-o, --output <file>', 'Output file for scan results')
    .action(async (directories, options) => {
      try {
        // Use provided directories or default to home directory
        const dirsToScan = directories.length > 0 
          ? directories 
          : [process.env.HOME || process.env.USERPROFILE];
        
        console.log(chalk.blue('Starting file scan...'));
        console.log(chalk.gray(`Directories to scan: ${dirsToScan.join(', ')}`));
        
        // Scan files
        const files = await scanFiles(dirsToScan, options);
        
        console.log(chalk.green(`\nScan complete! Found ${files.length} files.`));
        
        // Save results if output file specified
        if (options.output) {
          fs.writeFileSync(options.output, JSON.stringify(files, null, 2));
          console.log(chalk.blue(`Results saved to ${options.output}`));
        }
      } catch (error) {
        console.error(chalk.red(`Error during scan: ${error.message}`));
        process.exit(1);
      }
    });
}

// Function to scan files in directories
async function scanFiles(directories, options) {
  const files = [];
  const excludePatterns = options.exclude ? options.exclude.split(',') : [];
  const maxDepth = options.depth || 0;
  
  // Create progress bar
  const bar = new ProgressBar('[:bar] :current/:total files (:percent) :etas', {
    total: 100,
    width: 30,
    complete: '=',
    incomplete: ' '
  });
  
  // Process each directory
  for (const directory of directories) {
    try {
      // Get all files recursively
      const pattern = path.join(directory, maxDepth > 0 ? `**/`.repeat(maxDepth) : '**/*');
      const matches = await glob(pattern, { 
        ignore: excludePatterns,
        nodir: true
      });
      
      // Update progress bar total
      bar.total = matches.length;
      bar.update(0);
      
      // Process each file
      let processed = 0;
      for (const filePath of matches) {
        try {
          const stats = fs.statSync(filePath);
          const fileInfo = {
            path: filePath,
            name: path.basename(filePath),
            extension: path.extname(filePath).toLowerCase(),
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime,
            accessed: stats.atime
          };
          
          // Get file type if possible
          try {
            const fileType = await fileTypeFromFile(filePath);
            if (fileType) {
              fileInfo.mimeType = fileType.mime;
              fileInfo.fileType = fileType.ext;
            }
          } catch (e) {
            // Ignore file type errors
          }
          
          // Calculate hash for duplicate detection
          try {
            fileInfo.hash = await md5File(filePath);
          } catch (e) {
            // Ignore hash errors
          }
          
          files.push(fileInfo);
        } catch (error) {
          console.error(chalk.yellow(`Error processing file ${filePath}: ${error.message}`));
        }
        
        // Update progress
        processed++;
        bar.update(processed / matches.length);
      }
    } catch (error) {
      console.error(chalk.yellow(`Error scanning directory ${directory}: ${error.message}`));
    }
  }
  
  return files;
}
