# AI Appointment Demo

An intelligent appointment booking system powered by AI that integrates with Google Calendar. This application uses OpenAI's GPT-4 with function calling to provide a conversational interface for scheduling appointments.

## Features

- 🤖 **AI-Powered Chat Interface**: Natural language appointment booking
- 📅 **Google Calendar Integration**: Real-time availability checking and appointment creation
- 🔧 **Function Calling**: AI can use tools to check availability, create appointments, and list schedules
- 🎨 **Modern UI**: Clean, responsive interface built with Next.js and Tailwind CSS
- 🔐 **Environment-Based Authentication**: Secure OAuth2 integration with Google Calendar

## Getting Started

### Prerequisites

- Node.js 18+ 
- Google Cloud Console project with Calendar API enabled
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-appointment-demo
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your `.env.local` file with:
   - OpenAI API key
   - Google OAuth credentials
   - Google Calendar refresh token

See [GOOGLE_CALENDAR_SETUP.md](./GOOGLE_CALENDAR_SETUP.md) for detailed Google Calendar setup instructions.

### Running the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Available AI Tools

The AI assistant has access to these calendar tools:

- **Check Availability**: Find available appointment slots for specific dates
- **Create Appointment**: Book new appointments with patient details
- **List Appointments**: View upcoming appointments
- **Verify Appointment**: Confirm appointment details
- **Get Current Date**: Provide current date context

## Usage Examples

Try these commands in the chat interface:

- "What appointments do I have tomorrow?"
- "Check availability for next Tuesday"
- "Book an appointment for John Smith on Friday at 2 PM"
- "Show me my schedule for next week"

## Architecture

- **Frontend**: Next.js 15 with React 19
- **AI**: OpenAI GPT-4 with function calling
- **Calendar**: Google Calendar API v3
- **Styling**: Tailwind CSS
- **Authentication**: OAuth2 with environment variables

## Security

- No credential files stored in the repository
- All sensitive data in environment variables
- OAuth2 refresh token authentication
- Secure API key management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
