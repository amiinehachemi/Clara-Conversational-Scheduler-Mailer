# Google Calendar Integration Setup

## Prerequisites

1. **Google Cloud Console Setup**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable the Google Calendar API
   - Create OAuth 2.0 credentials (Desktop application type)
   - Download the `credentials.json` file

## Setup Steps

### 1. Place Credentials File
- Download `credentials.json` from Google Cloud Console
- Place it in your project root directory: `/home/guru/ai-appointment-demo/credentials.json`

### 2. Environment Variables
The following environment variables are already configured in `.env.local`:
```
GOOGLE_CALENDAR_CREDENTIALS_PATH=./credentials.json
GOOGLE_CALENDAR_TOKEN_PATH=./token.json
GOOGLE_CALENDAR_CALENDAR_ID=primary
```

### 3. First Run Authentication
- On first run, the app will open a browser window for OAuth consent
- Grant permissions to access your Google Calendar
- A `token.json` file will be automatically created for future use

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
