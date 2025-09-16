# Google Calendar Integration Setup

## Prerequisites

1. **Google Cloud Console Setup**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable the Google Calendar API
   - Create OAuth 2.0 credentials (Desktop application type)
   - Copy the Client ID and Client Secret

## Setup Steps

### 1. Environment Variables
Configure the following environment variables in your `.env.local` file:
```
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REFRESH_TOKEN=your_google_refresh_token_here

# Google Calendar Configuration
GOOGLE_CALENDAR_CALENDAR_ID=primary
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback/google
```

### 2. Get Refresh Token
Run the helper script to get your refresh token:
```bash
node scripts/get-refresh-token.js
```

This will guide you through the OAuth flow and provide a refresh token to add to your `.env.local` file.

## Available Tools

Your AI agent now has access to these Google Calendar tools:

### 1. **Check Availability** (`check_availability`)
- Checks available appointment slots for a specific date
- Returns available times between 9 AM - 5 PM in 30-minute intervals
- Automatically excludes busy time slots

### 2. **Create Appointment** (`create_appointment`)
- Creates new appointments in Google Calendar
- Sends calendar invites to patients
- Sets up email and popup reminders
- Includes patient details in event description

### 3. **List Appointments** (`list_appointments`)
- Lists upcoming appointments
- Shows patient details and appointment times
- Configurable time range (default: 7 days)

## Usage Examples

Your AI agent can now handle requests like:
- "What appointments do I have tomorrow?"
- "Check availability for next Tuesday"
- "Book an appointment for John Smith on Friday at 2 PM"
- "Show me my schedule for next week"

## File Structure

```
src/
├── lib/
│   ├── googleCalendar.js          # Authentication service
│   └── tools/
│       └── calendarTools.js       # Calendar tools for LangChain
└── app/api/chat/route.js          # Updated API route with tools
```

## Security Notes

- Keep `credentials.json` and `token.json` secure
- Never commit these files to version control
- The `token.json` file contains refresh tokens for API access
