
import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessageProps {
  content: string;
  role: MessageRole;
  timestamp: Date;
  isLoading?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  content, 
  role, 
  timestamp,
  isLoading = false
}) => {
  const isUser = role === 'user';
  
  return (
    <div className={cn(
      "flex w-full items-start gap-4 py-4",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <Avatar className="h-8 w-8 bg-agent-primary text-white">
          <span className="text-xs">AI</span>
        </Avatar>
      )}
      
      <div className={cn(
        "flex flex-col gap-1 max-w-[80%]",
        isUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "px-4 py-3 rounded-lg",
          isUser 
            ? "bg-agent-primary text-white"
            : "bg-gray-800 text-gray-100"
        )}>
          {isLoading ? (
            <div className="typing-indicator animate-typing">
              Thinking...
            </div>
          ) : (
            <div className="whitespace-pre-wrap">{content}</div>
          )}
        </div>
        
        <span className="text-xs text-gray-500">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      
      {isUser && (
        <Avatar className="h-8 w-8 bg-gray-700 text-white">
          <span className="text-xs">You</span>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
