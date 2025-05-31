#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

// Midnight Magnolia color palette for terminal output
const colors = {
  midnightBlue: '#0A192F',
  richGold: '#D4AF37',
  magnoliaWhite: '#FAF3E0',
  sageGreen: '#A3B18A'
};

// Configure chalk with our brand colors
const midnight = chalk.hex(colors.midnightBlue);
const gold = chalk.hex(colors.richGold);
const magnolia = chalk.hex(colors.magnoliaWhite);
const sage = chalk.hex(colors.sageGreen);

console.log(gold(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║  ${magnolia('MIDNIGHT MAGNOLIA')} ${midnight('GITHUB RITUAL')}           ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
`));

// Function to execute shell commands with error handling
function execute(command, errorMessage) {
  try {
    console.log(sage(`Executing: ${command}`));
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(midnight(`❌ ${errorMessage || 'Command failed'}`));
    console.error(midnight(error.message));
    return false;
  }
}

// Function to check if git is initialized
function isGitInitialized() {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

// Function to initialize git repository
function initializeGit() {
  console.log(gold('\n🌙 Planting the sacred seed - Initializing Git repository'));
  
  if (isGitInitialized()) {
    console.log(sage('Git repository already initialized'));
    return true;
  }
  
  return execute('git init', 'Failed to initialize Git repository');
}

// Function to create .gitignore
function createGitignore() {
  console.log(gold('\n🌙 Setting boundaries - Creating .gitignore'));
  
  if (fs.existsSync('.gitignore')) {
    console.log(sage('.gitignore already exists'));
    return true;
  }
  
  const gitignoreContent = `
# Dependencies
/node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# Temporary files
*.tmp
*.temp

# Editor directories and files
.idea
.vscode
*.swp
*.swo
`;
  
  fs.writeFileSync('.gitignore', gitignoreContent.trim());
  console.log(sage('Created .gitignore file'));
  return true;
}

// Function to connect to GitHub repository
function connectToGitHub() {
  console.log(gold('\n🌙 Aligning with the stars - Connecting to GitHub repository'));
  
  // Check if remote already exists
  try {
    const remotes = execSync('git remote -v', { stdio: 'pipe' }).toString();
    if (remotes.includes('origin')) {
      console.log(sage('Remote origin already exists'));
      
      // Update the remote URL if needed
      return execute(
        'git remote set-url origin https://github.com/yourusername/midnight-magnoliasc.git',
        'Failed to update remote URL'
      );
    }
  } catch (error) {
    // No remotes exist yet
  }
  
  return execute(
    'git remote add origin https://github.com/yourusername/midnight-magnoliasc.git',
    'Failed to add GitHub remote'
  );
}

// Function to stage and commit changes
function commitChanges() {
  console.log(gold('\n🌙 Preserving the essence - Staging and committing changes'));
  
  // Stage all changes
  if (!execute('git add .', 'Failed to stage changes')) {
    return false;
  }
  
  // Check if there are changes to commit
  try {
    const status = execSync('git status --porcelain', { stdio: 'pipe' }).toString();
    if (!status.trim()) {
      console.log(sage('No changes to commit'));
      return true;
    }
  } catch (error) {
    // Continue with commit anyway
  }
  
  // Commit changes
  return execute(
    'git commit -m "✨ Midnight Magnolia - Southern Gothic Digital Sanctuary"',
    'Failed to commit changes'
  );
}

// Function to push to GitHub
function pushToGitHub() {
  console.log(gold('\n🌙 Ascending to the heavens - Pushing to GitHub'));
  
  // Check if branch exists on remote
  try {
    execSync('git ls-remote --heads origin main', { stdio: 'pipe' });
    // Branch exists, push normally
    return execute('git push -u origin main', 'Failed to push to GitHub');
  } catch (error) {
    // Branch doesn't exist, force push with lease for safety
    return execute('git push -u origin main', 'Failed to push to GitHub');
  }
}

// Function to link with Vercel
function linkWithVercel() {
  console.log(gold('\n🌙 Binding the realms - Linking with Vercel'));
  
  // Check if Vercel CLI is installed
  try {
    execSync('vercel --version', { stdio: 'pipe' });
  } catch (error) {
    console.log(sage('Installing Vercel CLI...'));
    if (!execute('npm install -g vercel', 'Failed to install Vercel CLI')) {
      return false;
    }
  }
  
  // Link with Vercel
  return execute('vercel link', 'Failed to link with Vercel');
}

// Function to deploy to Vercel
function deployToVercel() {
  console.log(gold('\n🌙 Manifesting into reality - Deploying to Vercel'));
  
  return execute('vercel --prod', 'Failed to deploy to Vercel');
}

// Main function
async function main() {
  try {
    // 1. Initialize Git repository
    if (!initializeGit()) {
      process.exit(1);
    }
    
    // 2. Create .gitignore
    if (!createGitignore()) {
      process.exit(1);
    }
    
    // 3. Connect to GitHub repository
    if (!connectToGitHub()) {
      process.exit(1);
    }
    
    // 4. Commit changes
    if (!commitChanges()) {
      process.exit(1);
    }
    
    // 5. Push to GitHub
    if (!pushToGitHub()) {
      process.exit(1);
    }
    
    // 6. Link with Vercel
    if (!linkWithVercel()) {
      process.exit(1);
    }
    
    // 7. Deploy to Vercel
    if (!deployToVercel()) {
      process.exit(1);
    }
    
    console.log(gold(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║  ${magnolia('MIDNIGHT MAGNOLIA')} ${midnight('SUCCESSFULLY DEPLOYED')}    ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
    `));
    
  } catch (error) {
    console.error(midnight('An unexpected error occurred:'));
    console.error(error);
    process.exit(1);
  }
}

// Run the main function
main();