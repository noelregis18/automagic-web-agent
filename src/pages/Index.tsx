
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ChatInterface from '@/components/ChatInterface';
import BrowserPreview from '@/components/BrowserPreview';
import StatusBar from '@/components/StatusBar';
import TaskScheduler from '@/components/TaskScheduler';
import PlatformInfo from '@/components/PlatformInfo';
import ConversationContextView from '@/components/ConversationContext';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChatMessageProps } from '@/components/ChatMessage';
import browserService, { BrowserAction, ExtractedData } from '@/services/browserService';
import contextService from '@/services/contextService';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessageProps[]>([
    {
      content: "Hi! I'm your Browser Automation Agent. I can help you automate tasks in your web browser across Windows, macOS, and Linux. Just tell me what you'd like to do!",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [browserActions, setBrowserActions] = useState<BrowserAction[]>([]);
  const [extractedData, setExtractedData] = useState<ExtractedData[]>([]);
  const [currentUrl, setCurrentUrl] = useState('about:blank');
  const [startTime] = useState(new Date());
  const [uptime, setUptime] = useState('0:00:00');
  const [lastAction, setLastAction] = useState('None');
  const [activeTab, setActiveTab] = useState('browser');
  
  // Calculate uptime
  useEffect(() => {
    const uptimeInterval = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;
      setUptime(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);
    
    return () => clearInterval(uptimeInterval);
  }, [startTime]);
  
  const handleSendMessage = async (message: string) => {
    // Add user message to chat
    const userMessage: ChatMessageProps = {
      content: message,
      role: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Show loading state
    setIsProcessing(true);
    const loadingMessage: ChatMessageProps = {
      content: 'Thinking...',
      role: 'assistant',
      timestamp: new Date(),
      isLoading: true
    };
    setMessages(prev => [...prev, loadingMessage]);
    
    try {
      // Process the command through our browser service
      const { response, actions, newUrl, extractedData } = await browserService.executeCommand(message);
      
      // Update UI with results
      setMessages(prev => prev.filter(msg => !msg.isLoading));
      
      const assistantMessage: ChatMessageProps = {
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      if (actions.length > 0) {
        setBrowserActions(prev => [...prev, ...actions]);
        setLastAction(actions[actions.length - 1].description);
      }
      
      if (newUrl) {
        setCurrentUrl(newUrl);
      }
      
      if (extractedData && extractedData.length > 0) {
        setExtractedData(prev => [...prev, ...extractedData]);
      }
      
      // Notify success
      toast({
        title: "Command executed",
        description: actions.length > 0 
          ? `Completed ${actions.length} browser actions` 
          : "The browser automation task has been completed.",
      });
    } catch (error) {
      // Handle errors
      setMessages(prev => prev.filter(msg => !msg.isLoading));
      
      const errorMessage: ChatMessageProps = {
        content: "Sorry, I encountered an error while trying to execute your command. Please try again.",
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to execute browser command.",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="flex flex-col h-screen bg-agent-dark">
      <Header />
      
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        <div className="flex flex-col h-full border-r border-gray-800">
          <ChatInterface 
            onSendMessage={handleSendMessage} 
            messages={messages}
            isProcessing={isProcessing}
          />
        </div>
        
        <div className="flex flex-col h-full p-4">
          <PlatformInfo />
          
          <ConversationContextView />
          
          <Tabs defaultValue="browser" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="browser">Browser</TabsTrigger>
              <TabsTrigger value="scheduler">Task Scheduler</TabsTrigger>
            </TabsList>
            
            <TabsContent value="browser" className="mt-0">
              <BrowserPreview 
                currentUrl={currentUrl}
                browserActions={browserActions}
                extractedData={extractedData}
                isActive={isProcessing}
              />
            </TabsContent>
            
            <TabsContent value="scheduler" className="mt-0">
              <TaskScheduler />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <StatusBar 
        status={isProcessing ? 'active' : 'idle'} 
        lastAction={lastAction}
        uptime={uptime}
      />
    </div>
  );
};

export default Index;
