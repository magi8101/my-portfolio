import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, Playfair_Display, IBM_Plex_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { VisitorTracker } from "@/components/visitor-tracker"
import { BackToTop } from "@/components/back-to-top"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-sans" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" })
const ibmPlexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" })

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://magi-portfolio.vercel.app"
  ),
  title: {
    default: "Magi Sharma — Developer",
    template: "%s | Magi Sharma",
  },
  description: "Building compilers, systems, and open-source tools.",
  generator: 'my-portfolio',
  authors: [{ name: "Magi Sharma", url: "https://github.com/magi8101" }],
  creator: "Magi Sharma",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Magi Sharma",
    title: "Magi Sharma — Developer",
    description: "Building compilers, systems, and open-source tools.",
    images: [
      {
        url: "https://magi-portfolio.vercel.app/api/og?title=Magi%20Sharma&description=Developer",
        width: 1200,
        height: 630,
        alt: "Magi Sharma - Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Magi Sharma — Developer",
    description: "Building compilers, systems, and open-source tools.",
    images: ["https://magi-portfolio.vercel.app/api/og?title=Magi%20Sharma&description=Developer"],
    creator: "@magi8101",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${playfair.variable} ${ibmPlexMono.variable}`} suppressHydrationWarning>
      <head>
        {process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && (
          <meta
            name="google-site-verification"
            content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION}
          />
        )}
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <BackToTop />
          <VisitorTracker />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
