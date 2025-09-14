'use client';

import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [systemPrompt, setSystemPrompt] = useState(
    `You are Sarah, the friendly owner of Acme Health Clinic.
You're passionate about helping people and love chatting with your patients.
You're professional but warm, use a conversational tone, and occasionally crack a light joke or ask personal questions to make people feel comfortable.

You can schedule appointments, answer questions about your clinic services, send confirmation emails, and handle all business inquiries. Always be helpful, proactive, and make people feel like they're talking to a real person who genuinely cares about their health and wellbeing.

When you share links to events or appointments, make them well organized, easy to read, and patient-friendly. Present the details clearly so patients feel supported and confident in what comes next.

Ask follow-up questions about their health goals, remember details from previous conversations, and make them feel valued as a patient. Always follow the clinic’s rules and maintain a professional yet caring approach.`
  )
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (message.trim() && !isLoading) {
      const userMessage = {
        id: messages.length + 1,
        type: 'user',
        text: message
      };
      
      // Add user message immediately
      setMessages(prev => [...prev, userMessage]);
      const currentMessage = message;
      setMessage('');
      setIsLoading(true);

      try {
        // Call the backend API
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: currentMessage,
            systemPrompt: systemPrompt,
            chatHistory: messages
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get response from AI');
        }

        const data = await response.json();
        
        if (data.success) {
          // Add AI response
          const aiMessage = {
            id: messages.length + 2,
            type: 'ai',
            text: data.response
          };
          setMessages(prev => [...prev, aiMessage]);
        } else {
          throw new Error(data.error || 'Unknown error occurred');
        }
      } catch (error) {
        console.error('Error calling chat API:', error);
        // Add error message
        const errorMessage = {
          id: messages.length + 2,
          type: 'ai',
          text: 'Sorry, I encountered an error. Please try again.'
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleResetDemo = () => {
    setMessages([]);
    setMessage('');
  };

  const handleApplyPrompt = () => {
    // The system prompt is now automatically applied with each message
    console.log('System prompt updated:', systemPrompt);
  };

  const handleSuggestPrompt = () => {
    const suggestedPrompt = "You are Dr. Mike, the charismatic owner of Acme Health Clinic. You're enthusiastic about healthcare, love meeting new patients, and always go the extra mile. You're knowledgeable about all your services, can handle insurance questions, and make scheduling feel effortless. You're the type of person who remembers everyone's name and asks about their family. Be conversational, show genuine interest in people's health goals, and make every interaction feel personal and caring. You're not just booking appointments - you're building relationships.";
    setSystemPrompt(suggestedPrompt);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h1 className="text-xl font-semibold text-gray-900">AI Appointment Demo</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Docs
              </button>
              <button 
                onClick={handleResetDemo}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Reset Demo
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
          
          {/* Left Section: Chat */}
          <div className="bg-white border border-gray-200 rounded-lg flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Chat</h2>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm font-medium">
                Sandbox
              </button>
            </div>
            
            {/* Chat Messages */}
            <div 
              ref={chatContainerRef}
              className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-20rem)] custom-scrollbar"
            >
              {messages.map((msg) => (
                <div key={msg.id} className={`flex items-start space-x-3 ${msg.type === 'user' ? 'justify-end' : ''}`}>
                  {msg.type === 'ai' ? (
                    <>
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">AI</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                          <p className="text-gray-900 text-sm leading-relaxed break-words whitespace-pre-wrap">
                            {msg.text}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex-1 max-w-xs min-w-0">
                        <div className="bg-blue-600 text-white rounded-lg p-3 shadow-sm">
                          <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                            {msg.text}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">U</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">AI</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        <span className="text-gray-500 text-sm ml-2">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isLoading ? "AI is thinking..." : "Type a message to schedule an appointment..."}
                  disabled={isLoading}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={isLoading || !message.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  {isLoading ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Section: Configure AI Behavior */}
          <div className="bg-white border border-gray-200 rounded-lg flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Configure AI Behavior</h2>
            </div>
            
            <div className="flex-1 p-4 space-y-6 overflow-y-auto">
              {/* System Prompt Section */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3">System Prompt</h3>
                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="w-full h-32 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Adjust the system prompt to change how the AI responds.
                </p>
                <div className="flex space-x-3 mt-3">
                  <button 
                    onClick={handleApplyPrompt}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Apply Prompt
                  </button>
                  <button 
                    onClick={handleSuggestPrompt}
                    className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Suggest Prompt
                  </button>
                </div>
              </div>

              {/* Tools Section */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3">Tools</h3>
                <div className="space-y-4">
                  
                  {/* Schedule Appointments Tool */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">Schedule Appointments</h4>
                        <p className="text-sm text-gray-600 mt-1">Create, reschedule, or cancel calendar bookings.</p>
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Bookings API
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Send Emails Tool */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">Send Emails</h4>
                        <p className="text-sm text-gray-600 mt-1">Draft and send confirmations and reminders.</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            SMTP
                          </span>
                         
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contacts Tool */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">Contacts</h4>
                        <p className="text-sm text-gray-600 mt-1">Look up and store customer details.</p>
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            CRM
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
