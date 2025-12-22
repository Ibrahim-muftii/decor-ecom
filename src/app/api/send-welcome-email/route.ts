import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/emailService';

/**
 * API Route: Send Welcome Email
 * POST /api/send-welcome-email
 * 
 * Body: { email: string, name: string }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, name } = body;

        // Validate input
        if (!email || !name) {
            return NextResponse.json(
                { success: false, error: 'Email and name are required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Send welcome email
        const result = await sendWelcomeEmail(email, name);

        if (result.success) {
            return NextResponse.json(
                { success: true, message: 'Welcome email sent successfully' },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { success: false, error: result.error || 'Failed to send email' },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Error in send-welcome-email API:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error'
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: 'Welcome email API is running',
        endpoint: 'POST /api/send-welcome-email',
        requiredFields: ['email', 'name'],
    });
}
