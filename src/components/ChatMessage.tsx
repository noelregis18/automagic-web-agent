
import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Search, ExternalLink, Link, Clock } from 'lucide-react';

export type MessageRole = 'user' | 'assistant' | 'system';

export type SearchResult = {
  title: string;
  url: string;
  snippet: string;
};

export interface ChatMessageProps {
  content: string;
  role: MessageRole;
  timestamp: Date;
  isLoading?: boolean;
  isTyping?: boolean;
  searchResults?: SearchResult[];
  relatedQueries?: string[];
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  content, 
  role, 
  timestamp,
  isLoading = false,
  isTyping = false,
  searchResults = [],
  relatedQueries = []
}) => {
  const isUser = role === 'user';
  
  // Function to render search results if available
  const renderSearchResults = () => {
    if (searchResults && searchResults.length > 0) {
      return (
        <div className="mt-3 space-y-2 border-t border-gray-700 pt-2">
          <div className="flex items-center text-xs text-gray-400 mb-1">
            <Search className="h-3 w-3 mr-1" />
            <span>Search results</span>
          </div>
          {searchResults.map((result, index) => (
            <div key={index} className="bg-gray-800/50 p-2 rounded text-sm">
              <a 
                href={result.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                {result.title}
                <ExternalLink className="h-3 w-3" />
              </a>
              <p className="text-gray-300 text-xs mt-1">{result.snippet}</p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Function to render related queries if available
  const renderRelatedQueries = () => {
    if (relatedQueries && relatedQueries.length > 0) {
      return (
        <div className="mt-3 space-y-2 border-t border-gray-700 pt-2">
          <div className="flex items-center text-xs text-gray-400 mb-1">
            <Link className="h-3 w-3 mr-1" />
            <span>Related queries</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {relatedQueries.map((query, index) => (
              <span 
                key={index} 
                className="bg-gray-800 text-xs px-2 py-1 rounded cursor-pointer hover:bg-gray-700"
              >
                {query}
              </span>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };
  
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
            <div className="typing-indicator flex space-x-1 items-center">
              <span className="text-sm">Thinking</span>
              <span className="animate-bounce delay-0">.</span>
              <span className="animate-bounce delay-150">.</span>
              <span className="animate-bounce delay-300">.</span>
            </div>
          ) : (
            <div className="whitespace-pre-wrap">
              {content}
              {isTyping && !isLoading && (
                <span className="h-4 w-2 ml-1 inline-block bg-gray-400 animate-blink cursor-animation"></span>
              )}
            </div>
          )}
        </div>
        
        {/* Render search results if available */}
        {!isUser && !isLoading && renderSearchResults()}
        
        {/* Render related queries if available */}
        {!isUser && !isLoading && renderRelatedQueries()}
        
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3 text-gray-500" />
          <span className="text-xs text-gray-500">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
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
