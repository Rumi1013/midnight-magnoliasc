# Midnight Magnolia File Organizer

A comprehensive file organization and analysis system for the Midnight Magnolia digital ecosystem.

## Features

- **File Scanning**: Recursively scan directories to catalog all files
- **Metadata Extraction**: Extract detailed metadata from various file types
- **Duplicate Detection**: Identify duplicate files using content hashing
- **File Classification**: Automatically categorize files based on content and metadata
- **Storage Analysis**: Generate reports on storage usage and optimization opportunities
- **Notion Integration**: Sync file metadata with Notion databases
- **Organization Rules**: Apply custom rules to organize files

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### Configuration

Edit the `.env` file to configure:
- MongoDB connection
- Notion API key
- Default scan directories
- Exclusion patterns

### Usage

```bash
# Scan files in home directory
npm run scan

# Analyze scanned files
npm run analyze

# Organize files based on analysis
npm run organize
```

## Integration with Midnight Magnolia

This file organizer serves as the foundation for the Midnight Magnolia digital ecosystem, providing:

1. Organized content for the website
2. Metadata for digital products
3. File analysis for storage optimization
4. Notion integration for content planning
