import { NextRequest, NextResponse } from 'next/server';

interface MCPRequest {
  jsonrpc: string;
  method: string;
  id: number;
  params?: Record<string, any>;
}

interface MCPResponse {
  jsonrpc: string;
  id: number;
  result?: any;
  error?: {
    code: number;
    message: string;
  };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: MCPRequest = await request.json();
    
    // Validate request
    if (!body.jsonrpc || !body.method || !body.id) {
      return NextResponse.json(
        { error: 'Invalid MCP request format' },
        { status: 400 }
      );
    }

    const response = await fetch('http://localhost:8000/mcp/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
        ...Object.fromEntries(request.headers.entries()),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`MCP server responded with status: ${response.status}`);
    }

    const responseData: MCPResponse = await response.json();
    const responseHeaders = new Headers();
    
    // Copy all headers from the MCP server response
    response.headers.forEach((value, key) => {
      responseHeaders.set(key, value);
    });

    return NextResponse.json(responseData, {
      status: response.status,
      headers: responseHeaders,
    });

  } catch (error) {
    console.error('MCP Proxy Error:', error);
    
    return NextResponse.json(
      { 
        jsonrpc: '2.0',
        id: 0,
        error: {
          code: -32603,
          message: error instanceof Error ? error.message : 'Internal proxy error'
        }
      },
      { status: 500 }
    );
  }
}