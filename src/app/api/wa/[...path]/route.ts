import { NextRequest, NextResponse } from 'next/server';

const WHATSAPP_SERVICE = 'http://localhost:3030';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const url = new URL(request.url);
  const targetUrl = `${WHATSAPP_SERVICE}/${path.join('/')}?${url.searchParams.toString()}`;
  
  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('WA API proxy error:', error);
    return NextResponse.json({ error: 'Proxy error', details: String(error) }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const url = new URL(request.url);
  const targetUrl = `${WHATSAPP_SERVICE}/${path.join('/')}?${url.searchParams.toString()}`;
  
  try {
    // Get raw body text first
    const rawBody = await request.text();
    console.log('[WA API] POST to:', targetUrl, 'Body:', rawBody);
    
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: rawBody || undefined,
    });
    
    // Try to parse response as JSON, fallback to text
    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { raw: responseText };
    }
    
    console.log('[WA API] Response:', response.status, data);
    
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('WA API proxy POST error:', error);
    return NextResponse.json({ error: 'Proxy error', details: String(error) }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const url = new URL(request.url);
  const targetUrl = `${WHATSAPP_SERVICE}/${path.join('/')}?${url.searchParams.toString()}`;
  
  try {
    let body = null;
    try {
      body = await request.json();
    } catch {
      // No body
    }
    
    const response = await fetch(targetUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    
    const data = await response.json();
    
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('WA API proxy DELETE error:', error);
    return NextResponse.json({ error: 'Proxy error' }, { status: 500 });
  }
}
