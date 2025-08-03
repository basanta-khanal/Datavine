import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DataVine.ai - Professional Cognitive Assessments",
  description:
    "Discover your unique cognitive profile with scientifically validated assessments. Take IQ tests, ADHD screenings, and autism assessments with AI-powered insights.",
  keywords: "IQ test, cognitive assessment, ADHD screening, autism test, brain training, psychology, mental health",
  authors: [{ name: "DataVine.ai Team" }],
  creator: "DataVine.ai",
  publisher: "DataVine.ai",
  robots: "index, follow",
  metadataBase: new URL("https://datavine.ai"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://datavine.ai",
    title: "DataVine.ai - Professional Cognitive Assessments",
    description: "Discover your unique cognitive profile with scientifically validated assessments.",
    siteName: "DataVine.ai",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "DataVine.ai - Cognitive Assessments",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DataVine.ai - Professional Cognitive Assessments",
    description: "Discover your unique cognitive profile with scientifically validated assessments.",
    creator: "@datavineai",
    images: ["/og-image.jpg"],
  },
  generator: 'v0.dev'
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1e293b',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#1e293b" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "DataVine.ai",
              description: "Professional cognitive assessments and brain training platform",
              url: "https://datavine.ai",
              applicationCategory: "HealthApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              author: {
                "@type": "Organization",
                name: "DataVine.ai",
              },
            }),
          }}
        />

        {/* Google Analytics - Replace GA_MEASUREMENT_ID with actual ID in production */}
        {process.env.NODE_ENV === 'production' && (
          <>
            <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'GA_MEASUREMENT_ID');
              `,
              }}
            />
          </>
        )}
      </head>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
