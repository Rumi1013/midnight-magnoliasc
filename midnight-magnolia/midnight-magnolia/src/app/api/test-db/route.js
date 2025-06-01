import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('midnight-magnolia');
    
    // Test the connection by getting database stats
    const stats = await db.stats();
    
    return NextResponse.json({
      success: true,
      message: 'Database connected successfully!',
      database: 'midnight-magnolia',
      collections: stats.collections || 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    }, { status: 500 });
  }
} 