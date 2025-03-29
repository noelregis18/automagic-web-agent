
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Mic, CircleSlash } from 'lucide-react';
import ChatMessage, { ChatMessageProps } from './ChatMessage';

interface ChatInterfaceProps {
  onSendMessage: (message: string) => void;
  messages: ChatMessageProps[];
  isProcessing: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  onSendMessage, 
  messages,
  isProcessing
}) => {
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Auto-scroll to the latest message
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  // Focus the input field when the component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSendMessage = () => {
    if (input.trim() && !isProcessing) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gray-800">
        <h2 className="text-lg font-semibold">Browser Agent Chat</h2>
        <p className="text-sm text-gray-400">Send commands to automate your browser</p>
      </div>
      
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <ChatMessage key={index} {...msg} />
          ))}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-gray-800">
        <div className="flex space-x-2">
          <Input
            ref={inputRef}
            placeholder={isProcessing ? "Processing your request..." : "Type a command..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            className="bg-gray-800 border-gray-700"
          />
          <Button 
            size="icon" 
            onClick={handleSendMessage}
            disabled={isProcessing || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="text-gray-400 border-gray-700"
          >
            <Mic className="h-4 w-4" />
          </Button>
          {isProcessing && (
            <Button
              size="icon"
              variant="destructive"
            >
              <CircleSlash className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="mt-2 text-xs text-gray-500">
          {isProcessing ? 
            "AI is processing your request..." : 
            "Try: 'Log into Gmail', 'Search for AI news on Google', or 'Check the weather'"
          }
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
