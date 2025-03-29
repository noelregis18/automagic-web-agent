
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import browserService, { BrowserConfig } from '@/services/browserService';

const BrowserSettings = () => {
  const [proxy, setProxy] = useState('');
  const [extension, setExtension] = useState('');
  const [installedExtensions, setInstalledExtensions] = useState<string[]>([]);
  const [userAgent, setUserAgent] = useState('');
  
  useEffect(() => {
    // Load current browser configuration
    const config = browserService.getBrowserConfig();
    if (config.proxy) {
      setProxy(config.proxy);
    }
    if (config.extensions) {
      setInstalledExtensions(config.extensions);
    }
    if (config.userAgent) {
      setUserAgent(config.userAgent);
    }
  }, []);
  
  const handleSaveProxy = () => {
    const config: BrowserConfig = browserService.getBrowserConfig();
    browserService.setBrowserConfig({
      ...config,
      proxy
    });
  };
  
  const handleAddExtension = () => {
    if (extension.trim()) {
      const updatedExtensions = [...installedExtensions, extension];
      setInstalledExtensions(updatedExtensions);
      
      const config: BrowserConfig = browserService.getBrowserConfig();
      browserService.setBrowserConfig({
        ...config,
        extensions: updatedExtensions
      });
      
      setExtension('');
    }
  };
  
  const handleRemoveExtension = (extensionToRemove: string) => {
    const updatedExtensions = installedExtensions.filter(ext => ext !== extensionToRemove);
    setInstalledExtensions(updatedExtensions);
    
    const config: BrowserConfig = browserService.getBrowserConfig();
    browserService.setBrowserConfig({
      ...config,
      extensions: updatedExtensions
    });
  };
  
  const handleSaveUserAgent = () => {
    const config: BrowserConfig = browserService.getBrowserConfig();
    browserService.setBrowserConfig({
      ...config,
      userAgent
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="proxy">Proxy Configuration</Label>
        <div className="flex space-x-2">
          <Input
            id="proxy"
            placeholder="host:port (e.g., 127.0.0.1:8080)"
            value={proxy}
            onChange={(e) => setProxy(e.target.value)}
            className="bg-gray-800 border-gray-700"
          />
          <Button onClick={handleSaveProxy}>Save</Button>
        </div>
        <p className="text-xs text-gray-500">
          Enter your proxy address in the format host:port
        </p>
      </div>

      <Separator className="bg-gray-800" />
      
      <div className="space-y-2">
        <Label htmlFor="extension">Browser Extensions</Label>
        <div className="flex space-x-2">
          <Input
            id="extension"
            placeholder="Extension name"
            value={extension}
            onChange={(e) => setExtension(e.target.value)}
            className="bg-gray-800 border-gray-700"
          />
          <Button onClick={handleAddExtension}>
            <PlusCircle className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
        
        <div className="mt-3 flex flex-wrap gap-2">
          {installedExtensions.map((ext, index) => (
            <Badge key={index} variant="secondary" className="px-2 py-1">
              {ext}
              <X
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={() => handleRemoveExtension(ext)}
              />
            </Badge>
          ))}
          {installedExtensions.length === 0 && (
            <p className="text-xs text-gray-500">No extensions installed</p>
          )}
        </div>
      </div>
      
      <Separator className="bg-gray-800" />
      
      <div className="space-y-2">
        <Label htmlFor="userAgent">User Agent</Label>
        <div className="flex space-x-2">
          <Input
            id="userAgent"
            placeholder="Custom user agent string"
            value={userAgent}
            onChange={(e) => setUserAgent(e.target.value)}
            className="bg-gray-800 border-gray-700"
          />
          <Button onClick={handleSaveUserAgent}>Save</Button>
        </div>
      </div>
    </div>
  );
};

export default BrowserSettings;
