import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

interface JWTPayload {
  userId: string;
  exp?: number;
}

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    // Get userId and token from URL
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const token = searchParams.get('token');

    if (!userId || !token) {
      return new NextResponse('Missing required parameters', { status: 400 });
    }

    // Verify JWT token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as JWTPayload;
      
      // Verify the token belongs to the correct user
      if (decoded.userId !== userId) {
        return new NextResponse('Invalid token', { status: 401 });
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      return new NextResponse('Invalid or expired token', { status: 401 });
    }

    // Update client's unsubscribe status
    const { error: updateError } = await supabase
      .from('client')
      .update({ unsubscribed: true })
      .eq('id', userId);

    if (updateError) {
      console.error('Database update failed:', updateError);
      return new NextResponse(
        'Unable to update preferences. Please try again later or contact support.',
        { status: 500 }
      );
    }

    // Return success page HTML
    return new NextResponse(
      `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Unsubscribed Successfully</title>
          <style>
              body {
                  font-family: 'Fira Sans', sans-serif;
                  background-color: #FFFFFF;
                  color: #222222;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                  margin: 0;
              }
              .container {
                  text-align: center;
                  padding: 2rem;
                  border-radius: 8px;
                  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                  background-color: #FFFFFF;
                  max-width: 500px;
              }
              h1 {
                  color: #5C59E4;
                  margin-bottom: 1rem;
              }
              p {
                  color: #222222;
                  margin-bottom: 1.5rem;
              }
              .button {
                  background-color: #5C59E4;
                  color: #FFFFFF;
                  padding: 10px 20px;
                  border-radius: 5px;
                  text-decoration: none;
                  display: inline-block;
                  transition: background-color 0.3s;
              }
              .button:hover {
                  background-color: #4543AB;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>Successfully Unsubscribed</h1>
              <p>You have been unsubscribed from MoneyFitt email notifications. You can always update your preferences in your account settings.</p>
              <a href="/" class="button">Return to Homepage</a>
          </div>
      </body>
      </html>`,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  } catch (error) {
    console.error('Unsubscribe handler error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 