
// This is a mock service to simulate browser automation 
// In a real implementation, this would use Playwright, Puppeteer, or custom browser APIs

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
};

class BrowserService {
  private actionHistory: BrowserAction[] = [];
  private currentUrl: string = 'about:blank';
  private isActive: boolean = false;
  private extractedData: ExtractedData[] = [];
  private browserConfig: BrowserConfig = {};
  
  // Configure browser settings
  setBrowserConfig(config: BrowserConfig): void {
    this.browserConfig = { ...this.browserConfig, ...config };
    console.log('Browser configuration updated:', this.browserConfig);
  }
  
  getBrowserConfig(): BrowserConfig {
    return this.browserConfig;
  }
  
  // Mock method to simulate browser automation
  async executeCommand(command: string): Promise<{
    response: string;
    actions: BrowserAction[];
    newUrl?: string;
    extractedData?: ExtractedData[];
  }> {
    // Set the browser to active state while processing
    this.isActive = true;
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate a response based on the command
    let response = '';
    let actions: BrowserAction[] = [];
    let newUrl = this.currentUrl;
    let extractedData: ExtractedData[] = [];
    
    // Check for configuration commands
    if (command.toLowerCase().includes('proxy') && command.toLowerCase().includes('set')) {
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
      response = `Proxy has been configured to use ${proxyAddress}`;
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
        timestamp: new Date()
      };
      
      actions = [configAction];
      response = `Extension "${extensionName}" has been installed`;
    }
    // Parse the command and generate mock actions for google flows
    else if (command.toLowerCase().includes('google')) {
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
        
        actions = [navigationAction];
        newUrl = 'https://www.google.com';
        response = "I've navigated to Google's homepage. What would you like to search for?";
      }
    } else if (command.toLowerCase().includes('login') || command.toLowerCase().includes('log in')) {
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
      
      actions = [navigationAction, inputAction1, inputAction2, clickAction, extractAction];
      newUrl = `https://${site.toLowerCase()}.com/dashboard`;
      response = `I've logged into ${site} successfully. Extracted profile information includes username, email, and account type.`;
    } else if (command.toLowerCase().includes('extract') && command.toLowerCase().includes('data')) {
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
      
      actions = [extractAction];
      response = `I've extracted ${dataType} data from the current page at ${this.currentUrl}.`;
    } else if (command.toLowerCase().includes('weather')) {
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
      
      actions = [navigationAction, extractAction];
      newUrl = 'https://weather.com';
      response = "I checked the weather. It's currently 72°F and sunny in San Francisco. Tomorrow will be partly cloudy with a high of 68°F.";
    } else {
      // Generic fallback for other commands
      const action: BrowserAction = {
        id: this.generateId(),
        type: 'navigation',
        description: 'Process command: ' + command,
        status: 'completed',
        timestamp: new Date()
      };
      
      actions = [action];
      response = "I've processed your command. Is there anything specific you'd like me to do in the browser?";
    }
    
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
