
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Mic, CircleSlash, StopCircle } from 'lucide-react';
import ChatMessage, { ChatMessageProps } from './ChatMessage';
import { useToast } from '@/hooks/use-toast';

interface ChatInterfaceProps {
  onSendMessage: (message: string) => void;
  messages: ChatMessageProps[];
  isProcessing: boolean;
  onCancelRequest?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  onSendMessage, 
  messages,
  isProcessing,
  onCancelRequest
}) => {
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isMicActive, setIsMicActive] = useState(false);
  
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

  // Auto-suggest demonstration commands
  const demoCommands = [
    "Log into Gmail and check my inbox",
    "Search for 'AI news' on Google and open the first result",
    "Go to Wikipedia and search for 'browser automation'"
  ];

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

  const handleMicToggle = () => {
    if (!isMicActive) {
      // Start voice recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        setIsMicActive(true);
        toast({
          title: "Voice recognition activated",
          description: "Speak your command clearly...",
        });
        
        // This is a mock since we'd need browser permissions for real implementation
        setTimeout(() => {
          setIsMicActive(false);
          toast({
            title: "Voice recognition complete",
          });
        }, 3000);
      } else {
        toast({
          title: "Voice recognition not supported",
          description: "Your browser doesn't support this feature",
          variant: "destructive",
        });
      }
    } else {
      // Stop voice recognition
      setIsMicActive(false);
    }
  };

  const handleDemoCommandClick = (command: string) => {
    setInput(command);
    if (inputRef.current) {
      inputRef.current.focus();
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
            className={`text-gray-400 border-gray-700 ${isMicActive ? 'bg-red-900/30' : ''}`}
            onClick={handleMicToggle}
            disabled={isProcessing}
          >
            <Mic className={`h-4 w-4 ${isMicActive ? 'text-red-400' : ''}`} />
          </Button>
          {isProcessing && (
            <Button
              size="icon"
              variant="destructive"
              onClick={onCancelRequest}
            >
              <StopCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {!isProcessing && input.trim() === '' && (
          <div className="mt-3 flex flex-wrap gap-2">
            {demoCommands.map((cmd, i) => (
              <Button 
                key={i} 
                variant="outline" 
                size="sm" 
                className="text-xs bg-gray-800 border-gray-700 hover:bg-gray-700"
                onClick={() => handleDemoCommandClick(cmd)}
              >
                {cmd}
              </Button>
            ))}
          </div>
        )}
        
        <div className="mt-2 text-xs text-gray-500">
          {isProcessing ? 
            "AI is processing your request..." : 
            "For a complete demo, try: 'Log into Gmail, search for AI news, and open the first result'"
          }
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
