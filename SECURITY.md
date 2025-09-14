# Security Guide

## 🔒 Sensitive Information Handling

This document outlines how to properly handle sensitive information in this AI Appointment Demo project.

### 🚨 **CRITICAL: Never Commit These Files**

The following files contain sensitive information and should **NEVER** be committed to version control:

- `token.json` - Contains Google OAuth tokens
- `credentials.json` - Contains Google API credentials
- `.env` - Contains environment variables with API keys
- `.env.local` - Local environment variables
- Any file with API keys, passwords, or tokens

### 📋 **Environment Variables Setup**

1. **Copy the template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in your actual values:**
   ```bash
   # Edit .env.local with your real credentials
   nano .env.local
   ```

3. **Required Environment Variables:**
   - `GOOGLE_CLIENT_ID` - Your Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET` - Your Google OAuth client secret
   - `OPENAI_API_KEY` - Your OpenAI API key
   - `GOOGLE_CALENDAR_CALENDAR_ID` - Your Google Calendar ID (usually 'primary')

### 🔧 **Google Calendar Setup**

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/
   - Create a new project or select existing one

2. **Enable Google Calendar API:**
   - Go to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click "Enable"

3. **Create OAuth 2.0 Credentials:**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - Your production domain (for production)

4. **Download credentials:**
   - Download the JSON file
   - Rename it to `credentials.json`
   - Place it in your project root
   - **DO NOT COMMIT THIS FILE**

### 🤖 **OpenAI API Setup**

1. **Get API Key:**
   - Visit: https://platform.openai.com/api-keys
   - Create a new API key
   - Copy the key (it starts with `sk-`)

2. **Add to Environment:**
   ```bash
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

### 🛡️ **Security Best Practices**

1. **Use Environment Variables:**
   - Never hardcode API keys in your source code
   - Use `.env.local` for local development
   - Use your hosting platform's environment variable settings for production

2. **Rotate Credentials Regularly:**
   - Change API keys periodically
   - Revoke unused credentials
   - Monitor API usage for suspicious activity

3. **Limit API Permissions:**
   - Only grant necessary permissions to your Google OAuth app
   - Use the principle of least privilege

4. **Monitor Access:**
   - Check Google Cloud Console for API usage
   - Monitor OpenAI usage dashboard
   - Set up billing alerts

### 🚀 **Production Deployment**

When deploying to production:

1. **Set Environment Variables:**
   - Add all required environment variables to your hosting platform
   - Never commit `.env` files to version control

2. **Update OAuth Settings:**
   - Add your production domain to authorized redirect URIs
   - Update `NEXTAUTH_URL` to your production domain

3. **Use HTTPS:**
   - Always use HTTPS in production
   - Update redirect URIs to use `https://`

### 🔍 **Checking for Exposed Credentials**

Before committing, always check:

```bash
# Check for potential secrets in your code
grep -r "sk-" . --exclude-dir=node_modules
grep -r "GOCSPX-" . --exclude-dir=node_modules
grep -r "AIza" . --exclude-dir=node_modules

# Check git status for sensitive files
git status
```

### 🆘 **If Credentials Are Exposed**

If you accidentally commit sensitive information:

1. **Immediately revoke the exposed credentials**
2. **Remove the file from git history:**
   ```bash
   git filter-branch --force --index-filter \
   'git rm --cached --ignore-unmatch token.json' \
   --prune-empty --tag-name-filter cat -- --all
   ```
3. **Force push to update remote:**
   ```bash
   git push origin --force --all
   ```
4. **Generate new credentials**
5. **Update your environment variables**

### 📞 **Support**

If you have security concerns or questions:
- Check the logs for any suspicious activity
- Review API usage in respective dashboards
- Consider reaching out to the platform support teams

---

**Remember: Security is everyone's responsibility. When in doubt, don't commit it!**
