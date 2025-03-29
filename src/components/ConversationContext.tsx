
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, MessageSquare, Database, ChevronRight, ChevronDown } from 'lucide-react';
import contextService, { ConversationContext } from '@/services/contextService';
import { Button } from '@/components/ui/button';

const ConversationContextView = () => {
  const [context, setContext] = useState<ConversationContext | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // Get initial context
    loadContext();
    
    // Set up interval to refresh context periodically
    const intervalId = setInterval(loadContext, 5000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const loadContext = () => {
    const currentContext = contextService.getFullContext();
    setContext(currentContext);
  };

  if (!context) {
    return null;
  }

  return (
    <Card className="bg-gray-800 border-gray-700 mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex justify-between items-center">
          <div className="flex items-center">
            <Brain className="h-4 w-4 mr-2 text-purple-400" />
            Conversation Memory
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      
      {expanded && (
        <CardContent className="text-xs">
          {context.currentSession.siteContext && (
            <div className="mb-3">
              <div className="text-gray-400 mb-1 flex items-center">
                <MessageSquare className="h-3 w-3 mr-1 inline text-gray-500" />
                Current Context:
              </div>
              <Badge variant="outline" className="bg-gray-700">
                {context.currentSession.siteContext}
              </Badge>
            </div>
          )}
          
          {context.recentTopics.length > 0 && (
            <div className="mb-3">
              <div className="text-gray-400 mb-1 flex items-center">
                <Brain className="h-3 w-3 mr-1 inline text-gray-500" />
                Recent Topics:
              </div>
              <div className="flex flex-wrap gap-1">
                {context.recentTopics.map((topic, index) => (
                  <Badge key={index} variant="outline" className="bg-gray-700">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {Object.keys(context.extractedData).length > 0 && (
            <div className="mb-3">
              <div className="text-gray-400 mb-1 flex items-center">
                <Database className="h-3 w-3 mr-1 inline text-gray-500" />
                Extracted Data:
              </div>
              <div className="flex flex-wrap gap-1">
                {Object.keys(context.extractedData).map((key) => (
                  <Badge key={key} variant="outline" className="bg-gray-700">
                    {key}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {context.previousCommands.length > 0 && (
            <div>
              <div className="text-gray-400 mb-1">
                Recent Commands:
              </div>
              <ul className="text-gray-300 list-disc list-inside">
                {context.previousCommands.slice(0, 3).map((cmd, index) => (
                  <li key={index} className="truncate">
                    {cmd}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default ConversationContextView;
