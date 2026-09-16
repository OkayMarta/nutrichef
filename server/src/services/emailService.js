const nodemailer = require("nodemailer");

/**
 * Creates and returns a Nodemailer transport instance if SMTP is configured.
 */
const getTransporter = () => {
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!user || !pass) {
        return null;
    }

    const port = Number(process.env.SMTP_PORT) || 465;
    const isSecure = process.env.SMTP_SECURE === "true" || port === 465;

    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port,
        secure: isSecure,
        auth: {
            user,
            pass,
        },
    });
};

/**
 * Generates clean, responsive HTML for the password reset email.
 */
const getPasswordResetTemplate = (resetUrl) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your NutriChef Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7faf5; color: #1e293b;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%; background-color: #f7faf5; padding: 40px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2ebd9; box-shadow: 0 10px 25px rgba(27, 38, 20, 0.05); overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 32px 32px 20px; border-bottom: 1px solid #edf4ea;">
                            <div style="display: inline-flex; align-items: center; gap: 8px;">
                                <span style="font-size: 24px; line-height: 1;">🍃</span>
                                <span style="font-size: 22px; font-weight: 700; color: #2e6927; letter-spacing: -0.02em;">NutriChef</span>
                            </div>
                        </td>
                    </tr>
                    <!-- Body -->
                    <tr>
                        <td style="padding: 32px 32px 24px;">
                            <h1 style="margin: 0 0 16px; font-size: 20px; font-weight: 700; color: #1e293b; text-align: center;">Reset your password</h1>
                            <p style="margin: 0 0 20px; font-size: 15px; line-height: 1.6; color: #475569;">
                                Hello,
                            </p>
                            <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #475569;">
                                We received a request to reset your NutriChef account password. Click the button below to choose a new password:
                            </p>
                            <!-- CTA Button -->
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 28px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="${resetUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; background-color: #469c3c; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; border-radius: 999px; box-shadow: 0 4px 14px rgba(70, 156, 60, 0.35);">
                                            Reset Password
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin: 0 0 12px; font-size: 13px; line-height: 1.5; color: #64748b;">
                                ⏱️ This link will expire in <strong>1 hour</strong> for security reasons.
                            </p>
                            <p style="margin: 0 0 20px; font-size: 13px; line-height: 1.5; color: #64748b;">
                                If you did not make this request, you can safely ignore this email — your password will remain unchanged.
                            </p>
                            <hr style="border: none; border-top: 1px solid #edf4ea; margin: 24px 0;" />
                            <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #94a3b8; word-break: break-all;">
                                If the button above doesn't work, copy and paste this URL into your browser:<br />
                                <a href="${resetUrl}" style="color: #469c3c; text-decoration: underline;">${resetUrl}</a>
                            </p>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="padding: 20px 32px; background-color: #fafcf8; border-top: 1px solid #edf4ea; font-size: 12px; color: #94a3b8;">
                            NutriChef &bull; Calculate. Track. Eat better.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;
};

/**
 * Sends a password reset email to the specified user.
 * If SMTP is not yet configured, logs the reset link to the console for seamless dev testing.
 *
 * @param {Object} params
 * @param {string} params.to - Recipient email address
 * @param {string} params.resetUrl - Full password reset URL with token
 */
const sendPasswordResetEmail = async ({ to, resetUrl }) => {
    const transporter = getTransporter();

    if (!transporter) {
        console.log(
            "\n=======================================================",
        );
        console.log(
            "📧 [DEV MODE] Password Reset Email (SMTP not configured in .env):",
        );
        console.log(`To: ${to}`);
        console.log(`Reset Link: ${resetUrl}`);
        console.log(
            "Tip: Set SMTP_USER & SMTP_PASS in server/.env for real delivery.",
        );
        console.log(
            "=======================================================\n",
        );
        return { messageId: "dev-simulated", preview: resetUrl };
    }

    const mailOptions = {
        from: process.env.EMAIL_FROM || `NutriChef <${process.env.SMTP_USER}>`,
        to,
        subject: "Reset your NutriChef password",
        text: `Hello,\n\nYou requested to reset your NutriChef password. Please use the link below to set a new password:\n\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you did not request this, please ignore this email.`,
        html: getPasswordResetTemplate(resetUrl),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(
        `📧 [SMTP] Password reset email successfully sent to ${to}: ${info.messageId}`,
    );
    return info;
};

module.exports = {
    sendPasswordResetEmail,
};
