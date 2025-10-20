import type { Metadata, Viewport } from "next"
import "./globals.css"
import Providers from "./providers"
import MobileConsoleInit from "./components/MobileConsoleInit"

export const metadata: Metadata = {
  title: "Workout Tracker Pro",
  description: "Track your progress and achieve your fitness goals",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <MobileConsoleInit />
      </body>
    </html>
  )
}

