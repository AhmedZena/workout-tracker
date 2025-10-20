'use client';

import { useEffect } from 'react';

interface MobileConsoleProps {
  enabled?: boolean;
  theme?: 'light' | 'dark';
  position?: 'top' | 'bottom';
}

export default function MobileConsole({ 
  enabled = true, 
  theme = 'light',
  position = 'bottom' 
}: MobileConsoleProps) {
  useEffect(() => {
    // Only load vconsole in development or when explicitly enabled
    if (!enabled || typeof window === 'undefined') return;

    // Check if we're on a mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    // Only load vconsole on mobile devices or when forced
    if (!isMobile && process.env.NODE_ENV === 'production') return;

    // Dynamically import vconsole to avoid SSR issues
    import('vconsole').then((VConsole) => {
      // Check if vconsole is already initialized
      if (window.vConsole) return;

      // Initialize vconsole
      window.vConsole = new VConsole.default({
        theme,
        defaultPlugins: ['system', 'network', 'element', 'storage'],
        maxLogNumber: 1000,
        onReady: () => {
          console.log('Mobile Console initialized');
        },
        onClearLog: () => {
          console.log('Mobile Console cleared');
        }
      });

      // Position the console
      const vConsoleEl = document.querySelector('#__vconsole');
      if (vConsoleEl) {
        vConsoleEl.style.position = 'fixed';
        vConsoleEl.style[position] = '0';
        vConsoleEl.style.left = '0';
        vConsoleEl.style.right = '0';
        vConsoleEl.style.zIndex = '9999';
      }
    }).catch((error) => {
      console.error('Failed to load vconsole:', error);
    });

    // Cleanup function
    return () => {
      if (window.vConsole) {
        window.vConsole.destroy();
        window.vConsole = null;
      }
    };
  }, [enabled, theme, position]);

  return null; // This component doesn't render anything
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    vConsole: any;
  }
}