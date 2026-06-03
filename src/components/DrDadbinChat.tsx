import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Locale } from '@/App';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface DrDadbinChatProps {
  locale: Locale;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const content = {
  fa: {
    title: 'دکتر دادبین',
    subtitle: 'مشاور هوشمند مهاجرت',
    placeholder: 'سوال خود را بپرسید...',
    welcome: 'سلام! من دکتر دادبین هستم، مشاور تخصصی مهاجرت و پناهندگی. چطور میتوانم به شما کمک کنم؟',
    typing: 'در حال نوشتن...',
  },
  en: {
    title: 'Dr. Dadbin',
    subtitle: 'AI Immigration Advisor',
    placeholder: 'Ask your question...',
    welcome: "Hello! I'm Dr. Dadbin, your specialized immigration and asylum advisor. How can I assist you today?",
    typing: 'Typing...',
  },
};

// System prompt for Dr. Dadbin persona
const SYSTEM_PROMPT = `You are Dr. Dadbin (دکتر دادبین), an expert international and Iranian immigration lawyer with 20+ years of experience. 

Your personality:
- Warm, empathetic, and professional tone
- Speak in clear, accessible language (not overly legalistic)
- Show genuine concern for clients' situations
- Provide practical, actionable advice
- Always prioritize legal and safe migration pathways

Your expertise includes:
- Asylum and refugee cases (UNHCR procedures)
- Student visas (Canada, USA, UK, Australia, Germany)
- Work visas (Skilled Worker, Express Entry, Job Seeker)
- Family reunification
- Humanitarian programs
- Document preparation and case engineering

Important guidelines:
1. If someone asks about asylum but has strong profiles for student/work visas, gently steer them toward those safer, legal alternatives
2. Always emphasize legal pathways and warn against fraudulent schemes
3. Ask clarifying questions to understand their full situation
4. Provide step-by-step guidance when possible
5. Acknowledge the emotional difficulty of migration journeys
6. Never guarantee outcomes - always be realistic

Language: Respond in the same language as the user's message (Farsi or English).`;

export default function DrDadbinChat({ locale, isOpen, onClose, onOpen }: DrDadbinChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = content[locale];

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: t.welcome,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, messages.length, t.welcome]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Get API key from environment variable
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey) {
        // Fallback response if no API key
        const fallbackResponse = locale === 'fa' 
          ? 'متأسفانه سرویس هوش مصنوعی در حال حاضر در دسترس نیست. لطفاً با پشتیبانی تماس بگیرید.'
          : 'The AI service is currently unavailable. Please contact support for assistance.';
        
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              role: 'assistant',
              content: fallbackResponse,
              timestamp: new Date(),
            },
          ]);
          setIsLoading(false);
          setIsTyping(false);
        }, 1000);
        return;
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

      const conversationHistory = messages
        .slice(-6)
        .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
        .join('\n');

      const prompt = `${SYSTEM_PROMPT}\n\nConversation History:\n${conversationHistory}\n\nUser: ${userMessage.content}\n\nDr. Dadbin:`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error('AI Error:', error);
      const errorMessage = locale === 'fa'
        ? 'متأسفانه خطایی رخ داد. لطفاً دوباره تلاش کنید.'
        : 'An error occurred. Please try again.';
      
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: errorMessage,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={onOpen}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary hover:bg-primary-dark text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        aria-label={locale === 'fa' ? 'باز کردن چت با دکتر دادبین' : 'Open Dr. Dadbin Chat'}
      >
        <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full animate-pulse" />
      </button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 z-50 w-[380px] h-[580px] flex flex-col shadow-2xl border border-primary/20 dark:border-slate-700 bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="w-10 h-10 bg-primary/10">
              <AvatarFallback className="bg-primary/20">
                <Bot className="w-5 h-5 text-primary" />
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t.title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-secondary" />
              {t.subtitle}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Close chat"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <Avatar className={`w-8 h-8 ${message.role === 'user' ? 'bg-secondary/10' : 'bg-primary/10'}`}>
                <AvatarFallback>
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-secondary" />
                  ) : (
                    <Bot className="w-4 h-4 text-primary" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div
                className={`max-w-[75%] rounded-2xl p-3 ${
                  message.role === 'user'
                    ? 'bg-secondary text-white rounded-tr-sm'
                    : 'bg-gray-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-sm'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-white/70' : 'text-slate-500'}`}>
                  {new Date(message.timestamp).toLocaleTimeString(locale === 'fa' ? 'fa-IR' : 'en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3">
              <Avatar className="w-8 h-8 bg-primary/10">
                <AvatarFallback>
                  <Bot className="w-4 h-4 text-primary" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 dark:bg-slate-800 rounded-2xl rounded-tl-sm p-3 flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs text-slate-500">{t.typing}</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="flex items-center gap-2 p-4 border-t border-gray-200 dark:border-slate-700">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t.placeholder}
          disabled={isLoading}
          className="flex-1 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
        <Button
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          size="icon"
          className="bg-primary hover:bg-primary-dark"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </Card>
  );
}