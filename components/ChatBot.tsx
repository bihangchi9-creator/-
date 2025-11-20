import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Mic, MicOff } from 'lucide-react';
import { ChatMessage, ChatSender } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { GenerateContentResponse } from '@google/genai';

interface ChatBotProps {
  isOpen: boolean;
  onToggle: () => void;
}

// Extend window definition for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onToggle }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      text: "你好。我是毕航驰的AI助手。你可以问我关于他在AI Agent、Vibe Coding或产品管理方面的任何经验。",
      sender: ChatSender.BOT,
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'zh-CN';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        // Optional: Auto-send after voice input
        // handleSend(transcript); 
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("抱歉，您的浏览器不支持语音输入功能。");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSend = async (overrideText?: string) => {
    const textToSend = overrideText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: textToSend,
      sender: ChatSender.USER,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const streamResult = await sendMessageToGemini(userMessage.text);
      
      const botMessageId = (Date.now() + 1).toString();
      
      // Create placeholder for bot message
      setMessages(prev => [...prev, {
        id: botMessageId,
        text: '', // Will stream in
        sender: ChatSender.BOT,
        timestamp: new Date(),
      }]);

      let fullText = '';
      
      for await (const chunk of streamResult) {
        const c = chunk as GenerateContentResponse;
        const textChunk = c.text || '';
        fullText += textChunk;
        
        setMessages(prev => prev.map(msg => 
          msg.id === botMessageId ? { ...msg, text: fullText } : msg
        ));
      }

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: "系统错误：神经网络连接中断。请重试。",
        sender: ChatSender.SYSTEM,
        timestamp: new Date(),
      }]);
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

  return (
    <>
      {/* Notification Bubble - Only show when closed */}
      <div className={`fixed bottom-28 right-8 z-40 transition-all duration-500 ${isOpen ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0 delay-1000'}`}>
         <div className="bg-white text-black px-6 py-3 rounded-2xl font-bold shadow-[0_0_30px_rgba(255,255,255,0.2)] relative animate-bounce hidden md:block">
            <span className="mr-2">✨</span> 
            有问题？问问我的 AI 分身！
            <div className="absolute bottom-[-8px] right-8 w-0 h-0 border-l-[8px] border-l-transparent border-t-[8px] border-t-white border-r-[8px] border-r-transparent"></div>
         </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className={`fixed bottom-8 right-8 z-50 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full shadow-2xl transition-all duration-300 hover:scale-105 group ${
          isOpen ? 'bg-zinc-800 text-white rotate-90' : 'bg-white text-black'
        }`}
        aria-label="Toggle Chat"
      >
        {/* Pulse animation ring */}
        {!isOpen && (
           <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-20 animate-ping"></span>
        )}

        {isOpen ? (
          <X className="w-8 h-8 md:w-10 md:h-10 relative z-10" />
        ) : (
          <Bot className="w-8 h-8 md:w-10 md:h-10 relative z-10" />
        )}
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-28 md:bottom-32 right-4 md:right-8 z-40 w-[90vw] md:w-[450px] h-[600px] md:h-[650px] max-h-[80vh] bg-[#1c1c1e]/90 rounded-3xl flex flex-col transition-all duration-500 transform origin-bottom-right border border-white/10 shadow-2xl backdrop-blur-xl ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bot className="w-6 h-6 text-white" />
              <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full border-2 border-[#1c1c1e]"></span>
            </div>
            <div>
               <div className="font-bold text-white text-base">AI 助手</div>
               <div className="text-[10px] text-gray-400 font-mono tracking-wider">POWERED BY GEMINI</div>
            </div>
          </div>
          <div className="flex gap-1.5">
             {/* Decorative UI dots */}
             <div className="w-2 h-2 rounded-full bg-white/20" />
             <div className="w-2 h-2 rounded-full bg-white/20" />
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 font-sans text-sm scroll-smooth">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === ChatSender.USER ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] px-5 py-3.5 text-[15px] leading-relaxed shadow-sm ${
                  msg.sender === ChatSender.USER
                    ? 'bg-white text-black rounded-2xl rounded-br-sm'
                    : msg.sender === ChatSender.SYSTEM
                    ? 'bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl'
                    : 'bg-[#2c2c2e] text-white rounded-2xl rounded-bl-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-5 border-t border-white/10 bg-[#1c1c1e]/50 backdrop-blur-md rounded-b-3xl">
          <div className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="发消息..."
                className="w-full bg-[#2c2c2e] rounded-full py-3.5 pl-5 pr-12 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20 resize-none h-[52px] transition-all"
                disabled={isLoading}
              />
            </div>
            
            {/* Voice Input Button */}
            <button
              onClick={toggleListening}
              disabled={isLoading}
              className={`p-3 rounded-full transition-all ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-[#2c2c2e] text-gray-400 hover:text-white hover:bg-[#3c3c3e]'
              }`}
              title="语音输入"
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Send Button */}
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !inputText.trim()}
              className="p-3 bg-white rounded-full text-black hover:bg-gray-200 transition-all disabled:opacity-50 disabled:scale-90"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          {isLoading && (
            <div className="text-[10px] text-gray-500 mt-3 text-center font-mono uppercase tracking-widest animate-pulse">
              Gemini thinking...
            </div>
          )}
          {isListening && (
            <div className="text-[10px] text-red-400 mt-3 text-center font-mono uppercase tracking-widest animate-pulse">
              正在聆听...
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatBot;