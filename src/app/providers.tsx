'use client'

import { SessionProvider } from "next-auth/react"
import MobileConsole from "@/components/MobileConsole"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <MobileConsole 
        enabled={process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_MOBILE_CONSOLE === 'true'}
        theme="light"
        position="bottom"
      />
    </SessionProvider>
  )
}

