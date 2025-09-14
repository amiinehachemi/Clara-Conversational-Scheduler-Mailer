import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { getCalendarService } from '../googleCalendar.js';
import { getCurrentDateInfo } from '../dateUtils.js';

// Simple test tool to isolate the issue
export const testTool = tool(
  async ({ message }) => {
    return `Test tool received: ${message}`;
  },
  {
    name: "test_tool",
    description: "A simple test tool",
    schema: z.object({
      message: z.string().describe("Test message")
    })
  }
);

/**
 * Tool to get current date information
 */
export const getCurrentDateTool = tool(
  async () => {
    try {
      const dateInfo = getCurrentDateInfo();
      
      const result = {
        currentDate: dateInfo.currentDate,
        currentYear: dateInfo.currentYear,
        currentMonth: dateInfo.currentMonthName,
        currentDay: dateInfo.currentDay,
        tomorrowDate: dateInfo.tomorrowDate,
        nextWeekDate: dateInfo.nextWeekDate,
        message: `Current date information: Today is ${dateInfo.currentMonthName} ${dateInfo.currentDay}, ${dateInfo.currentYear}. Tomorrow is ${dateInfo.tomorrowDate}.`
      };
      
      console.log('📅 CURRENT DATE TOOL RESULT:');
      console.log('   Current Date:', result.currentDate);
      console.log('   Current Year:', result.currentYear);
      console.log('   Tomorrow:', result.tomorrowDate);
      console.log('   Message:', result.message);
      
      return result;
    } catch (error) {
      console.error('Error getting current date:', error);
      return { 
        error: `Failed to get current date: ${error.message}`,
        message: 'Sorry, I encountered an error while getting the current date.'
      };
    }
  },
  {
    name: "get_current_date",
    description: "Get the current date information including today's date, tomorrow's date, and current year. Use this when you need to know what the current date is or when users ask about scheduling relative to today.",
    schema: z.object({})
  }
);

/**
 * Tool to check available appointment slots for a specific date
 */
export const checkAvailabilityTool = tool(
  async ({ date, duration = 60 }) => {
    try {
      console.log('🔍 CHECK AVAILABILITY TOOL CALLED');
      console.log('📅 Input parameters:', { date, duration });
      
      // Validate input
      if (!date) {
        console.log('❌ Error: Date is required');
        return { error: 'Date is required', availableSlots: [], totalAvailable: 0 };
      }
      
      console.log('🔐 Getting Google Calendar service...');
      const calendar = await getCalendarService();
      console.log('✅ Google Calendar service obtained successfully');
      
      const startTime = new Date(date);
      const endTime = new Date(startTime.getTime() + 24 * 60 * 60 * 1000); // Next 24 hours
      
      console.log('📊 Checking calendar for date range:');
      console.log('   Start:', startTime.toISOString());
      console.log('   End:', endTime.toISOString());
      console.log('   Calendar ID:', process.env.GOOGLE_CALENDAR_CALENDAR_ID || 'primary');
      
      const response = await calendar.events.list({
        calendarId: process.env.GOOGLE_CALENDAR_CALENDAR_ID || 'primary',
        timeMin: startTime.toISOString(),
        timeMax: endTime.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      console.log('📋 Calendar API response received');
      console.log('   Total events found:', response.data.items?.length || 0);
      
      const busySlots = response.data.items || [];
      
      if (busySlots.length > 0) {
        console.log('🚫 Busy time slots:');
        busySlots.forEach((event, index) => {
          console.log(`   ${index + 1}. ${event.summary} - ${event.start.dateTime} to ${event.end.dateTime}`);
        });
      } else {
        console.log('✅ No existing events found for this date');
      }
      const availableSlots = [];
      
      console.log('⏰ Generating available slots (9 AM to 5 PM, 30-minute intervals)...');
      
      // Generate available slots (9 AM to 5 PM, 30-minute intervals)
      for (let hour = 9; hour < 17; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const slotStart = new Date(startTime);
          slotStart.setHours(hour, minute, 0, 0);
          const slotEnd = new Date(slotStart.getTime() + duration * 60 * 1000);
          
          // Check if this slot conflicts with existing events
          const isAvailable = !busySlots.some(event => {
            const eventStart = new Date(event.start.dateTime);
            const eventEnd = new Date(event.end.dateTime);
            return (slotStart < eventEnd && slotEnd > eventStart);
          });
          
          if (isAvailable) {
            const slotTime = slotStart.toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit',
              hour12: true 
            });
            console.log(`   ✅ Available: ${slotTime}`);
            availableSlots.push({
              start: slotStart.toISOString(),
              end: slotEnd.toISOString(),
              time: slotTime
            });
          } else {
            const slotTime = slotStart.toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit',
              hour12: true 
            });
            console.log(`   ❌ Busy: ${slotTime}`);
          }
        }
      }
      
      console.log(`📊 Total available slots found: ${availableSlots.length}`);
      
      const result = {
        date: date,
        availableSlots: availableSlots.slice(0, 10), // Return top 10 slots
        totalAvailable: availableSlots.length,
        message: `Found ${availableSlots.length} available slots for ${new Date(date).toLocaleDateString()}`
      };
      
      console.log('🎯 CHECK AVAILABILITY RESULT:');
      console.log('   Date:', result.date);
      console.log('   Total available:', result.totalAvailable);
      console.log('   Returning top 10 slots:', result.availableSlots.length);
      console.log('   Message:', result.message);
      
      return result;
    } catch (error) {
      console.error('Error checking availability:', error);
      console.error('Error stack:', error.stack);
      return { 
        error: `Failed to check availability: ${error.message}`,
        availableSlots: [],
        totalAvailable: 0,
        message: 'Sorry, I encountered an error while checking availability. Please try again later.'
      };
    }
  },
  {
    name: "check_availability",
    description: "Check available appointment time slots for a specific date. This tool shows which times are free for booking appointments. Use this when users ask about availability, want to see available times, or need to know what slots are open for scheduling. Returns available slots between 9 AM and 5 PM in 30-minute intervals.",
    schema: z.object({
      date: z.string().describe("Date to check availability for in YYYY-MM-DD format (e.g., '2025-01-15') - MUST use 2025 year"),
      duration: z.number().optional().describe("Appointment duration in minutes (default: 60 minutes)")
    })
  }
);

