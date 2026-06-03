import { useState, useRef, useEffect } from 'react';
import { Send, FileText, Image, File, Download, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { useDropzone } from 'react-dropzone';
import type { Locale } from '@/App';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'user' | 'admin';
  content: string;
  timestamp: Date;
  files?: UploadedFile[];
  isRead: boolean;
}

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

interface ChatRoomPortalProps {
  locale: Locale;
  userId?: string;
  userName?: string;
  isAdmin?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const content = {
  fa: {
    placeholder: 'پیام خود را بنویسید...',
    attachFile: 'پیوست فایل',
    dropFiles: 'فایل‌ها را اینجا رها کنید',
    fileTooLarge: 'حجم فایل نباید بیشتر از 5 مگابایت باشد',
    unsupportedType: 'نوع فایل پشتیبانی نمی‌شود',
    send: 'ارسال',
    adminReply: 'پاسخ ادمین',
    you: 'شما',
    admin: 'ادمین',
    uploaded: 'آپلود شد',
    uploading: 'در حال آپلود...',
  },
  en: {
    placeholder: 'Type your message...',
    attachFile: 'Attach file',
    dropFiles: 'Drop files here',
    fileTooLarge: 'File size must be under 5MB',
    unsupportedType: 'Unsupported file type',
    send: 'Send',
    adminReply: 'Admin Reply',
    you: 'You',
    admin: 'Admin',
    uploaded: 'Uploaded',
    uploading: 'Uploading...',
  },
};

export default function ChatRoomPortal({ locale, userId, userName, isAdmin = false }: ChatRoomPortalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: 'admin',
      senderName: 'Admin',
      senderRole: 'admin',
      content: locale === 'fa' 
        ? 'سلام! به پورتال ارتباطی خوش آمدید. مدارک خود را اینجا ارسال کنید.' 
        : "Hello! Welcome to the communication portal. Please upload your documents here.",
      timestamp: new Date(Date.now() - 3600000),
      isRead: true,
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [, setUploadingFiles] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = content[locale];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const onDrop = (acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      const rejected = rejectedFiles[0];
      if (rejected.file.size > MAX_FILE_SIZE) {
        setError(t.fileTooLarge);
      } else {
        setError(t.unsupportedType);
      }
      setTimeout(() => setError(''), 3000);
      return;
    }

    acceptedFiles.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        setError(t.fileTooLarge);
        setTimeout(() => setError(''), 3000);
        return;
      }

      const uploadedFile: UploadedFile = {
        id: `${Date.now()}-${file.name}`,
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
      };

      // Simulate upload
      setUploadingFiles((prev) => new Set([...prev, uploadedFile.id]));
      setTimeout(() => {
        setUploadingFiles((prev) => {
          const next = new Set(prev);
          next.delete(uploadedFile.id);
          return next;
        });
      }, 1500);

      // Add message with file
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: userId || 'user',
        senderName: userName || (locale === 'fa' ? 'کاربر' : 'User'),
        senderRole: isAdmin ? 'admin' : 'user',
        content: '',
        timestamp: new Date(),
        files: [uploadedFile],
        isRead: false,
      };

      setMessages((prev) => [...prev, newMessage]);
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxSize: MAX_FILE_SIZE,
    multiple: true,
  });

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: userId || 'user',
      senderName: userName || (locale === 'fa' ? 'کاربر' : 'User'),
      senderRole: isAdmin ? 'admin' : 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
      isRead: false,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <Card className="flex flex-col h-[500px] dark:bg-slate-900 dark:border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 bg-primary/10">
            <AvatarFallback className="text-primary font-medium">
              {isAdmin ? 'A' : 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">
              {isAdmin 
                ? (locale === 'fa' ? 'پشتیبانی' : 'Support Team')
                : (locale === 'fa' ? 'ارتباط با ادمین' : 'Chat with Admin')
              }
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {locale === 'fa' ? 'پاسخ‌گویی 24/7' : '24/7 Response'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {locale === 'fa' ? 'آنلاین' : 'Online'}
          </span>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => {
            const isMe = msg.senderId === userId || (isAdmin && msg.senderRole === 'admin');

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
              >
                <Avatar className={`w-8 h-8 ${isMe ? 'bg-primary/10' : 'bg-secondary/10'}`}>
                  <AvatarFallback className="text-xs">
                    {isMe ? (isAdmin ? 'A' : 'U') : (isAdmin ? 'U' : 'A')}
                  </AvatarFallback>
                </Avatar>
                <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div
                    className={`rounded-2xl p-3 ${
                      isMe
                        ? 'bg-primary text-white rounded-tr-sm'
                        : 'bg-gray-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-sm'
                    }`}
                  >
                    {msg.content && (
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    )}
                    {msg.files && msg.files.map((file) => {
                      const FileIcon = file.type.includes('pdf') ? FileText : file.type.includes('image') ? Image : File;
                      return (
                        <div
                          key={file.id}
                          className={`mt-2 flex items-center gap-2 p-2 rounded-lg ${
                            isMe ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700'
                          }`}
                        >
                          <FileIcon className="w-4 h-4" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{file.name}</p>
                          <p className={`text-[10px] ${isMe ? 'text-white/70' : 'text-slate-500'}`}>
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                          <a
                            href={file.url}
                            download={file.name}
                            className={`p-1 rounded ${isMe ? 'hover:bg-white/30' : 'hover:bg-slate-300 dark:hover:bg-slate-600'}`}
                          >
                            <Download className="w-3 h-3" />
                          </a>
                        </div>
                      );
                    })}
                  </div>
                  <div className={`flex items-center gap-2 mt-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      {new Date(msg.timestamp).toLocaleTimeString(locale === 'fa' ? 'fa-IR' : 'en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {msg.senderRole === 'admin' && !isMe && (
                      <span className="text-[10px] text-primary font-medium">
                        {t.adminReply}
                      </span>
                    )}
                    {msg.isRead && (
                      <CheckCircle className="w-3 h-3 text-green-500" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`mx-4 mb-2 border-2 border-dashed rounded-xl p-3 text-center transition-colors cursor-pointer ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-slate-300 dark:border-slate-600 hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {isDragActive ? t.dropFiles : `${t.attachFile} (PDF, JPG, PNG - ${t.uploading})`}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-4 mb-2 p-2 bg-error/10 text-error text-xs rounded-lg text-center">
          {error}
        </div>
      )}

      {/* Input */}
      <div className="flex items-center gap-2 p-4 border-t dark:border-slate-700">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t.placeholder}
          className="flex-1 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
        <Button
          onClick={sendMessage}
          disabled={!inputMessage.trim()}
          size="icon"
          className="bg-primary hover:bg-primary-dark"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}