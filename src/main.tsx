import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Force HTTPS in production to prevent HTTP POST downgrades (302) and fix WebRTC secure context requirements
// Only redirect in top-level browser window, not in sandboxed preview iframes
try {
  if (
    typeof window !== 'undefined' &&
    window.self === window.top &&
    window.location.protocol === 'http:' &&
    window.location.hostname !== 'localhost' &&
    !window.location.hostname.endsWith('.run.app')
  ) {
    window.location.href = window.location.href.replace('http:', 'https:');
  }
} catch {
  // Ignore cross-origin frame or navigation restrictions in iframes
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
