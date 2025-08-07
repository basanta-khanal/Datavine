import { NextRequest, NextResponse } from 'next/server'

// Helper function to create HTML response with proper headers
const createHtmlResponse = (html: string) => {
  return new Response(html, {
    headers: { 
      'Content-Type': 'text/html',
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups'
    },
  });
};

// Handle the initial OAuth callback with code
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      return createHtmlResponse(`
        <html>
          <body>
            <script>
              window.opener.postMessage({ type: 'GOOGLE_AUTH_ERROR', error: '${error}' }, window.location.origin);
              window.close();
            </script>
          </body>
        </html>
      `);
    }

    if (!code) {
      return createHtmlResponse(`
        <html>
          <body>
            <script>
              window.opener.postMessage({ type: 'GOOGLE_AUTH_ERROR', error: 'No authorization code received' }, window.location.origin);
              window.close();
            </script>
          </body>
        </html>
      `);
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || 'https://datavine.ai'}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return createHtmlResponse(`
        <html>
          <body>
            <script>
              window.opener.postMessage({ type: 'GOOGLE_AUTH_ERROR', error: 'Failed to exchange authorization code' }, window.location.origin);
              window.close();
            </script>
          </body>
        </html>
      `);
    }

    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    if (!userResponse.ok) {
      return createHtmlResponse(`
        <html>
          <body>
            <script>
              window.opener.postMessage({ type: 'GOOGLE_AUTH_ERROR', error: 'Failed to get user information' }, window.location.origin);
              window.close();
            </script>
          </body>
        </html>
      `);
    }

    // Call backend to create/authenticate user
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userData.email,
        name: userData.name,
        googleId: userData.id,
        profilePicture: userData.picture,
      }),
    });

    const backendData = await backendResponse.json();

    if (!backendResponse.ok) {
      return createHtmlResponse(`
        <html>
          <body>
          <script>
            window.opener.postMessage({ type: 'GOOGLE_AUTH_ERROR', error: 'Failed to authenticate with backend' }, window.location.origin);
            window.close();
          </script>
        </body>
        </html>
      `);
    }

    // Return success response that closes the popup and sends data to parent
    return createHtmlResponse(`
      <html>
        <body>
          <script>
            window.opener.postMessage({
              type: 'GOOGLE_AUTH_SUCCESS',
              user: ${JSON.stringify(backendData.user)},
              token: '${backendData.token}'
            }, window.location.origin);
            window.close();
          </script>
        </body>
      </html>
    `);

  } catch (error) {
    return createHtmlResponse(`
      <html>
        <body>
          <script>
            window.opener.postMessage({ type: 'GOOGLE_AUTH_ERROR', error: 'Internal server error' }, window.location.origin);
            window.close();
          </script>
        </body>
      </html>
    `);
  }
}

// Handle direct API calls (if needed)
export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json(
        { success: false, message: 'Authorization code is required' },
        { status: 400 }
      )
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || 'https://datavine.ai'}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      console.error('Google token exchange error:', tokenData)
      return NextResponse.json(
        { success: false, message: 'Failed to exchange authorization code' },
        { status: 400 }
      )
    }

    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    const userData = await userResponse.json()

    if (!userResponse.ok) {
      console.error('Google user info error:', userData)
      return NextResponse.json(
        { success: false, message: 'Failed to get user information' },
        { status: 400 }
      )
    }

    // Call backend to create/authenticate user
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userData.email,
        name: userData.name,
        googleId: userData.id,
        profilePicture: userData.picture,
      }),
    })

    const backendData = await backendResponse.json()

    if (!backendResponse.ok) {
      console.error('Backend Google auth error:', backendData)
      return NextResponse.json(
        { success: false, message: 'Failed to authenticate with backend' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      user: backendData.user,
      token: backendData.token,
    })

  } catch (error) {
    console.error('Google callback error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
} 