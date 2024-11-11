import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.UNSUBSCRIBE_JWT_SECRET

export async function GET(request: Request) {
    try {
        // Get token from URL
        const { searchParams } = new URL(request.url)
        const token = searchParams.get('token')

        if (!token) {
            return new NextResponse('Missing token', { status: 400 })
        }

        if (!JWT_SECRET) {
            return new NextResponse('Server configuration error', { status: 500 })
        }

        // Verify and decode the token
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
        
        // Initialize Supabase client
        const supabase = createRouteHandlerClient({ cookies })

        // Update the client's unsubscribed status
        const { error } = await supabase
            .from('client')
            .update({ unsubscribed: true })
            .eq('id', decoded.userId)

        if (error) {
            console.error('Error updating unsubscribe status:', error)
            return new NextResponse('Error processing request', { status: 500 })
        }

        // Redirect to a success page or show success message
        return new NextResponse(
            `<html>
                <head>
                    <title>Unsubscribed Successfully</title>
                    <style>
                        body {
                            font-family: 'Fira Sans', sans-serif;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            margin: 0;
                            background-color: #ECF0F3;
                        }
                        .container {
                            text-align: center;
                            padding: 2rem;
                            background-color: white;
                            border-radius: 8px;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                            max-width: 500px;
                        }
                        h1 {
                            color: #222222;
                            margin-bottom: 1rem;
                        }
                        p {
                            color: #9CABC2;
                            margin-bottom: 1rem;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Successfully Unsubscribed</h1>
                        <p>You have been unsubscribed from MoneyFitt email notifications.</p>
                        <p>You can always update your preferences in your account settings.</p>
                    </div>
                </body>
            </html>`,
            {
                status: 200,
                headers: {
                    'Content-Type': 'text/html',
                },
            }
        )
    } catch (error) {
        console.error('Unsubscribe error:', error)
        return new NextResponse('Invalid or expired token', { status: 400 })
    }
} 