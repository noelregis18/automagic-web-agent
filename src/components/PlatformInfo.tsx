
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { detectPlatform } from '@/utils/platformUtils';
import { Icons } from '@/components/ui/icons';
import browserService from '@/services/browserService';

const PlatformInfo = () => {
  const platform = detectPlatform();
  const browserConfig = browserService.getBrowserConfig();
  
  return (
    <div className="flex items-center space-x-2 mb-4">
      <Badge variant="outline" className="bg-gray-800 text-gray-300">
        {platform === 'windows' && (
          <>
            <Icons.windows className="h-3 w-3 mr-1" />
            Windows
          </>
        )}
        {platform === 'macos' && (
          <>
            <Icons.apple className="h-3 w-3 mr-1" />
            macOS
          </>
        )}
        {platform === 'linux' && (
          <>
            <Icons.linux className="h-3 w-3 mr-1" />
            Linux
          </>
        )}
        {platform === 'unknown' && (
          <>
            <Icons.monitor className="h-3 w-3 mr-1" />
            Unknown
          </>
        )}
      </Badge>
      
      {browserConfig.proxy && (
        <Badge variant="outline" className="bg-gray-800 text-gray-300">
          Proxy: {browserConfig.proxy}
        </Badge>
      )}
      
      {browserConfig.extensions && browserConfig.extensions.length > 0 && (
        <Badge variant="outline" className="bg-gray-800 text-gray-300">
          Extensions: {browserConfig.extensions.length}
        </Badge>
      )}
    </div>
  );
};

export default PlatformInfo;
