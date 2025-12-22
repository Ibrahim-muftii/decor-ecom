import nodemailer from 'nodemailer';
import { generateWelcomeEmail } from './emailTemplates';

/**
 * Email Service using Nodemailer with Brevo SMTP
 * Sends custom transactional emails for the application
 */

// Create reusable transporter using Brevo SMTP credentials
const createTransporter = () => {
    const apiKey = process.env.BREVO_API_KEY;
    const host = process.env.BREVO_SMTP_HOST;
    const userName = process.env.BREVO_USER_NAME;
    const port = process.env.BREVO_SMTP_PORT || '587';

    // Enhanced logging for debugging
    console.log('🔧 Creating SMTP transporter with:');
    console.log('  Host:', host || '❌ MISSING');
    console.log('  Port:', port);
    console.log('  User:', userName || '❌ MISSING');
    console.log('  API Key:', apiKey ? `✅ Set (${apiKey.substring(0, 15)}...)` : '❌ MISSING');

    if (!apiKey || !host || !userName) {
        const missing = [];
        if (!apiKey) missing.push('BREVO_API_KEY');
        if (!host) missing.push('BREVO_SMTP_HOST');
        if (!userName) missing.push('BREVO_USER_NAME');
        throw new Error(`Missing SMTP credentials: ${missing.join(', ')}`);
    }

    return nodemailer.createTransport({
        host: host,
        port: parseInt(port),
        secure: false, // false for STARTTLS
        requireTLS: true, // enforce STARTTLS
        auth: {
            user: userName,
            pass: apiKey,
        },
        tls: {
            ciphers: 'SSLv3',
        },
        debug: true, // Enable debug output
        logger: true, // Log to console
    });
};

/**
 * Send welcome email to new users
 * @param email - Recipient email address
 * @param name - Recipient name
 * @returns Promise<boolean> - True if email sent successfully
 */
export async function sendWelcomeEmail(email: string, name: string): Promise<{ success: boolean; error?: string }> {
    try {
        console.log(`📧 Starting email send process for: ${email}`);
        const transporter = createTransporter();

        // Base URL for shop link
        const shopUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const shopPageUrl = `${shopUrl}/products`;

        const mailOptions = {
            from: {
                name: 'Botanical Decor',
                address: process.env.BREVO_SENDER_EMAIL || process.env.BREVO_USER_NAME || 'noreply@botanicaldecor.com',
            },
            to: email,
            subject: '🌿 Welcome to Botanical Decor - Your Green Journey Begins!',
            html: generateWelcomeEmail(name, shopPageUrl),
        };

        console.log('📨 Sending email with options:', {
            from: mailOptions.from,
            to: mailOptions.to,
            subject: mailOptions.subject,
        });

        console.log("MAIL OPTION : ", mailOptions);

        const info = await transporter.sendMail(mailOptions);

        console.log('✅ Welcome email sent successfully:', {
            messageId: info.messageId,
            recipient: email,
            accepted: info.accepted,
            rejected: info.rejected,
            response: info.response,
            timestamp: new Date().toISOString(),
        });

        return { success: true };
    } catch (error) {
        console.error('❌ Failed to send welcome email:', error);
        console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
        });
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Test SMTP connection
 * @returns Promise<boolean> - True if connection successful
 */
export async function testSMTPConnection(): Promise<boolean> {
    try {
        const transporter = createTransporter();
        await transporter.verify();
        console.log('✅ SMTP connection verified successfully');
        return true;
    } catch (error) {
        console.error('❌ SMTP connection failed:', error);
        return false;
    }
}
