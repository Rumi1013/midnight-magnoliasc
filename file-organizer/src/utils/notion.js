// notion.js - Notion API integration utility

import { Client } from "@notionhq/client";
import chalk from "chalk";

// Initialize Notion client
export function initNotionClient() {
  try {
    const apiKey = process.env.NOTION_API_KEY;
    
    if (!apiKey) {
      console.warn(chalk.yellow("Notion API key not found in environment variables. Notion integration will be disabled."));
      return null;
    }
    
    return new Client({ auth: apiKey });
  } catch (error) {
    console.error(chalk.red(`Error initializing Notion client: ${error.message}`));
    return null;
  }
}

// Sync file metadata to Notion database
export async function syncFileMetadataToNotion(notion, fileMetadata) {
  try {
    if (!notion) {
      console.warn(chalk.yellow("Notion client not initialized. Skipping sync."));
      return null;
    }
    
    const databaseId = process.env.NOTION_DATABASE_ID;
    
    if (!databaseId) {
      console.warn(chalk.yellow("Notion database ID not found in environment variables. Skipping sync."));
      return null;
    }
    
    console.log(chalk.blue(`Syncing file metadata to Notion database ${databaseId}...`));
    
    // Create a new page in the database
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: fileMetadata.name
              }
            }
          ]
        },
        Path: {
          rich_text: [
            {
              text: {
                content: fileMetadata.path
              }
            }
          ]
        },
        Extension: {
          select: {
            name: fileMetadata.extension || "none"
          }
        },
        Size: {
          number: fileMetadata.size
        },
        "File Type": {
          select: {
            name: fileMetadata.fileType || "unknown"
          }
        },
        "Last Modified": {
          date: {
            start: fileMetadata.modified ? new Date(fileMetadata.modified).toISOString() : null
          }
        }
      }
    });
    
    console.log(chalk.green("File metadata synced to Notion successfully!"));
    
    return response;
  } catch (error) {
    console.error(chalk.red(`Error syncing file metadata to Notion: ${error.message}`));
    return null;
  }
}
