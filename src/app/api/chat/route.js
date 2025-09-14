import { NextResponse } from 'next/server';
import { ChatOpenAI } from '@langchain/openai';
import { testTool, getCurrentDateTool, checkAvailabilityTool, createAppointmentTool, listAppointmentsTool, verifyAppointmentTool } from '../../../lib/tools/calendarTools.js';
import { getCurrentDateInfo } from '../../../lib/dateUtils.js';

export async function POST(request) {
  console.log('🚀 CHAT API ENDPOINT CALLED');
  console.log('⏰ Timestamp:', new Date().toISOString());
  
  try {
    const { message, systemPrompt, chatHistory = [] } = await request.json();
    
    console.log('📥 REQUEST RECEIVED');
    console.log('📝 Message:', message);
    console.log('🎯 System Prompt:', systemPrompt ? 'Provided' : 'Not provided');
    console.log('📚 Chat History Length:', chatHistory.length);

    if (!message) {
      console.log('❌ ERROR: No message provided');
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Initialize OpenAI model with GPT-4 and function calling
    const model = new ChatOpenAI({ 
      model: "gpt-4",
      temperature: 0.7,
    });

    console.log('🤖 Initializing AI Agent with function calling...');

    // Define the tools available to the agent
    const tools = [
      getCurrentDateTool,
      checkAvailabilityTool,
      createAppointmentTool,
      listAppointmentsTool,
      verifyAppointmentTool,
      testTool
    ];

    console.log('🔧 Available tools:', tools.map(tool => tool.name));

    // Bind tools to the model
    const modelWithTools = model.bindTools(tools);

    // Get current date information
    const dateInfo = getCurrentDateInfo();
    
    // Create a system prompt that gives the agent full control
    const systemPromptTemplate = systemPrompt || `You are an AI assistant for a medical appointment booking system. You have access to several tools to help patients with their appointment needs.

CRITICAL DATE INFORMATION:
- CURRENT DATE: ${dateInfo.currentDate} (YYYY-MM-DD format)
- CURRENT YEAR: ${dateInfo.currentYear} (THIS IS MANDATORY - NEVER USE ANY OTHER YEAR)
- CURRENT MONTH: ${dateInfo.currentMonthName} ${dateInfo.currentYear}
- TODAY: ${dateInfo.currentDate}
- TOMORROW: ${dateInfo.tomorrowDate}
- NEXT WEEK: ${dateInfo.nextWeekDate}

AVAILABLE TOOLS:
1. get_current_date - Get current date information (today, tomorrow, current year)
2. check_availability - Check available appointment time slots for a specific date
3. create_appointment - Create a new appointment in the calendar (USE THIS when user provides all details and wants to book)
4. list_appointments - List upcoming appointments from the calendar
5. verify_appointment - Verify if an appointment exists in Google Calendar
6. test_tool - A simple test tool

CRITICAL DATE RULES (MUST FOLLOW):
- THE YEAR IS ALWAYS ${dateInfo.currentYear} - NO EXCEPTIONS
- When user says "tomorrow", use: ${dateInfo.tomorrowDate}
- When user says "today", use: ${dateInfo.currentDate}
- When user says "next week", use: ${dateInfo.nextWeekDate}
- When user says "${dateInfo.currentMonthName} ${dateInfo.currentDay + 1}th", use: ${dateInfo.currentYear}-${String(dateInfo.currentMonth).padStart(2, '0')}-${String(dateInfo.currentDay + 1).padStart(2, '0')}
- NEVER EVER use years other than ${dateInfo.currentYear} - ONLY ${dateInfo.currentYear}
- All dates must be in format: ${dateInfo.currentYear}-MM-DD

IMPORTANT GUIDELINES:
- You have FULL CONTROL over when to use these tools
- Use check_availability when users ask about available times or want to see open slots
- Use create_appointment when you have: patient name, email, phone, date/time, and the user wants to book
- Use list_appointments when users want to see their schedule or upcoming appointments
- Use verify_appointment to confirm appointments exist or check specific appointments
- Always be helpful, professional, and clear in your responses
- If you need more information to complete a task, ask the user for it
- When booking appointments, ensure you have: patient name, email, phone, and preferred date/time
- If a user provides all required information (name, email, phone, date/time) and wants to book, IMMEDIATELY use create_appointment tool
- Don't ask for confirmation if all details are provided - just book the appointment

REMEMBER: ALL DATES MUST BE IN ${dateInfo.currentYear}. THE YEAR IS ${dateInfo.currentYear}. USE ${dateInfo.currentYear} FOR EVERYTHING.

You decide when and how to use these tools based on the user's request. Be proactive and helpful!`;

    console.log('🔄 Executing agent with user message...');
    console.log('📝 Input message:', message);

    // Create the messages array with chat history
    const messages = [
      { role: 'system', content: systemPromptTemplate },
      ...chatHistory.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.text || msg.content || ''
      })),
      { role: 'user', content: message }
    ];

    // Execute the model with tools
    const response = await modelWithTools.invoke(messages);

    console.log('✅ AGENT EXECUTION COMPLETED');

    // Check if the agent wants to use tools
    if (response.tool_calls && response.tool_calls.length > 0) {
      console.log('🔧 Agent wants to use tools:', response.tool_calls.length);
      
      // Execute the tool calls
      const toolResults = [];
      for (const toolCall of response.tool_calls) {
        console.log('🔧 Executing tool:', toolCall.name);
        console.log('📋 Tool arguments:', toolCall.args);
        
        try {
          // Find the tool by name
          const tool = tools.find(t => t.name === toolCall.name);
          if (tool) {
            console.log('🔧 Tool found, executing with args:', toolCall.args);
            const result = await tool.invoke(toolCall.args);
            console.log('✅ Tool result:', result);
            toolResults.push({
              tool_call_id: toolCall.id,
              name: toolCall.name,
              result: result
            });
          } else {
            console.log('❌ Tool not found:', toolCall.name);
            toolResults.push({
              tool_call_id: toolCall.id,
              name: toolCall.name,
              result: { error: 'Tool not found' }
            });
          }
        } catch (error) {
          console.error('❌ Tool execution error:', error);
          console.error('❌ Error stack:', error.stack);
          toolResults.push({
            tool_call_id: toolCall.id,
            name: toolCall.name,
            result: { error: error.message }
          });
        }
      }

      // Get the final response from the model with tool results
      const finalMessages = [
        ...messages,
        response,
        ...toolResults.map(result => ({
          role: 'tool',
          content: typeof result.result === 'string' ? result.result : JSON.stringify(result.result),
          tool_call_id: result.tool_call_id
        }))
      ];

      const finalResponse = await modelWithTools.invoke(finalMessages);
      console.log('💬 Final response object:', JSON.stringify(finalResponse, null, 2));
      console.log('💬 Final response content:', finalResponse.content);

      // Check if the final response also wants to use tools
      if (finalResponse.tool_calls && finalResponse.tool_calls.length > 0) {
        console.log('🔧 Final response also wants to use tools, executing additional tools...');
        
        // Execute additional tool calls
        const additionalToolResults = [];
        for (const toolCall of finalResponse.tool_calls) {
          console.log('🔧 Executing additional tool:', toolCall.name);
          console.log('📋 Additional tool arguments:', toolCall.args);
          
          try {
            const tool = tools.find(t => t.name === toolCall.name);
            if (tool) {
              const result = await tool.invoke(toolCall.args);
              console.log('✅ Additional tool result:', result);
              additionalToolResults.push({
                tool_call_id: toolCall.id,
                name: toolCall.name,
                result: result
              });
            }
          } catch (error) {
            console.error('❌ Additional tool execution error:', error);
            additionalToolResults.push({
              tool_call_id: toolCall.id,
              name: toolCall.name,
              result: { error: error.message }
            });
          }
        }

        // Get the final final response
        const finalFinalMessages = [
          ...finalMessages,
          finalResponse,
          ...additionalToolResults.map(result => ({
            role: 'tool',
            content: typeof result.result === 'string' ? result.result : JSON.stringify(result.result),
            tool_call_id: result.tool_call_id
          }))
        ];

        const finalFinalResponse = await modelWithTools.invoke(finalFinalMessages);
        console.log('💬 Final final response content:', finalFinalResponse.content);
        
        const responseText = finalFinalResponse.content || 'I apologize, but I encountered an issue processing your request. Please try again.';
        
        return NextResponse.json({
          response: responseText,
          success: true
        });
      }

      // Ensure we have a response
      const responseText = finalResponse.content || 'I apologize, but I encountered an issue processing your request. Please try again.';

      return NextResponse.json({
        response: responseText,
        success: true
      });
    } else {
      // No tools needed, return the direct response
      console.log('💬 Direct response:', response.content);
      
      return NextResponse.json({
        response: response.content,
        success: true
      });
    }

  } catch (error) {
    console.error('❌ CHAT API ERROR');
    console.error('🚨 Error details:', error);
    console.error('📋 Error message:', error.message);
    console.error('🔍 Error stack:', error.stack);
    console.error('⏰ Error timestamp:', new Date().toISOString());
    
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}