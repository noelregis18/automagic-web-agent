// This is a mock service to simulate browser automation 
// In a real implementation, this would use Playwright, Puppeteer, or custom browser APIs
import { detectPlatform, getPlatformSpecificCommand, Platform } from '../utils/platformUtils';
import contextService from './contextService';
import schedulerService from './schedulerService';

export type BrowserAction = {
  id: string;
  type: 'navigation' | 'click' | 'input' | 'extract';
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  details?: string;
  timestamp: Date;
};

export type ExtractedData = {
  type: 'text' | 'link' | 'image' | 'table' | 'json';
  content: any;
  source: string;
};

export type BrowserConfig = {
  proxy?: string;
  extensions?: string[];
  userAgent?: string;
  platform?: Platform;
};

class BrowserService {
  private actionHistory: BrowserAction[] = [];
  private currentUrl: string = 'about:blank';
  private isActive: boolean = false;
  private extractedData: ExtractedData[] = [];
  private browserConfig: BrowserConfig = {
    platform: detectPlatform()
  };
  private conversationHistory: { role: 'user' | 'assistant', content: string }[] = [];
  
  constructor() {
    // Load any saved config from localStorage
    this.loadConfig();
    
    // Setup platform-specific configuration
    this.setupPlatformConfig();
    
    console.log(`Browser service initialized for platform: ${this.browserConfig.platform}`);
  }
  
  private loadConfig(): void {
    try {
      const savedConfig = localStorage.getItem('browserConfig');
      if (savedConfig) {
        this.browserConfig = { ...this.browserConfig, ...JSON.parse(savedConfig) };
      }
    } catch (error) {
      console.error('Failed to load browser configuration:', error);
    }
  }
  
  private saveConfig(): void {
    try {
      localStorage.setItem('browserConfig', JSON.stringify(this.browserConfig));
    } catch (error) {
      console.error('Failed to save browser configuration:', error);
    }
  }
  
  private setupPlatformConfig(): void {
    // Add any platform-specific initialization here
    const platform = this.browserConfig.platform || 'unknown';
    
    // Set default user agent based on platform
    if (!this.browserConfig.userAgent) {
      this.browserConfig.userAgent = this.getDefaultUserAgent(platform);
    }
  }
  
  private getDefaultUserAgent(platform: Platform): string {
    // Return platform-specific user agent strings
    switch (platform) {
      case 'windows':
        return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
      case 'macos':
        return 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
      case 'linux':
        return 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
      default:
        return navigator.userAgent;
    }
  }
  
  // Configure browser settings
  setBrowserConfig(config: BrowserConfig): void {
    this.browserConfig = { ...this.browserConfig, ...config };
    this.saveConfig();
    console.log('Browser configuration updated:', this.browserConfig);
  }
  
  getBrowserConfig(): BrowserConfig {
    return { ...this.browserConfig };
  }
  
  // Add methods to handle conversation context
  addToConversationHistory(role: 'user' | 'assistant', content: string): void {
    this.conversationHistory.push({ role, content });
    
    // Keep only the last 20 messages
    if (this.conversationHistory.length > 20) {
      this.conversationHistory = this.conversationHistory.slice(-20);
    }
    
    // If it's a user message, add it to the command history in contextService
    if (role === 'user') {
      contextService.addCommand(content);
    }
  }
  
  getConversationHistory(): { role: 'user' | 'assistant', content: string }[] {
    return [...this.conversationHistory];
  }
  
  getConversationContext(): string {
    const context = contextService.getFullContext();
    let contextDescription = '';
    
    if (context.currentSession.siteContext) {
      contextDescription += `Currently on: ${context.currentSession.siteContext}\n`;
    }
    
    if (context.recentTopics.length > 0) {
      contextDescription += `Recent topics: ${context.recentTopics.join(', ')}\n`;
    }
    
    if (Object.keys(context.extractedData).length > 0) {
      contextDescription += 'Has extracted data from: ';
      contextDescription += Object.keys(context.extractedData).join(', ');
    }
    
    return contextDescription.trim();
  }
  
  // Schedule a task to run periodically
  scheduleTask(name: string, description: string, cronExpression: string, command: string) {
    return schedulerService.createTask(name, description, cronExpression, command);
  }
  
  getScheduledTasks() {
    return schedulerService.getTasks();
  }
  
