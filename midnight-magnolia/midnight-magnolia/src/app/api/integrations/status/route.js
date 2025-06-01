import { NextResponse } from 'next/server';
import clientPromise from '../../../../../lib/mongodb';
import notionService from '../../../../../lib/notion';
import wasabiStorage from '../../../../../lib/wasabi';

export async function GET() {
  const integrations = {
    mongodb: { connected: false, error: null },
    notion: { connected: false, error: null },
    wasabi: { connected: false, error: null },
    dropbox: { connected: false, error: null },
  };

  // Test MongoDB connection
  try {
    const client = await clientPromise;
    const db = client.db('midnight-magnolia');
    await db.stats();
    integrations.mongodb.connected = true;
  } catch (error) {
    integrations.mongodb.error = error.message;
  }

  // Test Notion connection
  try {
    if (process.env.NOTION_API_KEY) {
      // Try to get user info to test connection
      const response = await fetch('https://api.notion.com/v1/users/me', {
        headers: {
          'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
          'Notion-Version': '2022-06-28',
        },
      });
      if (response.ok) {
        integrations.notion.connected = true;
      } else {
        integrations.notion.error = 'API key invalid or expired';
      }
    } else {
      integrations.notion.error = 'API key not configured';
    }
  } catch (error) {
    integrations.notion.error = error.message;
  }

  // Test Wasabi connection
  try {
    if (process.env.WASABI_ACCESS_KEY && process.env.WASABI_SECRET_KEY) {
      const result = await wasabiStorage.listFiles();
      integrations.wasabi.connected = result.success;
      if (!result.success) {
        integrations.wasabi.error = result.error;
      }
    } else {
      integrations.wasabi.error = 'Credentials not configured';
    }
  } catch (error) {
    integrations.wasabi.error = error.message;
  }

  // Dropbox status (placeholder - would need Dropbox API integration)
  integrations.dropbox.error = 'Integration not implemented yet';

  return NextResponse.json({
    success: true,
    integrations,
    timestamp: new Date().toISOString(),
  });
} 