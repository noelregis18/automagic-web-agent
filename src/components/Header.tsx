
import React from 'react';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import { Settings, HelpCircle } from 'lucide-react';

const Header = () => {
  return (
    <header className="border-b border-gray-800 py-3 px-4">
      <div className="container mx-auto flex justify-between items-center">
        <Logo />
        
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-5 w-5 text-gray-400" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5 text-gray-400" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
