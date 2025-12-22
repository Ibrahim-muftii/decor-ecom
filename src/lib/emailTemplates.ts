/**
 * Email Templates for Botanical Decor E-commerce
 * 
 * This file contains HTML email templates with botanical theme styling.
 * Templates are designed to be responsive and visually appealing.
 */

// Base styles for all emails
const baseStyles = `
  body {
    margin: 0;
    padding: 0;
    font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f4f1ea;
  }
  .email-container {
    max-width: 600px;
    margin: 0 auto;
    background-color: #ffffff;
  }
  .header {
    background: linear-gradient(135deg, #2d5016 0%, #4a7c23 100%);
    padding: 40px 20px;
    text-align: center;
  }
  .logo {
    font-size: 32px;
    font-weight: 700;
    color: #ffffff;
    margin: 0;
    text-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
  .content {
    padding: 40px 30px;
    color: #2d3748;
  }
  .greeting {
    font-size: 24px;
    font-weight: 600;
    color: #2d5016;
    margin-bottom: 20px;
  }
  .message {
    font-size: 16px;
    line-height: 1.6;
    color: #4a5568;
    margin-bottom: 30px;
  }
  .button {
    display: inline-block;
    padding: 14px 32px;
    background: linear-gradient(135deg, #4a7c23 0%, #5d9b2a 100%);
    color: #ffffff !important;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 16px;
    box-shadow: 0 4px 12px rgba(74, 124, 35, 0.3);
    transition: all 0.3s ease;
  }
  .button:hover {
    box-shadow: 0 6px 16px rgba(74, 124, 35, 0.4);
    transform: translateY(-2px);
  }
  .footer {
    background-color: #f8f9fa;
    padding: 30px;
    text-align: center;
    border-top: 1px solid #e2e8f0;
  }
  .footer-text {
    font-size: 14px;
    color: #718096;
    margin: 5px 0;
  }
  .divider {
    height: 1px;
    background: linear-gradient(to right, transparent, #cbd5e0, transparent);
    margin: 30px 0;
  }
  .highlight {
    background-color: #f0f7ed;
    padding: 20px;
    border-radius: 8px;
    border-left: 4px solid #4a7c23;
    margin: 20px 0;
  }
`;

/**
 * TEMPLATE 1: Supabase Email Confirmation Template
 * To be inserted in Supabase Dashboard: Authentication > Email Templates > Confirm signup
 */
export const supabaseConfirmEmailTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Your Email</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1 class="logo">🌿 Botanical Decor</h1>
    </div>
    <div class="content">
      <h2 class="greeting">Welcome to Our Green Paradise! 🌱</h2>
      <p class="message">
        Thank you for joining Botanical Decor! We're thrilled to have you as part of our community of nature lovers.
      </p>
      <p class="message">
        To complete your registration and start exploring our beautiful collection of botanical products, please confirm your email address by clicking the button below:
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="{{ .ConfirmationURL }}" class="button">Confirm Email Address</a>
      </div>
      <div class="highlight">
        <p style="margin: 0; font-size: 14px; color: #4a5568;">
          <strong>🔒 Security Note:</strong> This link will expire in 24 hours for your security. If you didn't create an account with us, please ignore this email.
        </p>
      </div>
      <p class="message">
        Once confirmed, you'll have full access to:
      </p>
      <ul style="color: #4a5568; line-height: 1.8;">
        <li>Our exclusive botanical collection</li>
        <li>Special member-only discounts</li>
        <li>Order tracking and history</li>
        <li>Personalized recommendations</li>
      </ul>
    </div>
    <div class="footer">
      <p class="footer-text">Botanical Decor - Bringing Nature Home</p>
      <p class="footer-text">© {{ .Year }} Botanical Decor. All rights reserved.</p>
      <p class="footer-text" style="font-size: 12px; margin-top: 15px;">
        If the button doesn't work, copy and paste this link into your browser:<br>
        <a href="{{ .ConfirmationURL }}" style="color: #4a7c23; word-break: break-all;">{{ .ConfirmationURL }}</a>
      </p>
    </div>
  </div>