/**
 * Tool to create a new appointment in the calendar
 */
export const createAppointmentTool = tool(
  async ({ title, startTime, endTime, patientName, patientEmail, patientPhone, notes }) => {
    try {
      console.log('📅 CREATE APPOINTMENT TOOL CALLED');
      console.log('📋 Appointment details:');
      console.log('   Title:', title);
      console.log('   Start Time:', startTime);
      console.log('   End Time:', endTime);
      console.log('   Patient Name:', patientName);
      console.log('   Patient Email:', patientEmail);
      console.log('   Patient Phone:', patientPhone);
      console.log('   Notes:', notes);
      
      console.log('🔐 Getting Google Calendar service...');
      const calendar = await getCalendarService();
      console.log('✅ Google Calendar service obtained successfully');
      
      const event = {
        summary: `Appointment: ${patientName}`,
        description: `Patient: ${patientName}\nEmail: ${patientEmail}\nPhone: ${patientPhone}\nNotes: ${notes || 'No additional notes'}`,
        start: {
          dateTime: startTime,
          timeZone: 'America/New_York', // Adjust timezone as needed
        },
        end: {
          dateTime: endTime,
          timeZone: 'America/New_York',
        },
        attendees: [
          { email: patientEmail, displayName: patientName }
        ],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 24 hours before
            { method: 'popup', minutes: 30 }, // 30 minutes before
          ],
        },
      };

      console.log('📝 Creating calendar event...');
      console.log('   Event summary:', event.summary);
      console.log('   Event start:', event.start.dateTime);
      console.log('   Event end:', event.end.dateTime);
      console.log('   Attendees:', event.attendees);
      console.log('   Calendar ID:', process.env.GOOGLE_CALENDAR_CALENDAR_ID || 'primary');

      const response = await calendar.events.insert({
        calendarId: process.env.GOOGLE_CALENDAR_CALENDAR_ID || 'primary',
        resource: event,
        sendUpdates: 'all'
      });

      console.log('✅ Calendar event created successfully!');
      console.log('   Event ID:', response.data.id);
      console.log('   Event Link:', response.data.htmlLink);

      const result = {
        success: true,
        eventId: response.data.id,
        eventLink: response.data.htmlLink,
        message: `Appointment created successfully for ${patientName} on ${new Date(startTime).toLocaleDateString()} at ${new Date(startTime).toLocaleTimeString()}`,
        details: {
          patientName,
          startTime: new Date(startTime).toLocaleString(),
          endTime: new Date(endTime).toLocaleString(),
          eventId: response.data.id
        }
      };
      
      console.log('🎯 CREATE APPOINTMENT RESULT:');
      console.log('   Success:', result.success);
      console.log('   Event ID:', result.eventId);
      console.log('   Event Link:', result.eventLink);
      console.log('   Message:', result.message);
      
      return result;
    } catch (error) {
      console.error('Error creating appointment:', error);
      return { 
        success: false, 
        error: `Failed to create appointment: ${error.message}`,
        message: `Sorry, I couldn't create the appointment. Please try again or contact us directly.`
      };
    }
  },
  {
    name: "create_appointment",
    description: "Create a new appointment in the calendar. Use this tool ONLY when you have all required information (patient name, email, phone, date/time) AND the user has confirmed they want to book the appointment. Never use this tool without explicit confirmation from the user. This will create a calendar event and send confirmation emails.",
    schema: z.object({
      title: z.string().describe("Appointment title or type (e.g., 'Consultation', 'Check-up', 'Follow-up')"),
      startTime: z.string().describe("Start time in ISO 8601 format (e.g., '2025-01-15T14:00:00.000Z') - MUST use 2025 year"),
      endTime: z.string().describe("End time in ISO 8601 format (e.g., '2025-01-15T15:00:00.000Z') - MUST use 2025 year"),
      patientName: z.string().describe("Patient's full name (e.g., 'John Smith')"),
      patientEmail: z.string().describe("Patient's email address (e.g., 'john@example.com')"),
      patientPhone: z.string().describe("Patient's phone number (10 digits, e.g., '5551234567')"),
      notes: z.string().optional().describe("Additional notes, reason for appointment, or special instructions")
    })
  }
);

