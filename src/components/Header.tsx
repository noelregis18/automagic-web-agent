
import React, { useState } from 'react';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import { Settings, HelpCircle } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import BrowserSettings from './BrowserSettings';

const Header = () => {
  return (
    <header className="border-b border-gray-800 py-3 px-4">
      <div className="container mx-auto flex justify-between items-center">
        <Logo />
        
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-5 w-5 text-gray-400" />
          </Button>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5 text-gray-400" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-gray-900 border-gray-800">
              <SheetHeader>
                <SheetTitle className="text-white">Browser Settings</SheetTitle>
                <SheetDescription className="text-gray-400">
                  Configure proxy and browser extensions
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <BrowserSettings />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