</body>
</html>
`;

/**
 * TEMPLATE 2: Supabase Password Reset Template
 * To be inserted in Supabase Dashboard: Authentication > Email Templates > Reset password
 */
export const supabaseResetPasswordTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1 class="logo">🌿 Botanical Decor</h1>
    </div>
    <div class="content">
      <h2 class="greeting">Password Reset Request 🔑</h2>
      <p class="message">
        We received a request to reset the password for your Botanical Decor account.
      </p>
      <p class="message">
        Click the button below to create a new password:
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="{{ .ConfirmationURL }}" class="button">Reset Password</a>
      </div>
      <div class="highlight">
        <p style="margin: 0; font-size: 14px; color: #4a5568;">
          <strong>⚠️ Important:</strong> This link will expire in 1 hour for your security. If you didn't request a password reset, please ignore this email or contact our support if you're concerned about your account security.
        </p>
      </div>
      <p class="message">
        For your security, we recommend choosing a strong password that:
      </p>
      <ul style="color: #4a5568; line-height: 1.8;">
        <li>Is at least 8 characters long</li>
        <li>Includes uppercase and lowercase letters</li>
        <li>Contains numbers and special characters</li>
        <li>Is unique to your Botanical Decor account</li>
      </ul>
    </div>
    <div class="footer">
      <p class="footer-text">Botanical Decor - Bringing Nature Home</p>
      <p class="footer-text">© {{ .Year }} Botanical Decor. All rights reserved.</p>
      <p class="footer-text" style="font-size: 12px; margin-top: 15px;">
        If the button doesn't work, copy and paste this link into your browser:<br>
        <a href="{{ .ConfirmationURL }}" style="color: #4a7c23; word-break: break-all;">{{ .ConfirmationURL }}</a>
      </p>
    </div>
  </div>
</body>
</html>
`;

/**
 * TEMPLATE 3: Custom Welcome Email (Sent via Nodemailer)
 * This template is used by the application to send a welcome email after successful registration.
 */
export function generateWelcomeEmail(name: string, shopUrl: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Botanical Decor</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1 class="logo">🌿 Botanical Decor</h1>
    </div>
    <div class="content">
      <h2 class="greeting">Welcome to the Green Side, ${name}! 🌱</h2>
      <p class="message">
        We're absolutely delighted to have you join our botanical community! Your journey to bringing nature into your home starts here.
      </p>
      <div class="highlight">
        <p style="margin: 0; font-size: 16px; color: #2d5016; font-weight: 600;">
          🎉 As a warm welcome, enjoy <strong>10% OFF</strong> your first order!
        </p>
        <p style="margin: 10px 0 0 0; font-size: 14px; color: #4a5568;">
          Use code: <strong style="color: #4a7c23; font-size: 16px;">WELCOME10</strong> at checkout
        </p>
      </div>
      <p class="message">
        Ready to explore our stunning collection of botanical décor? From elegant planters to nature-inspired wall art, we have everything you need to create your perfect green sanctuary.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${shopUrl}" class="button">🛍️ Start Shopping Now</a>
      </div>
      <div class="divider"></div>
      <h3 style="color: #2d5016; font-size: 18px; margin-bottom: 15px;">What You Can Expect:</h3>
      <ul style="color: #4a5568; line-height: 1.8;">
        <li>🌿 <strong>Curated Collections:</strong> Handpicked botanical products for every space</li>
        <li>📦 <strong>Fast Shipping:</strong> Your green companions delivered with care</li>
        <li>💚 <strong>Expert Tips:</strong> Care guides and styling inspiration</li>
        <li>🎁 <strong>Exclusive Offers:</strong> Members-only deals and early access</li>
      </ul>
      <div class="divider"></div>
      <p class="message">
        Have questions? Our friendly team is here to help! Feel free to reach out anytime.
      </p>
      <p class="message" style="margin-bottom: 0;">
        Happy shopping, and welcome to the family! 🌱
      </p>
    </div>
    <div class="footer">
      <p class="footer-text" style="font-weight: 600; color: #2d5016;">Botanical Decor - Bringing Nature Home</p>
      <p class="footer-text">📧 support@botanicaldecor.com | 📞 +92 XXX XXXXXXX</p>
      <p class="footer-text">© ${new Date().getFullYear()} Botanical Decor. All rights reserved.</p>
      <div style="margin-top: 20px;">
        <a href="${shopUrl}" style="color: #4a7c23; text-decoration: none; margin: 0 10px;">Shop</a>
        <span style="color: #cbd5e0;">|</span>
        <a href="${shopUrl}/about" style="color: #4a7c23; text-decoration: none; margin: 0 10px;">About</a>
        <span style="color: #cbd5e0;">|</span>
        <a href="${shopUrl}/contact" style="color: #4a7c23; text-decoration: none; margin: 0 10px;">Contact</a>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}
