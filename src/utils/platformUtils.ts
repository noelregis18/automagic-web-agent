
/**
 * Utility functions for cross-platform compatibility
 */

export type Platform = 'windows' | 'macos' | 'linux' | 'unknown';

export const detectPlatform = (): Platform => {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (userAgent.includes('win')) {
    return 'windows';
  } else if (userAgent.includes('mac')) {
    return 'macos';
  } else if (userAgent.includes('linux') || userAgent.includes('x11')) {
    return 'linux';
  }
  
  return 'unknown';
};

export const getPlatformSpecificCommand = (
  command: string,
  platform: Platform
): string => {
  // Normalize commands based on platform
  // This would be more extensive in a real implementation
  const normalizedCommand = command.toLowerCase();
  
  if (normalizedCommand.includes('open browser')) {
    switch (platform) {
      case 'windows':
        return 'start chrome';
      case 'macos':
        return 'open -a "Google Chrome"';
      case 'linux':
        return 'google-chrome';
      default:
        return command;
    }
  }
  
  return command;
};

export const getDefaultBrowserPath = (platform: Platform): string => {
  switch (platform) {
    case 'windows':
      return 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    case 'macos':
      return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    case 'linux':
      return '/usr/bin/google-chrome';
    default:
      return '';
  }
};

export const isProxySupported = (platform: Platform): boolean => {
  // All major platforms support proxy configuration
  return platform !== 'unknown';
};

export const isExtensionSupported = (platform: Platform): boolean => {
  // All major platforms support browser extensions
  return platform !== 'unknown';
};
