import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Free IQ Test Online - Discover Your Intelligence Score in 15 Minutes | MindMetrics",
  description:
    "Take our scientifically-validated IQ test and get instant results. Discover your cognitive strengths across logic, memory, and reasoning. Trusted by 100,000+ users worldwide.",
  keywords:
    "IQ test, intelligence test, cognitive assessment, free IQ test online, intelligence quotient, brain test, mental ability test",
  authors: [{ name: "MindMetrics Team" }],
  creator: "MindMetrics",
  publisher: "MindMetrics",
  robots: "index, follow",
  openGraph: {
    title: "Free IQ Test Online - Discover Your Intelligence Score | MindMetrics",
    description:
      "Take our scientifically-validated IQ test and get instant results. Trusted by 100,000+ users worldwide.",
    url: "https://mindmetrics.com",
    siteName: "MindMetrics",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MindMetrics IQ Test - Discover Your Intelligence",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free IQ Test Online - Discover Your Intelligence Score",
    description:
      "Take our scientifically-validated IQ test and get instant results. Trusted by 100,000+ users worldwide.",
    images: ["/twitter-image.jpg"],
  },
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://mindmetrics.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "MindMetrics IQ Test",
              description: "Professional online IQ test with instant results and detailed cognitive analysis",
              url: "https://mindmetrics.com",
              applicationCategory: "EducationalApplication",
              operatingSystem: "Web Browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                reviewCount: "12847",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
