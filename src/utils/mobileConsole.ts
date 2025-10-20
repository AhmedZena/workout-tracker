// Initialize eruda for mobile debugging
let erudaInitialized = false;

export const initMobileConsole = () => {
  if (typeof window !== 'undefined' && !erudaInitialized) {
    // Only initialize eruda in production and on mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    
    if (isMobile) {
      // Dynamically import eruda only on client side
      import('eruda').then((eruda) => {
        eruda.default.init();
        erudaInitialized = true;
      }).catch((error) => {
        console.warn('Failed to load eruda:', error);
      });
    }
  }
};

// Mobile-friendly console wrapper
export const mobileConsole = {
  log: (...args: unknown[]) => {
    if (typeof window !== 'undefined') {
      // Use eruda if available, otherwise fall back to console
      if (erudaInitialized && (window as unknown as { eruda?: { get: (name: string) => { log: (...args: unknown[]) => void } } }).eruda) {
        try {
          (window as unknown as { eruda: { get: (name: string) => { log: (...args: unknown[]) => void } } }).eruda.get('console').log(...args);
        } catch {
          console.log(...args);
        }
      } else {
        console.log(...args);
      }
    } else {
      // Server-side fallback
      console.log(...args);
    }
  },
  
  error: (...args: unknown[]) => {
    if (typeof window !== 'undefined') {
      if (erudaInitialized && (window as unknown as { eruda?: { get: (name: string) => { error: (...args: unknown[]) => void } } }).eruda) {
        try {
          (window as unknown as { eruda: { get: (name: string) => { error: (...args: unknown[]) => void } } }).eruda.get('console').error(...args);
        } catch {
          console.error(...args);
        }
      } else {
        console.error(...args);
      }
    } else {
      // Server-side fallback
      console.error(...args);
    }
  },
  
  warn: (...args: unknown[]) => {
    if (typeof window !== 'undefined') {
      if (erudaInitialized && (window as unknown as { eruda?: { get: (name: string) => { warn: (...args: unknown[]) => void } } }).eruda) {
        try {
          (window as unknown as { eruda: { get: (name: string) => { warn: (...args: unknown[]) => void } } }).eruda.get('console').warn(...args);
        } catch {
          console.warn(...args);
        }
      } else {
        console.warn(...args);
      }
    } else {
      // Server-side fallback
      console.warn(...args);
    }
  },
  
  info: (...args: unknown[]) => {
    if (typeof window !== 'undefined') {
      if (erudaInitialized && (window as unknown as { eruda?: { get: (name: string) => { info: (...args: unknown[]) => void } } }).eruda) {
        try {
          (window as unknown as { eruda: { get: (name: string) => { info: (...args: unknown[]) => void } } }).eruda.get('console').info(...args);
        } catch {
          console.info(...args);
        }
      } else {
        console.info(...args);
      }
    } else {
      // Server-side fallback
      console.info(...args);
    }
  }
};