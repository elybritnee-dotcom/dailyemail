const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const RECIPIENT_EMAIL = 'elybritnee@gmail.com';
const TIPS_FILE = path.join(__dirname, 'tips.json');
const STATE_FILE = path.join(__dirname, 'tip-index.json');

function loadTips() {
  return JSON.parse(fs.readFileSync(TIPS_FILE, 'utf-8'));
}

function getCurrentTipIndex(total) {
  // Use the day of year to pick a tip, cycling through them
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return dayOfYear % total;
}

function buildEmailHtml(tip) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Daily AI Tip for Alumni Relations</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f4f0;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f4f0;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background-color:#1a3a5c;padding:28px 36px;border-radius:8px 8px 0 0;">
              <p style="margin:0;color:#a8c4e0;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;">Daily AI Tip</p>
              <h1 style="margin:8px 0 0 0;color:#ffffff;font-size:22px;font-weight:normal;font-family:Georgia,serif;">AI in Alumni Relations</h1>
            </td>
          </tr>

          <!-- Tip title -->
          <tr>
            <td style="background-color:#ffffff;padding:32px 36px 0 36px;">
              <h2 style="margin:0;color:#1a3a5c;font-size:20px;font-family:Georgia,serif;line-height:1.3;">${tip.title}</h2>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="background-color:#ffffff;padding:16px 36px 0 36px;">
              <div style="height:2px;background-color:#e8a020;width:48px;"></div>
            </td>
          </tr>

          <!-- Tip body -->
          <tr>
            <td style="background-color:#ffffff;padding:20px 36px 0 36px;">
              <p style="margin:0;color:#333333;font-size:16px;line-height:1.7;font-family:Georgia,serif;">${tip.tip}</p>
            </td>
          </tr>

          <!-- Try it today box -->
          <tr>
            <td style="background-color:#ffffff;padding:24px 36px 36px 36px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#eef4fb;border-left:4px solid #1a3a5c;padding:16px 20px;border-radius:0 4px 4px 0;">
                    <p style="margin:0 0 6px 0;color:#1a3a5c;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;font-family:Arial,sans-serif;font-weight:bold;">Try It Today</p>
                    <p style="margin:0;color:#333333;font-size:15px;line-height:1.6;font-family:Georgia,serif;">${tip.action}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f0ede6;padding:20px 36px;border-radius:0 0 8px 8px;border-top:1px solid #ddd8ce;">
              <p style="margin:0;color:#888880;font-size:12px;font-family:Arial,sans-serif;line-height:1.6;">
                You're receiving this because you signed up for daily AI tips for alumni relations professionals.<br/>
                Sent to ${RECIPIENT_EMAIL}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildEmailText(tip) {
  return `DAILY AI TIP — AI in Alumni Relations
======================================

${tip.title}

${tip.tip}

TRY IT TODAY
------------
${tip.action}

---
You're receiving this because you signed up for daily AI tips for alumni relations professionals.
Sent to ${RECIPIENT_EMAIL}
`;
}

async function sendEmail(tip, dryRun = false) {
  const subject = `AI Tip: ${tip.title}`;
  const html = buildEmailHtml(tip);
  const text = buildEmailText(tip);

  if (dryRun) {
    console.log('=== DRY RUN — no email sent ===');
    console.log(`To: ${RECIPIENT_EMAIL}`);
    console.log(`Subject: ${subject}`);
    console.log('\n--- Plain text preview ---');
    console.log(text);
    return;
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromEmail = process.env.FROM_EMAIL || smtpUser;

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.error('Missing required environment variables: SMTP_HOST, SMTP_USER, SMTP_PASS');
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  await transporter.sendMail({
    from: `"AI Tips for Alumni Relations" <${fromEmail}>`,
    to: RECIPIENT_EMAIL,
    subject,
    text,
    html,
  });

  console.log(`Email sent: "${subject}"`);
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const tips = loadTips();
  const index = getCurrentTipIndex(tips.length);
  const tip = tips[index];

  console.log(`Tip #${index + 1} of ${tips.length}: ${tip.title}`);
  await sendEmail(tip, dryRun);
}

main().catch((err) => {
  console.error('Failed to send email:', err.message);
  process.exit(1);
});
