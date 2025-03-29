
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

type BrowserAction = {
  id: string;
  type: 'navigation' | 'click' | 'input' | 'extract';
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  details?: string;
  timestamp: Date;
};

interface BrowserPreviewProps {
  currentUrl: string;
  browserActions: BrowserAction[];
  isActive: boolean;
}

const BrowserPreview: React.FC<BrowserPreviewProps> = ({ 
  currentUrl, 
  browserActions, 
  isActive 
}) => {
  return (
    <div className="h-full flex flex-col">
      <div className="bg-agent-dark rounded-t-lg border border-gray-800 p-2 flex items-center space-x-2">
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="flex-1 bg-gray-800 rounded px-3 py-1 text-sm text-gray-300 truncate">
          {currentUrl}
        </div>
        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse-slow' : 'bg-gray-500'}`}></div>
      </div>
      
      <div className="flex-1 border border-t-0 border-gray-800 rounded-b-lg bg-gray-900 p-4 overflow-hidden">
        <Tabs defaultValue="preview">
          <TabsList className="mb-4">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
            <TabsTrigger value="console">Console</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="h-[calc(100%-40px)]">
            <div className="w-full h-full bg-white rounded flex items-center justify-center">
              <div className="text-center p-4">
                <div className="text-agent-primary text-lg mb-2">Browser Visualization</div>
                <p className="text-gray-600 text-sm">
                  A preview of the automated browser would appear here
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="actions" className="h-[calc(100%-40px)] overflow-y-auto">
            <div className="space-y-2">
              {browserActions.map((action) => (
                <Card key={action.id} className="p-3 bg-gray-800 border-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-200">
                        {action.type.charAt(0).toUpperCase() + action.type.slice(1)}
                      </div>
                      <div className="text-sm text-gray-400">{action.description}</div>
                      {action.details && (
                        <div className="text-xs text-gray-500 mt-1">{action.details}</div>
                      )}
                    </div>
                    <div className={`px-2 py-1 text-xs rounded ${
                      action.status === 'completed' ? 'bg-green-900 text-green-300' :
                      action.status === 'active' ? 'bg-blue-900 text-blue-300' :
                      action.status === 'error' ? 'bg-red-900 text-red-300' :
                      'bg-gray-700 text-gray-300'
                    }`}>
                      {action.status}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {action.timestamp.toLocaleTimeString()}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="console" className="h-[calc(100%-40px)]">
            <div className="w-full h-full bg-black rounded p-3 font-mono text-sm text-green-400 overflow-y-auto">
              <div>> Browser agent initialized</div>
              <div>> Ready to receive commands</div>
              <div>> Waiting for user input...</div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BrowserPreview;
