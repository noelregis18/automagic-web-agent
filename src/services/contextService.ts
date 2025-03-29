export type ConversationContext = {
  recentTopics: string[];
  previousCommands: string[];
  extractedData: Record<string, any>;
  currentSession: {
    startTime: Date;
    browserId: string;
    siteContext: string | null;
  };
  userPreferences: {
    defaultSearchEngine: string;
    favoriteWebsites: string[];
  };
};

class ContextService {
  private context: ConversationContext;
  private readonly MAX_HISTORY = 10;
  
  constructor() {
    // Initialize with default values or load from localStorage
    const savedContext = localStorage.getItem('conversationContext');
    if (savedContext) {
      try {
        const parsedContext = JSON.parse(savedContext);
        // Convert string dates back to Date objects
        parsedContext.currentSession.startTime = new Date(parsedContext.currentSession.startTime);
        this.context = parsedContext;
      } catch (error) {
        console.error('Failed to parse saved context:', error);
        this.initializeDefaultContext();
      }
    } else {
      this.initializeDefaultContext();
    }
  }
  
  private initializeDefaultContext(): void {
    this.context = {
      recentTopics: [],
      previousCommands: [],
      extractedData: {},
      currentSession: {
        startTime: new Date(),
        browserId: this.generateId(),
        siteContext: null
      },
      userPreferences: {
        defaultSearchEngine: 'google',
        favoriteWebsites: []
      }
    };
  }
  
  private saveContext(): void {
    try {
      localStorage.setItem('conversationContext', JSON.stringify(this.context));
    } catch (error) {
      console.error('Failed to save context:', error);
    }
  }
  
  getFullContext(): ConversationContext {
    return { ...this.context };
  }
  
  addCommand(command: string): void {
    this.context.previousCommands.unshift(command);
    
    // Keep only the most recent commands
    if (this.context.previousCommands.length > this.MAX_HISTORY) {
      this.context.previousCommands.pop();
    }
    
    this.saveContext();
  }
  
  updateCurrentSite(siteUrl: string | null): void {
    this.context.currentSession.siteContext = siteUrl;
    this.saveContext();
  }
  
  addExtractedData(key: string, data: any): void {
    this.context.extractedData[key] = data;
    this.saveContext();
  }
  
  getExtractedData(key?: string): any {
    if (key) {
      return this.context.extractedData[key];
    }
    return this.context.extractedData;
  }
  
  addTopic(topic: string): void {
    // Don't add duplicate topics
    if (!this.context.recentTopics.includes(topic)) {
      this.context.recentTopics.unshift(topic);
      
      // Keep only the most recent topics
      if (this.context.recentTopics.length > this.MAX_HISTORY) {
        this.context.recentTopics.pop();
      }
      
      this.saveContext();
    }
  }
  
  updateUserPreference<K extends keyof ConversationContext['userPreferences']>(
    key: K, 
    value: ConversationContext['userPreferences'][K]
  ): void {
    this.context.userPreferences[key] = value;
    this.saveContext();
  }
  
  addFavoriteWebsite(url: string): void {
    if (!this.context.userPreferences.favoriteWebsites.includes(url)) {
      this.context.userPreferences.favoriteWebsites.push(url);
      this.saveContext();
    }
  }
  
  removeFavoriteWebsite(url: string): void {
    this.context.userPreferences.favoriteWebsites = 
      this.context.userPreferences.favoriteWebsites.filter(site => site !== url);
    this.saveContext();
  }
  
  resetSession(): void {
    this.context.currentSession = {
      startTime: new Date(),
      browserId: this.generateId(),
      siteContext: null
    };
    this.saveContext();
  }
  
  clearAllContext(): void {
    this.initializeDefaultContext();
    this.saveContext();
  }
  
  private generateId(): string {
    return Math.random().toString(36).substring(2, 11);
  }
}

export default new ContextService();
