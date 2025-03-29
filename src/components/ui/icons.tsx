
import {
  LucideProps,
  Monitor,
  Moon,
  SunMedium,
  Laptop,
  Github,
  Twitter,
  Check,
  X,
  AlertTriangle
} from "lucide-react";

// Custom icons for platforms
const Windows = (props: LucideProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 5.1L10.5 4v7H3V5.1z" />
    <path d="M11.5 4L21 2.7v8.3h-9.5V4z" />
    <path d="M21 12l-.1 8.3-9.4-1.3v-7h9.5z" />
    <path d="M10.5 19l-7.5.9v-7h7.5v6.1z" />
  </svg>
);

const Apple = (props: LucideProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 5c-2.457 0-4.5 2.043-4.5 4.5 0 4.5 3 5.5 3 9.5h3c0-4-3-5-3-9.5C10.5 7.043 12.457 5 15 5s4.5 2.043 4.5 4.5c0 .5-.5 2-1.5 2"></path>
    <path d="M12 2v3"></path>
  </svg>
);

const Linux = (props: LucideProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path>
    <circle cx="9" cy="8" r="1"></circle>
    <circle cx="15" cy="8" r="1"></circle>
    <path d="M18 11.5c-.5-1-1.5-2-3-2"></path>
    <path d="M9 9.5c-1.5 0-2.5 1-3 2"></path>
    <path d="M9 14c-3 0-4 2-4 3 0 .5 2 1 2 1"></path>
    <path d="M15 14c3 0 4 2 4 3 0 .5-2 1-2 1"></path>
    <path d="M9 19h6"></path>
  </svg>
);

export const Icons = {
  monitor: Monitor,
  windows: Windows,
  apple: Apple,
  linux: Linux,
  moon: Moon,
  sun: SunMedium,
  laptop: Laptop,
  twitter: Twitter,
  github: Github,
  check: Check,
  close: X,
  warning: AlertTriangle
};
