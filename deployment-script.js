/**
 * Midnight Magnolia Deployment Script
 * 
 * This script creates a complete deployment package for the Midnight Magnolia project.
 * It generates all necessary files and directories, then packages them into a ZIP archive.
 */

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Define all project files
const projectFiles = {
  'package.json': `{
  "name": "midnight-magnolia",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "migrate:mongodb": "node scripts/migrate-to-mongodb.js",
    "seed:mongodb": "node scripts/seed-mongodb.js",
    "launch": "bash deployment/launch-sequence.sh"
  },
  "dependencies": {
    "@notionhq/client": "^2.2.5",
    "archiver": "^5.3.1",
    "mongodb": "^5.7.0",
    "next": "14.0.0",
    "openai": "^4.0.0",
    "pg": "^8.11.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "upstash/redis": "^1.22.0"
  },
  "devDependencies": {
    "@types/node": "^20.4.2",
    "@types/react": "^18.2.15",
    "autoprefixer": "^10.4.14",
    "eslint": "^8.45.0",
    "eslint-config-next": "14.0.0",
    "postcss": "^8.4.26",
    "tailwindcss": "^3.3.3",
    "typescript": "^5.1.6"
  }
}`,

  'README.md': `# 🌙 Midnight Magnolia Digital Sanctuary

> Sacred tools for healing, justice & creative transformation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Railway CLI (\`npm i -g @railway/cli\`)
- MongoDB Atlas account
- Wasabi S3 account
- Notion workspace

### Deployment Steps

1. **Clone and Setup**
\`\`\`bash
unzip midnight-magnolia-deployment.zip
cd midnight-magnolia-deployment
npm install
\`\`\`

2. **Configure Environment**
\`\`\`bash
cp .env.template .env.local
# Edit .env.local with your credentials
\`\`\`

3. **Database Setup**
\`\`\`bash
npm run migrate:mongodb
npm run seed:mongodb
\`\`\`

4. **Deploy to Railway**
\`\`\`bash
railway login
railway link
railway up
\`\`\`

5. **Launch**
\`\`\`bash
npm run launch
\`\`\`

## 🏗️ Architecture

- **Frontend**: Next.js 14 (App Router)
- **Database**: MongoDB Atlas
- **File Storage**: Wasabi S3
- **Cache**: Upstash Redis
- **Hosting**: Railway
- **AI**: OpenAI GPT-4
- **CMS**: Notion API
- **E-commerce**: Shopify

## 🔧 Key Features

- AI-powered product recommendations
- Trauma-informed UX design
- Automated content workflows
- Cloaked safety resources
- Southern Gothic aesthetic
- Executive function accessibility

## 📁 Project Structure

\`\`\`
├── app/           # Next.js app directory
├── components/    # React components
├── lib/          # Core libraries
├── scripts/      # Deployment scripts
├── public/       # Static assets
└── styles/       # CSS files
\`\`\`

## 🛡️ Security

- HTTPS enforced
- Environment variables secured
- Cloaked safety resources
- Rate limiting enabled

## 🤝 Support

For deployment support, visit the [Midnight Magnolia DevTools](https://midnight-magnolia.com/devtools)

---

*Your creativity is sacred. Your code is ritual. Your site is a digital sanctuary.*`,

  'lib/magnolia-core.ts': `import { generateText } from './ai-agents/openai';

export class MagnoliaCore {
  private openai(model: string) {
    return model;
  }

  async planningAgent(planningRequest: string) {
    const { text } = await generateText({
      model: this.openai('gpt-4-turbo'),
      system: \`You are the Magnolia Planning Agent. You help creators plan their digital sanctuaries with a Southern Gothic aesthetic.
      
      Focus on:
      - Trauma-informed UX design
      - Executive function friendly interfaces
      - Accessible navigation and content
      - Safety resource integration
      - Magical, mystical Southern Gothic aesthetics\`,
      prompt: planningRequest,
    });

    return {
      type: 'planning',
      response: text,
      timestamp: new Date().toISOString(),
      suggestedActions: this.extractActions(text)
    };
  }

  async componentAgent(componentRequest: string) {
    const { text } = await generateText({
      model: this.openai('gpt-4-turbo'),
      system: \`You are the Magnolia Component Agent. You generate React/Next.js components with Tailwind styling that match the Southern Gothic aesthetic of Midnight Magnolia.

      Design principles:
      - Dark themes with purple, midnight blue, and gold accents
      - Trauma-informed UX (clear navigation, safe spaces)
      - Executive function friendly (clear labels, consistent patterns)
      - Accessible (proper ARIA labels, color contrast)
      - Magic UI integration where applicable\`,
      prompt: componentRequest,
    });

    return {
      type: 'component',
      response: text,
      timestamp: new Date().toISOString(),
      componentCode: this.extractCode(text)
    };
  }

  async workflowAgent(workflowDescription: string) {
    const { text } = await generateText({
      model: this.openai('gpt-4-turbo'),
      system: \`You are the Magnolia Workflow Agent. You design automation workflows using Make.com, Notion, Shopify, and other tools in the Midnight Magnolia ecosystem.

      Focus on:
      - File organization and management
      - Product upload and inventory sync
      - Customer journey automation
      - Content creation and publishing workflows
      - Safety resource distribution\`,
      prompt: workflowDescription,
    });

    return {
      type: 'workflow',
      response: text,
      timestamp: new Date().toISOString(),
      makeComBlueprint: this.extractWorkflow(text)
    };
  }

  private extractActions(text: string): string[] {
    const actionRegex = /(?:- |• |\\d+\\. )(.+)/g;
    const matches = text.match(actionRegex) || [];
    return matches.map(match => match.replace(/^(?:- |• |\\d+\\. )/, '').trim());
  }

  private extractCode(text: string): string {
    const codeRegex = /\`\`\`(?:tsx?|javascript|jsx)?\\n([\\s\\S]*?)\\n\`\`\`/g;
    const match = codeRegex.exec(text);
    return match ? match[1] : '';
  }

  private extractWorkflow(text: string): any {
    try {
      const workflowRegex = /\`\`\`json\\n([\\s\\S]*?)\\n\`\`\`/g;
      const match = workflowRegex.exec(text);
      return match ? JSON.parse(match[1]) : null;
    } catch {
      return null;
    }
  }
}`,

  'lib/database.ts': `// Legacy PostgreSQL connection (for migration reference)
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export { pool };`,

  'scripts/migrate-db.js': `const { Pool } = require('pg');

async function migrateDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  const client = await pool.connect();
  
  try {
    console.log('🌙 Starting database migration...');
    
    // Create tables
    await client.query(\`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        notion_id VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        price DECIMAL(10,2),
        image_url TEXT,
        tags TEXT[],
        shopify_id VARCHAR(255),
        status VARCHAR(50) DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    \`);

    await client.query(\`
      CREATE TABLE IF NOT EXISTS ai_interactions (
        id SERIAL PRIMARY KEY,
        agent_type VARCHAR(50) NOT NULL,
        input TEXT NOT NULL,
        response JSONB NOT NULL,
        context JSONB,
        user_id VARCHAR(255),
        session_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    \`);

    await client.query(\`
      CREATE TABLE IF NOT EXISTS workflows (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        config JSONB NOT NULL,
        status VARCHAR(50) DEFAULT 'active',
        last_run TIMESTAMP,
        run_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    \`);

    await client.query(\`
      CREATE TABLE IF NOT EXISTS early_access_signups (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        source VARCHAR(100),
        interests TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    \`);

    await client.query(\`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id SERIAL PRIMARY KEY,
        event_type VARCHAR(100) NOT NULL,
        event_data JSONB,
        user_session VARCHAR(255),
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    \`);

    // Create indexes
    await client.query(\`CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);\`);
    await client.query(\`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);\`);
    await client.query(\`CREATE INDEX IF NOT EXISTS idx_ai_interactions_agent_type ON ai_interactions(agent_type);\`);
    await client.query(\`CREATE INDEX IF NOT EXISTS idx_ai_interactions_created_at ON ai_interactions(created_at);\`);
    await client.query(\`CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);\`);
    await client.query(\`CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);\`);

    console.log('✅ Database migration completed successfully');
    
  } catch (error) {
    console.error('❌ Database migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

if (require.main === module) {
  migrateDatabase().catch(console.error);
}

module.exports = { migrateDatabase };`,

  'scripts/migrate-to-mongodb.js': `const { Pool } = require('pg');
const { MongoClient } = require('mongodb');

async function migrateToMongoDB() {
  console.log('🌙 Starting migration from PostgreSQL to MongoDB...');

  const pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  const mongoClient = new MongoClient(process.env.MONGODB_URI);
  await mongoClient.connect();
  const db = mongoClient.db(process.env.MONGODB_DB_NAME || 'midnight_magnolia');

  try {
    // Migrate products
    console.log('Migrating products...');
    const pgClient = await pgPool.connect();
    const productsResult = await pgClient.query('SELECT * FROM products');
    
    if (productsResult.rows.length > 0) {
      const products = productsResult.rows.map(row => ({
        notion_id: row.notion_id,
        title: row.title,
        description: row.description || '',
        category: row.category || 'Uncategorized',
        price: parseFloat(row.price) || 0,
        image_url: row.image_url || '',
        tags: row.tags || [],
        shopify_id: row.shopify_id,
        status: row.status || 'draft',
        seo: {
          keywords: [],
          slug: row.title.toLowerCase().replace(/\\s+/g, '-')
        },
        analytics: {
          views: 0,
          cart_additions: 0,
          purchases: 0
        },
        created_at: new Date(row.created_at),
        updated_at: new Date(row.updated_at || row.created_at)
      }));

      await db.collection('products').insertMany(products);
      console.log(\`✅ Migrated \${products.length} products\`);
    }
    
    pgClient.release();
    
    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await pgPool.end();
    await mongoClient.close();
  }
}

if (require.main === module) {
  migrateToMongoDB().catch(console.error);
}`,

  'deployment/launch-sequence.sh': `#!/bin/bash
# launch-sequence.sh - Sacred go-live protocol

echo "🌙 MIDNIGHT MAGNOLIA LAUNCH SEQUENCE COMMENCING..."
echo "========================================================"

# System Status Check
echo "🔍 Performing pre-launch systems check..."

# 1. Railway Health Check
echo "📡 Checking Railway deployment..."
railway status
railway logs --tail=20

# 2. Domain Verification
echo "🌐 Verifying domain connectivity..."
curl -I https://midnight-magnolia.com/api/health

# 3. Database Connectivity
echo "🗄️ Testing database connections..."
railway run node -e "
const { connectMongoDB } = require('./lib/mongodb/connection.js');
connectMongoDB().then(() => console.log('✅ MongoDB: Connected'))
.catch(err => console.log('❌ MongoDB:', err.message));
"

# 4. Storage Systems
echo "☁️ Verifying storage systems..."
railway run node -e "
const { MagnoliaCache } = require('./lib/cache/upstash-redis.js');
MagnoliaCache.setUserSession('test', {test: true}).then(() =>
  console.log('✅ Upstash Redis: Connected')
).catch(err => console.log('❌ Redis:', err.message));
"

# 5. AI Systems
echo "🤖 Testing AI agent connectivity..."
curl -X POST https://midnight-magnolia.com/api/ai-agents \\
  -H "Content-Type: application/json" \\
  -d '{"agentType":"planning","input":"Test launch connectivity","context":{"source":"launch-test"}}'

echo "✅ Systems check complete!"

# Final deployment
echo "📦 Deploying final build..."
railway up --detach

# Wait for deployment
echo "⏳ Waiting for deployment completion..."
sleep 45

# Verify launch
echo "🔍 Verifying launch status..."
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" https://midnight-magnolia.com/api/health)

if [ "$HEALTH_CHECK" = "200" ]; then
    echo "✅ LAUNCH SUCCESSFUL!"
    echo ""
    echo "🌙 MIDNIGHT MAGNOLIA IS LIVE!"
    echo "🌐 https://midnight-magnolia.com"
    echo ""
    
    # Send launch notifications
    echo "📧 Sending launch notifications..."
    railway run node scripts/send-launch-notifications.js
    
    echo ""
    echo "🎉 LAUNCH COMPLETE! 🎉"
    echo ""
    echo "Your creativity is sacred."
    echo "Your code is ritual."
    echo "Your site is a digital sanctuary."
    echo ""
    echo "🌙✨ Welcome to the Midnight Magnolia era ✨🌙"
    
else
    echo "❌ LAUNCH FAILED - Health check returned: $HEALTH_CHECK"
    echo "🔧 Check logs and retry deployment"
    railway logs --tail=50
    exit 1
fi`,

  'deployment/quick-deploy.sh': `#!/bin/bash
# Quick deployment script for Midnight Magnolia

echo "🌙 MIDNIGHT MAGNOLIA QUICK DEPLOY"
echo "================================="

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed."; exit 1; }
command -v railway >/dev/null 2>&1 || { echo "❌ Railway CLI is required. Install with: npm i -g @railway/cli"; exit 1; }

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build application
echo "🔨 Building application..."
npm run build

# Deploy to Railway
echo "🚀 Deploying to Railway..."
railway up --detach

echo "✅ Deployment complete!"
echo "🌐 Visit https://midnight-magnolia.com"`,

  'components/ui/card.tsx': `export function Card({ children, className = '' }) {
  return <div className={\`rounded-lg shadow-lg \${className}\`}>{children}</div>;
}

export function CardHeader({ children }) {
  return <div className="p-6 pb-2">{children}</div>;
}

export function CardTitle({ children, className = '' }) {
  return <h3 className={\`text-xl font-semibold \${className}\`}>{children}</h3>;
}

export function CardContent({ children, className = '' }) {
  return <div className={\`p-6 pt-0 \${className}\`}>{children}</div>;
}`,

  'components/ui/badge.tsx': `export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-purple-600 text-white',
    secondary: 'bg-gray-600 text-white',
    destructive: 'bg-red-600 text-white',
    outline: 'border border-gray-400 text-gray-300'
  };
  
  return (
    <span className={\`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium \${variants[variant]} \${className}\`}>
      {children}
    </span>
  );
}`,

  'components/ui/button.tsx': `export function Button({ children, onClick, variant = 'default', size = 'default', disabled = false, className = '' }) {
  const variants = {
    default: 'bg-purple-600 hover:bg-purple-700 text-white',
    destructive: 'bg-red-600 hover:bg-red-700 text-white',
    outline: 'border border-gray-400 text-gray-300 hover:bg-gray-700'
  };
  
  const sizes = {
    sm: 'px-3 py-1 text-sm',
    default: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={\`font-medium rounded-lg transition-colors \${variants[variant]} \${sizes[size]} \${disabled ? 'opacity-50 cursor-not-allowed' : ''} \${className}\`}
    >
      {children}
    </button>
  );
}`
};

