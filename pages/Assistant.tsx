import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { Chat, GenerateContentResponse } from "@google/genai";
import { createChatSession, sendMessageToGemini } from '../services/geminiService';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const Assistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
        id: 'welcome', 
        role: 'model', 
        text: "Hi there! I'm Savora, your AI financial assistant. Ask me anything about savings plans, Susu groups, or how to budget better! 💰" 
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat session on mount
    chatSessionRef.current = createChatSession();
  }, []);

  useEffect(() => {
    // Scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || !chatSessionRef.current) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', text: inputText };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const streamResult = await sendMessageToGemini(chatSessionRef.current, userMessage.text);
      
      // Create a placeholder message for the AI response
      const botMessageId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: botMessageId, role: 'model', text: '' }]);

      let fullText = '';
      for await (const chunk of streamResult) {
        const chunkText = (chunk as GenerateContentResponse).text;
        if (chunkText) {
          fullText += chunkText;
          setMessages(prev => 
            prev.map(msg => msg.id === botMessageId ? { ...msg, text: fullText } : msg)
          );
        }
      }
    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "Sorry, I'm having trouble connecting right now. Please check your internet or try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!process.env.API_KEY) {
      return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Bot size={40} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-navy-900 mb-2">AI Assistant Unavailable</h2>
            <p className="text-gray-500 max-w-md">
                To use the AI financial assistant, please configure your Gemini API Key in the environment settings.
            </p>
        </div>
      );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] md:h-screen bg-white md:bg-gray-50 max-w-4xl mx-auto md:border-x md:border-gray-200 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-white flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center text-gold-600">
            <Sparkles size={20} />
        </div>
        <div>
            <h1 className="font-bold text-navy-900">Savora Assistant</h1>
            <span className="text-xs text-green-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
            </span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-navy-900 text-white rounded-tr-none'
                  : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
              }`}
            >
              {msg.role === 'model' && (
                 <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gold-600 uppercase tracking-wide">
                    <Bot size={14} /> Savora
                 </div>
              )}
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex items-end gap-2 bg-gray-100 p-2 rounded-3xl">
            <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask for advice..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-navy-900 max-h-32 resize-none py-3 px-4 text-sm scrollbar-hide"
                rows={1}
            />
            <button 
                onClick={handleSend}
                disabled={!inputText.trim() || isLoading}
                className={`p-3 rounded-full transition-all ${
                    inputText.trim() && !isLoading 
                    ? 'bg-navy-900 text-white hover:bg-navy-800' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
                <Send size={20} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