/**
 * Tool to list upcoming appointments
 */
export const listAppointmentsTool = tool(
  async ({ days = 7 }) => {
    try {
      console.log('📋 LIST APPOINTMENTS TOOL CALLED');
      console.log('📅 Looking ahead:', days, 'days');
      
      console.log('🔐 Getting Google Calendar service...');
      const calendar = await getCalendarService();
      console.log('✅ Google Calendar service obtained successfully');
      const startTime = new Date();
      const endTime = new Date();
      endTime.setDate(endTime.getDate() + days);
      
      console.log('📊 Checking calendar for upcoming appointments:');
      console.log('   Start:', startTime.toISOString());
      console.log('   End:', endTime.toISOString());
      console.log('   Calendar ID:', process.env.GOOGLE_CALENDAR_CALENDAR_ID || 'primary');
      
      const response = await calendar.events.list({
        calendarId: process.env.GOOGLE_CALENDAR_CALENDAR_ID || 'primary',
        timeMin: startTime.toISOString(),
        timeMax: endTime.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      console.log('📋 Calendar API response received');
      console.log('   Total events found:', response.data.items?.length || 0);

      const appointments = response.data.items.map(event => ({
        id: event.id,
        title: event.summary,
        start: event.start.dateTime,
        end: event.end.dateTime,
        patient: event.attendees?.[0]?.displayName || 'Unknown',
        email: event.attendees?.[0]?.email || 'No email',
        description: event.description || 'No description'
      }));
      
      if (appointments.length > 0) {
        console.log('📅 Upcoming appointments:');
        appointments.forEach((appointment, index) => {
          console.log(`   ${index + 1}. ${appointment.title} - ${appointment.patient} - ${new Date(appointment.start).toLocaleString()}`);
        });
      } else {
        console.log('✅ No upcoming appointments found');
      }

      const result = {
        appointments: appointments,
        total: appointments.length,
        period: `${days} days`,
        message: `Found ${appointments.length} appointments in the next ${days} days`
      };
      
      console.log('🎯 LIST APPOINTMENTS RESULT:');
      console.log('   Total appointments:', result.total);
      console.log('   Period:', result.period);
      console.log('   Message:', result.message);
      
      return result;
    } catch (error) {
      console.error('Error listing appointments:', error);
      return { 
        error: `Failed to list appointments: ${error.message}`,
        appointments: [],
        total: 0
      };
    }
  },
  {
    name: "list_appointments",
    description: "List upcoming appointments from the calendar. Use this when users ask to see their schedule, want to view upcoming appointments, or need to check what appointments are already booked. Shows appointments with patient details, times, and descriptions.",
    schema: z.object({
      days: z.number().optional().describe("Number of days to look ahead from today (default: 7 days)")
    })
  }
);

/**
 * Tool to verify if an appointment exists in Google Calendar
 */
export const verifyAppointmentTool = tool(
  async ({ eventId, date, patientName }) => {
    try {
      console.log('🔍 VERIFY APPOINTMENT TOOL CALLED');
      console.log('📋 Verification parameters:');
      console.log('   Event ID:', eventId);
      console.log('   Date:', date);
      console.log('   Patient Name:', patientName);
      
      console.log('🔐 Getting Google Calendar service...');
      const calendar = await getCalendarService();
      console.log('✅ Google Calendar service obtained successfully');
      
      let verificationResult = null;
      
      // If we have an event ID, try to get the specific event
      if (eventId) {
        console.log('🔍 Looking up appointment by Event ID...');
        try {
          const response = await calendar.events.get({
            calendarId: process.env.GOOGLE_CALENDAR_CALENDAR_ID || 'primary',
            eventId: eventId
          });
          
          if (response.data) {
            verificationResult = {
              found: true,
              method: 'eventId',
              event: {
                id: response.data.id,
                summary: response.data.summary,
                start: response.data.start.dateTime,
                end: response.data.end.dateTime,
                attendees: response.data.attendees,
                description: response.data.description,
                htmlLink: response.data.htmlLink
              }
            };
            console.log('✅ Appointment found by Event ID:', response.data.summary);
          }
        } catch (error) {
          console.log('❌ Event not found by ID:', error.message);
        }
      }
      
      // If not found by ID or no ID provided, search by date and patient name
      if (!verificationResult && date && patientName) {
        console.log('🔍 Searching by date and patient name...');
        
        const startTime = new Date(date);
        const endTime = new Date(startTime.getTime() + 24 * 60 * 60 * 1000);
        
        const response = await calendar.events.list({
          calendarId: process.env.GOOGLE_CALENDAR_CALENDAR_ID || 'primary',
          timeMin: startTime.toISOString(),
          timeMax: endTime.toISOString(),
          singleEvents: true,
          orderBy: 'startTime',
        });
        
        const events = response.data.items || [];
        console.log(`📅 Found ${events.length} events for the date`);
        
        // Look for appointment matching patient name
        const matchingEvent = events.find(event => {
          const summaryMatch = event.summary?.toLowerCase().includes(patientName.toLowerCase());
          const attendeeMatch = event.attendees?.some(attendee => 
            attendee.displayName?.toLowerCase().includes(patientName.toLowerCase())
          );
          return summaryMatch || attendeeMatch;
        });
        
        if (matchingEvent) {
          verificationResult = {
            found: true,
            method: 'dateAndName',
            event: {
              id: matchingEvent.id,
              summary: matchingEvent.summary,
              start: matchingEvent.start.dateTime,
              end: matchingEvent.end.dateTime,
              attendees: matchingEvent.attendees,
              description: matchingEvent.description,
              htmlLink: matchingEvent.htmlLink
            }
          };
          console.log('✅ Appointment found by date and name:', matchingEvent.summary);
        }
      }
      
      if (!verificationResult) {
        console.log('❌ No appointment found');
        return {
          found: false,
          message: 'Appointment not found in calendar',
          searchCriteria: { eventId, date, patientName }
        };
      }
      
      const result = {
        found: true,
        verificationMethod: verificationResult.method,
        appointment: verificationResult.event,
        message: `Appointment verified: ${verificationResult.event.summary} on ${new Date(verificationResult.event.start).toLocaleDateString()} at ${new Date(verificationResult.event.start).toLocaleTimeString()}`,
        calendarLink: verificationResult.event.htmlLink
      };
      
      console.log('🎯 VERIFY APPOINTMENT RESULT:');
      console.log('   Found:', result.found);
      console.log('   Method:', result.verificationMethod);
      console.log('   Appointment:', result.appointment.summary);
      console.log('   Calendar Link:', result.calendarLink);
      
      return result;
    } catch (error) {
      console.error('❌ Error verifying appointment:', error);
      return {
        found: false,
        error: `Failed to verify appointment: ${error.message}`,
        message: 'Sorry, I encountered an error while verifying the appointment.'
      };
    }
  },
  {
    name: "verify_appointment",
    description: "Verify if an appointment exists in Google Calendar. Use this to confirm that an appointment was successfully created or to check if a specific appointment exists. Can search by event ID, date, or patient name.",
    schema: z.object({
      eventId: z.string().optional().describe("Google Calendar event ID to look up"),
      date: z.string().optional().describe("Date to search for appointments (YYYY-MM-DD format)"),
      patientName: z.string().optional().describe("Patient name to search for in appointments")
    })
  }
);
