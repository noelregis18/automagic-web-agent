
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Cpu, Network, Shield, Clock } from 'lucide-react';

interface StatusBarProps {
  status: 'idle' | 'connecting' | 'active' | 'error';
  lastAction: string;
  uptime: string;
}

const StatusBar: React.FC<StatusBarProps> = ({ status, lastAction, uptime }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'active': return 'bg-green-600 text-white';
      case 'connecting': return 'bg-yellow-600 text-white';
      case 'error': return 'bg-red-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="bg-gray-900 border-t border-gray-800 px-4 py-2 text-xs text-gray-400 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <Cpu className="h-3.5 w-3.5" />
          <span>Status:</span>
          <Badge variant="outline" className={getStatusColor()}>
            {status.toUpperCase()}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-1">
          <Clock className="h-3.5 w-3.5" />
          <span>Uptime: {uptime}</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <Network className="h-3.5 w-3.5" />
          <span>Last action: {lastAction}</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Shield className="h-3.5 w-3.5" />
          <span>Secure Connection</span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
