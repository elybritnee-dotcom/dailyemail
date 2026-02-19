# Daily AI Tips for Alumni Relations

Sends a daily email to `elybritnee@gmail.com` with a practical AI tip tailored for alumni relations professionals. The email includes a tip and an actionable prompt to try that day.

## Tips included

30 tips covering:
- Personalizing donor outreach at scale
- Drafting thank-you notes and stewardship reports
- Planning events and reunions
- Volunteer recruitment
- Prospect research
- Social media content calendars
- Giving day communications
- Re-engaging lapsed donors
- And much more

## Setup

### 1. Add GitHub Secrets

Go to your repository **Settings → Secrets and variables → Actions** and add:

| Secret | Description |
|--------|-------------|
| `SMTP_HOST` | Your SMTP server hostname (e.g. `smtp.gmail.com`) |
| `SMTP_PORT` | SMTP port — use `587` for TLS or `465` for SSL |
| `SMTP_USER` | Your sending email address |
| `SMTP_PASS` | Your email password or app password |
| `FROM_EMAIL` | (Optional) From address if different from SMTP_USER |

### Gmail setup

If using Gmail, you must use an **App Password** (not your regular password):
1. Enable 2-Step Verification on your Google account
2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Create an app password for "Mail"
4. Use `smtp.gmail.com` as `SMTP_HOST`, `587` as `SMTP_PORT`

### 2. Enable the workflow

The workflow runs automatically at 8:00 AM Eastern every day. You can also trigger it manually from the **Actions** tab in GitHub.

## Local testing

```bash
npm install
node send-email.js --dry-run   # Preview without sending
node send-email.js             # Send (requires SMTP env vars)
```