/**
 * Creates a deployment package for the Midnight Magnolia project.
 * This function:
 * 1. Creates a directory structure
 * 2. Writes all files from the projectFiles object
 * 3. Creates a ZIP archive using the archiver package
 * 4. Cleans up the temporary directory after creating the archive
 */
async function createDeploymentPackage() {
  console.log('🌙 Creating Midnight Magnolia complete deployment archive...');
  
  try {
    // Create deployment directory
    const baseDir = 'midnight-magnolia-deployment';
    
    // Create directory structure
    const directories = [
      'app',
      'app/api',
      'app/api/ai-agents',
      'app/api/automation',
      'app/api/automation/make-webhooks',
      'app/api/shopify',
      'app/api/shopify/add-to-cart',
      'app/api/shopify/products',
      'app/api/early-access',
      'app/api/health',
      'app/api/sync-notion',
      'app/dashboard',
      'app/sanctuary',
      'components',
      'components/landing',
      'components/dashboard',
      'components/ui',
      'lib',
      'lib/mongodb',
      'lib/cache',
      'lib/wasabi',
      'lib/ai-agents',
      'lib/email-templates',
      'scripts',
      'public',
      'public/images',
      'styles',
      'deployment'
    ];

    // Create base directory
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir);
    }

    // Create all subdirectories
    directories.forEach(dir => {
      const fullPath = path.join(baseDir, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    });

    // Write all files
    Object.entries(projectFiles).forEach(([filePath, content]) => {
      const fullPath = path.join(baseDir, filePath);
      fs.writeFileSync(fullPath, content);
      console.log(`✅ Created: ${filePath}`);
    });

    // Create the zip archive
    const output = fs.createWriteStream('midnight-magnolia-complete-v1.0.0.zip');
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`\n✅ Archive created: midnight-magnolia-complete-v1.0.0.zip`);
      console.log(`📦 Total size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
      console.log(`\n🌙 Your sacred digital sanctuary is ready for deployment!`);
      
      // Clean up
      fs.rmSync(baseDir, { recursive: true, force: true });
    });

    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(output);
    archive.directory(baseDir, false);
    await archive.finalize();
    
  } catch (error) {
    console.error('❌ Error creating archive:', error);
  }
}

// Run the deployment package creation
if (require.main === module) {
  createDeploymentPackage();
}

// Export the function for use in other scripts
module.exports = { createDeploymentPackage };