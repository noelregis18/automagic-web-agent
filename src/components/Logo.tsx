
import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-agent-primary rounded-lg flex items-center justify-center">
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 6C13.93 6 15.5 7.57 15.5 9.5C15.5 11.43 13.93 13 12 13C10.07 13 8.5 11.43 8.5 9.5C8.5 7.57 10.07 6 12 6ZM12 20C9.97 20 8.1 19.33 6.66 18.12C6.25 17.8 6 17.3 6 16.76V16.46C6 14.56 7.56 13 9.46 13H14.54C16.44 13 18 14.56 18 16.46V16.76C18 17.3 17.75 17.8 17.34 18.12C15.9 19.33 14.03 20 12 20Z" 
            fill="white"
          />
        </svg>
      </div>
      <span className="text-xl font-bold bg-gradient-to-r from-agent-primary to-agent-light bg-clip-text text-transparent">
        BrowserAgent
      </span>
    </div>
  );
};

export default Logo;
