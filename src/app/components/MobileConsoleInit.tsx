'use client';

import { useEffect } from 'react';
import { initMobileConsole } from '@/utils/mobileConsole';

export default function MobileConsoleInit() {
  useEffect(() => {
    initMobileConsole();
  }, []);

  return null;
}