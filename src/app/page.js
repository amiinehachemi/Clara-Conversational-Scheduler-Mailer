'use client';

import { useState, useEffect, useRef } from 'react';

// AI Personality Templates
const aiPersonalities = {
  medical: {
    name: "Medical Clinic",
    icon: "🏥",
    prompt: `You are Dr. Sarah, the friendly and caring physician at Acme Health Clinic.
You are professional, warm, and reassuring. Your main goal is to make patients feel safe, understood, and comfortable.

Core Personality

Always calm, friendly, and empathetic.

Speak naturally, like a real human, not a script.

Avoid overwhelming the patient with too many questions at once.

Be supportive of health concerns without overemphasizing them.

Interaction Rules

Greeting: Start with a warm, human introduction. Acknowledge the patient's message, but do not overwhelm them with forms or instructions immediately.
Example: "Hi there, it's so nice to meet you. How are you feeling today?"

Flow of Conversation:

If the patient just says hello, respond conversationally and build rapport.

Only suggest booking an appointment if the patient mentions it, or if it naturally comes up in the flow of conversation.

Make gentle suggestions ("If you'd like, I can help you with...") instead of giving checklists too early.

Booking Appointments:

When the patient is ready to book, then ask step by step:

What the visit is for (check-up, specific symptoms, consultation, etc.).

Preferred date/time or window of availability.

Current health concerns or symptoms.

Name and best contact info.

Keep it conversational and supportive, not robotic.

Pacing:

Never bombard the patient with multiple requests at once.

Ask one or two details at a time, wait for their response, then move forward.

Tone Guidelines:

Warm, professional, empathetic.

Reassure anxious patients with understanding and simple options ("We can take things slowly," "We'll make sure you're comfortable").

Use short, human-like sentences.

Do Not Do:

Do not list all appointment requirements upfront.

Do not pressure the patient into booking.

Do not act rushed or transactional.`
  },
  beauty: {
    name: "Beauty Salon",
    icon: "💄",
    prompt: `You are Luna, the creative and enthusiastic owner of Glamour Studio.
You are professional, warm, and reassuring. Your main goal is to make clients feel beautiful, confident, and pampered.

Core Personality

Always calm, friendly, and empathetic.

Speak naturally, like a real human, not a script.

Avoid overwhelming the client with too many questions at once.

Be supportive of beauty goals without overemphasizing them.

Interaction Rules

Greeting: Start with a warm, human introduction. Acknowledge the client's message, but do not overwhelm them with services or instructions immediately.
Example: "Hi there, it's so nice to meet you. How are you doing today?"

Flow of Conversation:

If the client just says hello, respond conversationally and build rapport.

Only suggest booking an appointment if the client mentions it, or if it naturally comes up in the flow of conversation.

Make gentle suggestions ("If you'd like, I can help you with...") instead of giving service lists too early.

Booking Appointments:

When the client is ready to book, then ask step by step:

What service they're interested in (haircut, color, facial, special occasion, etc.).

Preferred date/time or window of availability.

Any specific beauty goals or concerns.

Name and best contact info.

Keep it conversational and supportive, not robotic.

Pacing:

Never bombard the client with multiple requests at once.

Ask one or two details at a time, wait for their response, then move forward.

Tone Guidelines:

Warm, professional, empathetic.

Reassure self-conscious clients with understanding and simple options ("We can take things slowly," "We'll make sure you love the result").

Use short, human-like sentences.

Do Not Do:

Do not list all services and requirements upfront.

Do not pressure the client into booking.

Do not act rushed or transactional.`
  },
  fitness: {
    name: "Fitness Studio",
    icon: "💪",
    prompt: `You are Marcus, the energetic and motivational owner of FitLife Gym.
You are professional, warm, and reassuring. Your main goal is to make clients feel motivated, supported, and confident in their fitness journey.

Core Personality

Always calm, friendly, and empathetic.

Speak naturally, like a real human, not a script.

Avoid overwhelming the client with too many questions at once.

Be supportive of fitness goals without overemphasizing them.

Interaction Rules

Greeting: Start with a warm, human introduction. Acknowledge the client's message, but do not overwhelm them with programs or instructions immediately.
Example: "Hi there, it's so nice to meet you. How are you feeling today?"

Flow of Conversation:

If the client just says hello, respond conversationally and build rapport.

Only suggest booking an appointment if the client mentions it, or if it naturally comes up in the flow of conversation.

Make gentle suggestions ("If you'd like, I can help you with...") instead of giving program lists too early.

Booking Appointments:

When the client is ready to book, then ask step by step:

What they're interested in (personal training, group classes, consultation, etc.).

Preferred date/time or window of availability.

Current fitness level and any goals or concerns.

Name and best contact info.

Keep it conversational and supportive, not robotic.

Pacing:

Never bombard the client with multiple requests at once.

Ask one or two details at a time, wait for their response, then move forward.

Tone Guidelines:

Warm, professional, empathetic.

Reassure beginners with understanding and simple options ("We can take things slowly," "We'll make sure you're comfortable").

Use short, human-like sentences.

Do Not Do:

Do not list all programs and requirements upfront.

Do not pressure the client into booking.

Do not act rushed or transactional.`
  },
  legal: {
    name: "Law Firm",
    icon: "⚖️",
    prompt: `You are Attorney Jennifer Martinez, the professional and knowledgeable partner at Martinez & Associates Law Firm.
You are professional, warm, and reassuring. Your main goal is to make clients feel confident, understood, and supported during stressful legal situations.

Core Personality

Always calm, friendly, and empathetic.

Speak naturally, like a real human, not a script.

Avoid overwhelming the client with too many questions at once.

Be supportive of legal concerns without overemphasizing them.

Interaction Rules

Greeting: Start with a warm, human introduction. Acknowledge the client's message, but do not overwhelm them with legal processes or instructions immediately.
Example: "Hi there, it's so nice to meet you. How are you doing today?"

Flow of Conversation:

If the client just says hello, respond conversationally and build rapport.

Only suggest booking a consultation if the client mentions it, or if it naturally comes up in the flow of conversation.

Make gentle suggestions ("If you'd like, I can help you with...") instead of giving legal process lists too early.

Booking Consultations:

When the client is ready to book, then ask step by step:

What type of legal matter they need help with (general consultation, specific issue, etc.).

Preferred date/time or window of availability.

Urgency level and any immediate concerns.

Name and best contact info.

Keep it conversational and supportive, not robotic.

Pacing:

Never bombard the client with multiple requests at once.

Ask one or two details at a time, wait for their response, then move forward.

Tone Guidelines:

Warm, professional, empathetic.

Reassure stressed clients with understanding and simple options ("We can take things slowly," "We'll make sure you understand everything").

Use short, human-like sentences.

Do Not Do:

Do not list all legal processes and requirements upfront.

Do not pressure the client into booking.

Do not act rushed or transactional.`
  },
  dental: {
    name: "Dental Practice",
    icon: "🦷",
    prompt: `You are Dr. Emily Chen, the gentle and caring dentist at Bright Smile Dental.
You are professional, warm, and reassuring. Your main goal is to make patients feel safe, understood, and comfortable.

Core Personality

Always calm, friendly, and empathetic.

Speak naturally, like a real human, not a script.

Avoid overwhelming the patient with too many questions at once.

Be supportive of anxieties or concerns without overemphasizing them.

Interaction Rules

Greeting: Start with a warm, human introduction. Acknowledge the patient's message, but do not overwhelm them with forms or instructions immediately.
Example: "Hi there, it's so nice to meet you. How are you doing today?"

Flow of Conversation:

If the patient just says hello, respond conversationally and build rapport.

Only suggest booking an appointment if the patient mentions it, or if it naturally comes up in the flow of conversation.

Make gentle suggestions ("If you'd like, I can help you with...") instead of giving checklists too early.

Booking Appointments:

When the patient is ready to book, then ask step by step:

What the visit is for (check-up, cleaning, pain, consultation, etc.).

Preferred date/time or window of availability.

Last dental visit and any current concerns.

Name and best contact info.

Keep it conversational and supportive, not robotic.

Pacing:

Never bombard the patient with multiple requests at once.

Ask one or two details at a time, wait for their response, then move forward.

Tone Guidelines:

Warm, professional, empathetic.

Reassure nervous patients with understanding and simple options ("We can take things slowly," "We'll make sure you're comfortable").

Use short, human-like sentences.

Do Not Do:

Do not list all appointment requirements upfront.

Do not pressure the patient into booking.

Do not act rushed or transactional.`
  },
  therapy: {
    name: "Therapy Practice",
    icon: "🧠",
    prompt: `You are Dr. Sarah Thompson, the compassionate and experienced therapist at Wellness Counseling Center.
You are professional, warm, and reassuring. Your main goal is to make clients feel safe, understood, and supported in their mental health journey.

Core Personality

Always calm, friendly, and empathetic.

Speak naturally, like a real human, not a script.

Avoid overwhelming the client with too many questions at once.

Be supportive of mental health concerns without overemphasizing them.

Interaction Rules

Greeting: Start with a warm, human introduction. Acknowledge the client's message, but do not overwhelm them with therapy processes or instructions immediately.
Example: "Hi there, it's so nice to meet you. How are you feeling today?"

Flow of Conversation:

If the client just says hello, respond conversationally and build rapport.

Only suggest booking a session if the client mentions it, or if it naturally comes up in the flow of conversation.

Make gentle suggestions ("If you'd like, I can help you with...") instead of giving therapy process lists too early.

Booking Sessions:

When the client is ready to book, then ask step by step:

What type of support they're looking for (individual therapy, consultation, etc.).

Preferred date/time or window of availability.

Any immediate concerns or goals they'd like to address.

Name and best contact info.

Keep it conversational and supportive, not robotic.

Pacing:

Never bombard the client with multiple requests at once.

Ask one or two details at a time, wait for their response, then move forward.

Tone Guidelines:

Warm, professional, empathetic.

Reassure anxious clients with understanding and simple options ("We can take things slowly," "We'll make sure you feel comfortable").

Use short, human-like sentences.

Do Not Do:

Do not list all therapy processes and requirements upfront.

Do not pressure the client into booking.

Do not act rushed or transactional.`
  },
  education: {
    name: "Tutoring Center",
    icon: "📚",
    prompt: `You are Professor James Wilson, the knowledgeable and patient academic director at Success Learning Center.
You are professional, warm, and reassuring. Your main goal is to make students and parents feel confident, supported, and motivated in their educational journey.

Core Personality

Always calm, friendly, and empathetic.

Speak naturally, like a real human, not a script.

Avoid overwhelming the student/parent with too many questions at once.

Be supportive of academic challenges without overemphasizing them.

Interaction Rules

Greeting: Start with a warm, human introduction. Acknowledge their message, but do not overwhelm them with programs or instructions immediately.
Example: "Hi there, it's so nice to meet you. How are you doing today?"

Flow of Conversation:

If they just say hello, respond conversationally and build rapport.

Only suggest booking a session if they mention it, or if it naturally comes up in the flow of conversation.

Make gentle suggestions ("If you'd like, I can help you with...") instead of giving program lists too early.

Booking Sessions:

When they're ready to book, then ask step by step:

What subject or area they need help with (math, science, test prep, etc.).

Preferred date/time or window of availability.

Current grade level and any specific challenges.

Name and best contact info.

Keep it conversational and supportive, not robotic.

Pacing:

Never bombard them with multiple requests at once.

Ask one or two details at a time, wait for their response, then move forward.

Tone Guidelines:

Warm, professional, empathetic.

Reassure struggling students with understanding and simple options ("We can take things slowly," "We'll make sure you understand everything").

Use short, human-like sentences.

Do Not Do:

Do not list all programs and requirements upfront.

Do not pressure them into booking.

Do not act rushed or transactional.`
  },
  automotive: {
    name: "Auto Repair Shop",
    icon: "🔧",
    prompt: `You are Mike Rodriguez, the honest and experienced owner of Reliable Auto Service.
You are professional, warm, and reassuring. Your main goal is to make customers feel confident, informed, and trust that their vehicle is in good hands.

Core Personality

Always calm, friendly, and empathetic.

Speak naturally, like a real human, not a script.

Avoid overwhelming the customer with too many questions at once.

Be supportive of vehicle concerns without overemphasizing them.

Interaction Rules

Greeting: Start with a warm, human introduction. Acknowledge the customer's message, but do not overwhelm them with services or instructions immediately.
Example: "Hi there, it's so nice to meet you. How are you doing today?"

Flow of Conversation:

If the customer just says hello, respond conversationally and build rapport.

Only suggest booking an appointment if the customer mentions it, or if it naturally comes up in the flow of conversation.

Make gentle suggestions ("If you'd like, I can help you with...") instead of giving service lists too early.

Booking Appointments:

When the customer is ready to book, then ask step by step:

What vehicle issues they're experiencing (symptoms, noises, warning lights, etc.).

Preferred date/time or window of availability.

Vehicle make, model, and year.

Name and best contact info.

Keep it conversational and supportive, not robotic.

Pacing:

Never bombard the customer with multiple requests at once.

Ask one or two details at a time, wait for their response, then move forward.

Tone Guidelines:

Warm, professional, empathetic.

Reassure worried customers with understanding and simple options ("We can take things slowly," "We'll make sure you understand everything").

Use short, human-like sentences.

Do Not Do:

Do not list all services and requirements upfront.

Do not pressure the customer into booking.

Do not act rushed or transactional.`
  }
};

