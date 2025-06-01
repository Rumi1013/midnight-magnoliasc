import { Client } from '@notionhq/client';

class NotionService {
  constructor() {
    this.notion = new Client({
      auth: process.env.NOTION_API_KEY,
    });
  }

  async getDatabasePages(databaseId) {
    try {
      const response = await this.notion.databases.query({
        database_id: databaseId,
      });
      return {
        success: true,
        pages: response.results,
      };
    } catch (error) {
      console.error('Notion database query error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getPage(pageId) {
    try {
      const page = await this.notion.pages.retrieve({
        page_id: pageId,
      });
      return {
        success: true,
        page,
      };
    } catch (error) {
      console.error('Notion page retrieve error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getPageContent(pageId) {
    try {
      const blocks = await this.notion.blocks.children.list({
        block_id: pageId,
      });
      return {
        success: true,
        blocks: blocks.results,
      };
    } catch (error) {
      console.error('Notion page content error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async createPage(databaseId, properties, children = []) {
    try {
      const response = await this.notion.pages.create({
        parent: {
          database_id: databaseId,
        },
        properties,
        children,
      });
      return {
        success: true,
        page: response,
      };
    } catch (error) {
      console.error('Notion page creation error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async updatePage(pageId, properties) {
    try {
      const response = await this.notion.pages.update({
        page_id: pageId,
        properties,
      });
      return {
        success: true,
        page: response,
      };
    } catch (error) {
      console.error('Notion page update error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

export default new NotionService(); 