  // Enhanced method to execute a command with context awareness
  async executeCommand(command: string): Promise<{
    response: string;
    actions: BrowserAction[];
    newUrl?: string;
    extractedData?: ExtractedData[];
  }> {
    // Add the command to conversation history
    this.addToConversationHistory('user', command);
    
    // Set the browser to active state while processing
    this.isActive = true;
    
    // Get platform for cross-platform commands
    const platform = this.browserConfig.platform || 'unknown';
    
    // Check for context-aware commands
    let isContextualCommand = false;
    let contextualCommandResponse = '';
    
    // Check for pronouns that might reference previous context
    const hasContextualPronoun = /\b(it|this|that|these|those|there|this site|this page)\b/i.test(command);
    
    // Get the conversation context
    const context = contextService.getFullContext();
    
    // Try to resolve contextual command
    if (hasContextualPronoun && context.currentSession.siteContext) {
      const lastCommand = context.previousCommands[0];
      const currentSite = context.currentSession.siteContext;
      
      if (command.toLowerCase().includes('extract') && !command.toLowerCase().includes('from')) {
        // Add site context to extraction command
        command = `extract from ${currentSite} ${command.replace(/extract/i, '')}`;
        isContextualCommand = true;
        contextualCommandResponse = `Understanding that you want to extract data from ${currentSite}.`;
      } else if (command.toLowerCase().includes('click') && !command.toLowerCase().includes('on')) {
        // Assume the click is on the current site
        command = `click on ${currentSite} ${command.replace(/click/i, '')}`;
        isContextualCommand = true;
        contextualCommandResponse = `Understanding that you want to click on something at ${currentSite}.`;
      }
    }
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a response based on the command
    let response = '';
    let actions: BrowserAction[] = [];
    let newUrl = this.currentUrl;
    let extractedData: ExtractedData[] = [];
    
    // Add contextual information to response if applicable
    if (isContextualCommand) {
      response = contextualCommandResponse + ' ';
    }
    
    // Process the command with platform-specific adjustments
    const platformCommand = getPlatformSpecificCommand(command, platform);
    
    // Check for schedule/task commands
    if (command.toLowerCase().includes('schedule') || command.toLowerCase().includes('task')) {
      if (command.toLowerCase().includes('create') || command.toLowerCase().includes('add') || command.toLowerCase().includes('new')) {
        // Parse schedule details
        const nameMatch = command.match(/task named "([^"]+)"/i) || command.match(/task called "([^"]+)"/i);
        const taskName = nameMatch ? nameMatch[1] : 'Automated Task';
        
        const commandMatch = command.match(/to run "([^"]+)"/i) || command.match(/to execute "([^"]+)"/i);
        const taskCommand = commandMatch ? commandMatch[1] : 'search Google';
        
        const timeMatch = command.match(/every (\d+) (minutes|hours|days)/i);
        let cronExpression = '*/5 * * * *'; // Default: every 5 minutes
        
        if (timeMatch) {
          const interval = parseInt(timeMatch[1], 10);
          const unit = timeMatch[2].toLowerCase();
          
          if (unit === 'minutes') {
            cronExpression = `*/${interval} * * * *`;
          } else if (unit === 'hours') {
            cronExpression = `0 */${interval} * * *`;
          } else if (unit === 'days') {
            cronExpression = `0 0 */${interval} * *`;
          }
        }
        
        // Create the scheduled task
        const task = this.scheduleTask(
          taskName,
          `Scheduled task created from command: ${command}`,
          cronExpression,
          taskCommand
        );
        
        const configAction: BrowserAction = {
          id: this.generateId(),
          type: 'navigation',
          description: `Created scheduled task: ${taskName}`,
          status: 'completed',
          details: `Will run: ${taskCommand}`,
          timestamp: new Date()
        };
        
        actions = [configAction];
        response = `I've created a scheduled task named "${taskName}" that will run "${taskCommand}" ${timeMatch ? `every ${timeMatch[1]} ${timeMatch[2]}` : 'every 5 minutes'}.`;
        
        // Add topic to context
        contextService.addTopic('task scheduling');
      } else if (command.toLowerCase().includes('list') || command.toLowerCase().includes('show')) {
        const tasks = this.getScheduledTasks();
        
        const configAction: BrowserAction = {
          id: this.generateId(),
          type: 'navigation',
          description: 'Listed scheduled tasks',
          status: 'completed',
          timestamp: new Date()
        };
        
        actions = [configAction];
        
        if (tasks.length === 0) {
          response = "You don't have any scheduled tasks yet. You can create one by saying something like 'Create a task to search Google every 30 minutes'.";
        } else {
          response = `You have ${tasks.length} scheduled tasks:\n`;
          tasks.forEach((task, index) => {
            response += `${index + 1}. "${task.name}" - Runs: ${task.command} (${task.isActive ? 'Active' : 'Inactive'})\n`;
          });
        }
        
        // Add topic to context
        contextService.addTopic('task management');
      }
    }
    // Check for configuration commands
    else if (command.toLowerCase().includes('proxy') && command.toLowerCase().includes('set')) {
      const proxyMatch = command.match(/set proxy to (.*?)$/i);
      const proxyAddress = proxyMatch ? proxyMatch[1] : '127.0.0.1:8080';
      
      this.setBrowserConfig({ ...this.browserConfig, proxy: proxyAddress });
      
      const configAction: BrowserAction = {
        id: this.generateId(),
        type: 'navigation',
        description: `Set proxy to ${proxyAddress}`,
        status: 'completed',
        timestamp: new Date()
      };
      
      actions = [configAction];
      response = `Proxy has been configured to use ${proxyAddress} on ${platform} platform`;
      
      // Add topic to context
      contextService.addTopic('proxy configuration');
    }
    // Check for extension commands
    else if (command.toLowerCase().includes('extension') && 
            (command.toLowerCase().includes('add') || command.toLowerCase().includes('install'))) {
      const extensionMatch = command.match(/(add|install) (the |an |)extension (called |named |)"?(.*?)"?$/i);
      const extensionName = extensionMatch ? extensionMatch[4] : 'Ad Blocker';
      
      const extensions = this.browserConfig.extensions || [];
      this.setBrowserConfig({ 
        ...this.browserConfig, 
        extensions: [...extensions, extensionName] 
      });
      
      const configAction: BrowserAction = {
        id: this.generateId(),
        type: 'navigation',
        description: `Install extension: ${extensionName}`,
        status: 'completed',
        details: `Platform: ${platform}`,
        timestamp: new Date()
      };
      
      actions = [configAction];
      response = `Extension "${extensionName}" has been installed on your ${platform} browser`;
      
      // Add topic to context
      contextService.addTopic('browser extensions');
    }
    // Parse the command and generate mock actions for google flows
    else if (command.toLowerCase().includes('google')) {
      // Add topic to context
      contextService.addTopic('google search');
      
      if (command.toLowerCase().includes('search')) {
        // Extract search query from command
        const searchTermMatch = command.match(/search for (.*?)( on Google)?$/i);
        const searchTerm = searchTermMatch ? searchTermMatch[1] : 'AI browser automation';
        
        // Navigate to Google
        const navigationAction: BrowserAction = {
          id: this.generateId(),
          type: 'navigation',
          description: 'Navigate to Google',
          status: 'completed',
          details: 'https://www.google.com',
          timestamp: new Date()
        };
        
        // Input search term
        const inputAction: BrowserAction = {
          id: this.generateId(),
          type: 'input',
          description: `Type search query: "${searchTerm}"`,
          status: 'completed',
          timestamp: new Date()
        };
        
        // Submit search
        const clickAction: BrowserAction = {
          id: this.generateId(),
          type: 'click',
          description: 'Click "Google Search" button',
          status: 'completed',
          timestamp: new Date()
        };
        
        // Extract search results
        const extractAction: BrowserAction = {
          id: this.generateId(),
          type: 'extract',
          description: 'Extract search results',
          status: 'completed',
          timestamp: new Date()
        };
        
        // Mock extracted data
        extractedData = [
          {
            type: 'json',
            content: [
              { 
                title: 'Browser Automation with AI - Latest Guide 2024',
                url: 'https://example.com/browser-automation-ai',
                snippet: 'Learn how to automate browsers using AI and modern frameworks...'
              },
              {
                title: 'Top 10 AI Browser Automation Tools',
                url: 'https://example.com/top-automation-tools',
                snippet: 'Compare the most popular browser automation solutions...'
              },
              {
                title: `Results for "${searchTerm}" - Developer Resources`,
                url: 'https://dev.example.com/resources',
                snippet: 'Find tutorials, guides, and documentation for AI-driven automation...'
              }
            ],
            source: `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`
          }
        ];
        
        this.extractedData = [...this.extractedData, ...extractedData];
        
        // Store the extracted data in context service
        contextService.addExtractedData('googleSearch', extractedData[0].content);
        
        // Update site context
        contextService.updateCurrentSite(`https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`);
        
        actions = [navigationAction, inputAction, clickAction, extractAction];
        newUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
        response = `I've searched Google for "${searchTerm}" and extracted the top 3 results.`;
      } else {
        // Just navigate to Google
        const navigationAction: BrowserAction = {
          id: this.generateId(),
          type: 'navigation',
          description: 'Navigate to Google',
          status: 'completed',
          details: 'https://www.google.com',
          timestamp: new Date()
        };
        
        // Update site context
        contextService.updateCurrentSite('https://www.google.com');
        
        actions = [navigationAction];
        newUrl = 'https://www.google.com';
        response = "I've navigated to Google's homepage. What would you like to search for?";
      }
    } else if (command.toLowerCase().includes('login') || command.toLowerCase().includes('log in')) {
      // Add topic to context
      contextService.addTopic('account login');
      
      // Check if command mentions specific sites
      let site = '';
      if (command.toLowerCase().includes('gmail')) site = 'Gmail';
      else if (command.toLowerCase().includes('facebook')) site = 'Facebook';
      else if (command.toLowerCase().includes('twitter')) site = 'Twitter';
      else if (command.toLowerCase().includes('github')) site = 'GitHub';
      else site = 'the website';
      
      const navigationAction: BrowserAction = {
        id: this.generateId(),
        type: 'navigation',
        description: `Navigate to ${site} login page`,
        status: 'completed',
        details: `https://${site.toLowerCase()}.com`,
        timestamp: new Date()
      };
      
      const inputAction1: BrowserAction = {
        id: this.generateId(),
        type: 'input',
        description: 'Enter username/email',
        status: 'completed',
        details: 'Credentials masked for security',
        timestamp: new Date()
      };
      
      const inputAction2: BrowserAction = {
        id: this.generateId(),
        type: 'input',
        description: 'Enter password',
        status: 'completed',
        details: 'Credentials masked for security',
        timestamp: new Date()
      };
      
      const clickAction: BrowserAction = {
        id: this.generateId(),
        type: 'click',
        description: 'Click "Sign In" button',
        status: 'completed',
        timestamp: new Date()
      };
      
      // Extract user profile data after login
      const extractAction: BrowserAction = {
        id: this.generateId(),
        type: 'extract',
        description: 'Extract user profile data',
        status: 'completed',
        timestamp: new Date()
      };
      
      // Mock extracted data for profile
      extractedData = [
        {
          type: 'json',
          content: {
            username: 'demo_user',
            email: 'demo@example.com',
            accountType: 'Premium',
            lastLogin: new Date().toISOString()
          },
          source: `https://${site.toLowerCase()}.com/profile`
        }
      ];
      
      this.extractedData = [...this.extractedData, ...extractedData];
      
      // Store the extracted data in context service
      contextService.addExtractedData(site.toLowerCase() + 'Profile', extractedData[0].content);
      
      // Update site context
      contextService.updateCurrentSite(`https://${site.toLowerCase()}.com/dashboard`);
      
      actions = [navigationAction, inputAction1, inputAction2, clickAction, extractAction];
      newUrl = `https://${site.toLowerCase()}.com/dashboard`;
      response = `I've logged into ${site} successfully. Extracted profile information includes username, email, and account type.`;
    } else if (command.toLowerCase().includes('extract') && command.toLowerCase().includes('data')) {
      // Add topic to context
      contextService.addTopic('data extraction');
      
      // Generic data extraction command
      let target = 'current page';
      let dataType = 'text';
      
      if (command.toLowerCase().includes('table')) {
        dataType = 'table';
      } else if (command.toLowerCase().includes('json')) {
        dataType = 'json';
      } else if (command.toLowerCase().includes('link')) {
        dataType = 'link';
      }
      
      const extractAction: BrowserAction = {
        id: this.generateId(),
        type: 'extract',
        description: `Extract ${dataType} data from ${target}`,
        status: 'completed',
        timestamp: new Date()
      };
      
      // Mock extracted data based on the current URL
      if (this.currentUrl.includes('google.com')) {
        extractedData = [
          {
            type: dataType === 'table' ? 'table' : 'json',
            content: dataType === 'table' 
              ? [['Rank', 'Title', 'URL'], 
                 ['1', 'First Result', 'https://example.com/1'],
                 ['2', 'Second Result', 'https://example.com/2']]
              : [
                  { title: 'First Search Result', url: 'https://example.com/1' },
                  { title: 'Second Search Result', url: 'https://example.com/2' }
                ],
            source: this.currentUrl
          }
        ];
      } else {
        // Generic extracted data
        extractedData = [
          {
            type: dataType === 'table' ? 'table' : 'json',
            content: dataType === 'table'
              ? [['Header 1', 'Header 2'], ['Value 1', 'Value 2']]
              : { pageTitle: 'Sample Page', url: this.currentUrl, mainContent: 'This is example text from the page.' },
            source: this.currentUrl
          }
        ];
      }
      
      this.extractedData = [...this.extractedData, ...extractedData];
      
      // Store the extracted data in context service
      contextService.addExtractedData('latestExtraction', extractedData[0].content);
      
      actions = [extractAction];
      response = `I've extracted ${dataType} data from the current page at ${this.currentUrl}.`;
    } else if (command.toLowerCase().includes('weather')) {
      // Add topic to context
      contextService.addTopic('weather');
      
      const navigationAction: BrowserAction = {
        id: this.generateId(),
        type: 'navigation',
        description: 'Navigate to weather service',
        status: 'completed',
        details: 'https://weather.com',
        timestamp: new Date()
      };
      
      const extractAction: BrowserAction = {
        id: this.generateId(),
        type: 'extract',
        description: 'Extract current weather data',
        status: 'completed',
        timestamp: new Date()
      };
      
      // Mock extracted weather data
      extractedData = [
        {
          type: 'json',
          content: {
            location: 'San Francisco, CA',
            temperature: '72°F',
            condition: 'Sunny',
            forecast: [
              { day: 'Today', high: '74°F', low: '58°F', condition: 'Sunny' },
              { day: 'Tomorrow', high: '68°F', low: '55°F', condition: 'Partly Cloudy' }
            ]
          },
          source: 'https://weather.com/san-francisco'
        }
      ];
      
      this.extractedData = [...this.extractedData, ...extractedData];
      
      // Store the extracted data in context service
      contextService.addExtractedData('weather', extractedData[0].content);
      
      // Update site context
      contextService.updateCurrentSite('https://weather.com');
      
      actions = [navigationAction, extractAction];
      newUrl = 'https://weather.com';
      response = "I checked the weather. It's currently 72°F and sunny in San Francisco. Tomorrow will be partly cloudy with a high of 68°F.";
    } else if (command.toLowerCase().includes('previous') && command.toLowerCase().includes('results')) {
      // Request for previous data
      const contextData = contextService.getExtractedData();
      const dataKeys = Object.keys(contextData);
      
      if (dataKeys.length === 0) {
        response = "I don't have any previously extracted data to show you.";
      } else {
        // Find relevant data based on command context
        let dataKey = 'latestExtraction';
        
        if (command.toLowerCase().includes('weather')) {
          dataKey = 'weather';
        } else if (command.toLowerCase().includes('search') || command.toLowerCase().includes('google')) {
          dataKey = 'googleSearch';
        } else if (dataKeys.includes('latestExtraction')) {
          dataKey = 'latestExtraction';
        } else {
          dataKey = dataKeys[0]; // Just use the first available data
        }
        
        const data = contextData[dataKey];
        
        const extractAction: BrowserAction = {
          id: this.generateId(),
          type: 'extract',
          description: 'Retrieve previously extracted data',
          status: 'completed',
          timestamp: new Date()
        };
        
        actions = [extractAction];
        
        // Format the data for display
        extractedData = [
          {
            type: Array.isArray(data) ? 'json' : typeof data === 'object' ? 'json' : 'text',
            content: data,
            source: 'context storage'
          }
        ];
        
        response = `I've retrieved your previous results for ${dataKey}:`;
      }
    } else {
      // Context-aware generic fallback for other commands
      const conversationContext = this.getConversationContext();
      
      const action: BrowserAction = {
        id: this.generateId(),
        type: 'navigation',
        description: 'Process command: ' + command,
        status: 'completed',
        timestamp: new Date()
      };
      
      actions = [action];
      
      if (conversationContext) {
        response = `I've processed your command. Based on our conversation context: ${conversationContext}. Is there anything specific you'd like me to do in the browser?`;
      } else {
        response = "I've processed your command. Is there anything specific you'd like me to do in the browser?";
      }
    }
    
    // Add the response to conversation history
    this.addToConversationHistory('assistant', response);
    
    // Update service state
    this.actionHistory = [...this.actionHistory, ...actions];
    this.currentUrl = newUrl;
    this.isActive = false;
    
    return { response, actions, newUrl, extractedData };
  }
  
  getCurrentUrl(): string {
    return this.currentUrl;
  }
  
  getActionHistory(): BrowserAction[] {
    return this.actionHistory;
  }
  
  getExtractedData(): ExtractedData[] {
    return this.extractedData;
  }
  
  isActivelyProcessing(): boolean {
    return this.isActive;
  }
  
  private generateId(): string {
    return Math.random().toString(36).substring(2, 11);
  }
}

export default new BrowserService();