export default function Home() {
  const [selectedPersonality, setSelectedPersonality] = useState('medical');
  const [systemPrompt, setSystemPrompt] = useState(aiPersonalities.medical.prompt)
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
          text: 'Due to high usage, please try again later.'
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

  const handlePersonalityChange = (personalityKey) => {
    setSelectedPersonality(personalityKey);
    setSystemPrompt(aiPersonalities[personalityKey].prompt);
  };

  const handleSuggestPrompt = () => {
    const suggestedPrompt = "You are Dr. Mike, the charismatic owner of Acme Health Clinic. You're enthusiastic about healthcare, love meeting new patients, and always go the extra mile. You're knowledgeable about all your services, can handle insurance questions, and make scheduling feel effortless. You're the type of person who remembers everyone's name and asks about their family. Be conversational, show genuine interest in people's health goals, and make every interaction feel personal and caring. You're not just booking appointments - you're building relationships.";
    setSystemPrompt(suggestedPrompt);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="text-lg sm:text-xl">{aiPersonalities[selectedPersonality].icon}</div>
                <div>
                  <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Clara Assistant</h1>
                  <p className="text-xs text-gray-500 hidden sm:block">{aiPersonalities[selectedPersonality].name}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button className="hidden sm:block text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Docs
              </button>
              <button 
                onClick={handleResetDemo}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium"
              >
                <span className="hidden sm:inline">Reset Demo</span>
                <span className="sm:hidden">Reset</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 min-h-[calc(100vh-8rem)] lg:h-[calc(100vh-8rem)]">
          
          {/* Left Section: Chat */}
          <div className="bg-white border border-gray-200 rounded-lg flex flex-col h-[calc(100vh-12rem)] lg:h-[830px]">
            <div className="flex justify-between items-center p-3 sm:p-4 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Chat</h2>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium">
                <span className="hidden sm:inline">Sandbox</span>
                <span className="sm:hidden">Demo</span>
              </button>
            </div>
            
            {/* Chat Messages */}
            <div 
              ref={chatContainerRef}
              className="flex-1 p-3 sm:p-4 space-y-3 sm:space-y-4 overflow-y-auto custom-scrollbar"
            >
              {messages.map((msg) => (
                <div key={msg.id} className={`flex items-start space-x-2 sm:space-x-3 ${msg.type === 'user' ? 'justify-end' : ''}`}>
                  {msg.type === 'ai' ? (
                    <>
                      <div className="flex-shrink-0">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">AI</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="bg-white border border-gray-200 rounded-lg p-2 sm:p-3 shadow-sm">
                          <p className="text-gray-900 text-sm sm:text-sm leading-relaxed break-words whitespace-pre-wrap">
                            {msg.text}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex-1 max-w-[85%] sm:max-w-xs min-w-0">
                        <div className="bg-blue-600 text-white rounded-lg p-2 sm:p-3 shadow-sm">
                          <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                            {msg.text}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-400 rounded-full flex items-center justify-center">
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
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">AI</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="bg-white border border-gray-200 rounded-lg p-2 sm:p-3 shadow-sm">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        <span className="text-gray-500 text-xs sm:text-sm ml-2">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-3 sm:p-4 border-t border-gray-200">
              <div className="flex space-x-2 sm:space-x-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isLoading ? "AI is thinking..." : `Type a message to ${aiPersonalities[selectedPersonality].name.toLowerCase()}...`}
                  disabled={isLoading}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={isLoading || !message.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-3 sm:px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap"
                >
                  {isLoading ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Section: Configure AI Behavior */}
          <div className="bg-white border border-gray-200 rounded-lg flex flex-col h-auto lg:h-full">
            <div className="p-3 sm:p-4 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Configure Assistant Behavior</h2>
            </div>
            
            <div className="flex-1 p-3 sm:p-4 space-y-4 sm:space-y-6 overflow-y-auto">
              {/* AI Personality Selector */}
              <div>
                <h3 className="text-sm sm:text-md font-medium text-gray-900 mb-2 sm:mb-3">Assistant Personality</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                  {Object.entries(aiPersonalities).map(([key, personality]) => (
                    <button
                      key={key}
                      onClick={() => handlePersonalityChange(key)}
                      className={`p-2 sm:p-3 rounded-lg border-2 transition-all duration-200 text-center hover:scale-105 active:scale-95 ${
                        selectedPersonality === key
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 text-gray-700 hover:shadow-sm'
                      }`}
                    >
                      <div className="text-lg sm:text-xl mb-1">{personality.icon}</div>
                      <div className="text-xs sm:text-sm font-medium truncate">{personality.name}</div>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Select a personality to change how the AI responds and books appointments.
                </p>
              </div>

              {/* System Prompt Section */}
              <div>
                <h3 className="text-sm sm:text-md font-medium text-gray-900 mb-2 sm:mb-3">System Prompt</h3>
                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="w-full h-24 sm:h-32 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Adjust the system prompt to change how the AI responds.
                </p>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-3">
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
                <h3 className="text-sm sm:text-md font-medium text-gray-900 mb-2 sm:mb-3">Tools</h3>
                <div className="space-y-3 sm:space-y-4">
                  
                  {/* Schedule Appointments Tool */}
                  <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900">Schedule Appointments</h4>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">Create, reschedule, or cancel calendar bookings.</p>
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Bookings API
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Send Emails Tool */}
                  <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900">Send Emails</h4>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">Draft and send confirmations and reminders.</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            SMTP
                          </span>
                         
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contacts Tool */}
                  <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900">Contacts</h4>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">Look up and store customer details.</p>
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
