import { NextResponse } from 'next/server';
import { testSMTPConnection, sendWelcomeEmail } from '@/lib/emailService';

/**
 * API Route: Test SMTP Connection and Email Sending
 * GET /api/test-smtp
 * 
 * This endpoint tests:
 * 1. Environment variables are loaded correctly
 * 2. SMTP connection to Brevo works
 * 3. Email can be sent successfully
 */
export async function GET() {
    try {
        // Check environment variables
        const envCheck = {
            BREVO_API_KEY: process.env.BREVO_API_KEY ? '✅ Set (hidden)' : '❌ Missing',
            BREVO_SMTP_HOST: process.env.BREVO_SMTP_HOST || '❌ Missing',
            BREVO_USER_NAME: process.env.BREVO_USER_NAME || '❌ Missing',
            BREVO_SMTP_PORT: process.env.BREVO_SMTP_PORT || '❌ Missing',
        };

        console.log('📋 Environment Variables Check:', envCheck);

        // Test SMTP connection
        console.log('🔍 Testing SMTP connection...');
        const connectionTest = await testSMTPConnection();

        return NextResponse.json({
            success: true,
            environmentVariables: envCheck,
            smtpConnection: connectionTest ? '✅ Connected' : '❌ Failed',
            message: connectionTest
                ? 'SMTP connection successful! Ready to send emails.'
                : 'SMTP connection failed. Check credentials and network.',
        }, { status: 200 });

    } catch (error) {
        console.error('❌ Test SMTP error:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
        }, { status: 500 });
    }
}

/**
 * POST /api/test-smtp
 * Send a test email to verify end-to-end functionality
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, name } = body;

        if (!email || !name) {
            return NextResponse.json({
                success: false,
                error: 'Email and name are required',
            }, { status: 400 });
        }

        console.log(`📧 Sending test email to: ${email}`);

        const result = await sendWelcomeEmail(email, name);

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: `Test email sent successfully to ${email}`,
            }, { status: 200 });
        } else {
            return NextResponse.json({
                success: false,
                error: result.error,
            }, { status: 500 });
        }

    } catch (error) {
        console.error('❌ Send test email error:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}
