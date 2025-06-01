import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    console.error('Notion OAuth error:', error);
    return NextResponse.redirect(new URL('/?error=notion_auth_failed', request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/?error=no_code', request.url));
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://api.notion.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`).toString('base64')}`,
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.NOTION_REDIRECT_URI,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error(`Token exchange failed: ${tokenData.error}`);
    }

    // Store the access token securely (you might want to save this to your database)
    // For now, we'll redirect with success
    const successUrl = new URL('/', request.url);
    successUrl.searchParams.set('notion_connected', 'true');
    
    return NextResponse.redirect(successUrl);

  } catch (error) {
    console.error('Notion OAuth callback error:', error);
    return NextResponse.redirect(new URL('/?error=token_exchange_failed', request.url));
  }
} 