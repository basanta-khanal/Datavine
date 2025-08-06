import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FREE IQ Test, ADHD & Autism Assessment | DataVine.ai - No Cost Cognitive Testing",
  description:
    "Take FREE professional IQ tests, ADHD screenings, and autism assessments online. One of the few companies offering completely free cognitive assessments with instant results. No hidden fees, no credit card required.",
  keywords: "free IQ test, free ADHD test, free autism test, free cognitive assessment, free psychological testing, online IQ test, ADHD screening, autism screening, free mental health assessment, cognitive testing, brain assessment, free psychology test",
  authors: [{ name: "DataVine.ai Team" }],
  creator: "DataVine.ai",
  publisher: "DataVine.ai",
  robots: "index, follow",
  metadataBase: new URL("https://datavine.ai"),
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" }
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://datavine.ai",
    title: "FREE IQ Test, ADHD & Autism Assessment | DataVine.ai",
    description: "Take FREE professional cognitive assessments online. No cost, no credit card required. Instant results for IQ, ADHD, and autism screening.",
    siteName: "DataVine.ai",
    images: [
      {
        url: "/logo.svg",
        width: 120,
        height: 120,
        alt: "DataVine.ai - Brain Logo with Neural Pathways",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FREE IQ Test, ADHD & Autism Assessment | DataVine.ai",
    description: "Take FREE professional cognitive assessments online. No cost, no credit card required. Instant results for IQ, ADHD, and autism screening.",
    creator: "@datavineai",
    images: ["/logo.svg"],
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
              name: "DataVine.ai - Free Cognitive Assessments",
              description: "FREE professional IQ tests, ADHD screenings, and autism assessments online. No cost, no credit card required.",
              url: "https://datavine.ai",
              applicationCategory: "HealthApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
                description: "Completely free cognitive assessments with instant results",
                availability: "https://schema.org/InStock",
              },
              author: {
                "@type": "Organization",
                name: "DataVine.ai",
                description: "One of the few companies offering completely free cognitive assessments",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                reviewCount: "1250",
                bestRating: "5",
                worstRating: "1"
              },
              serviceType: "Cognitive Assessment",
              areaServed: "Worldwide",
              availableLanguage: "English"
            }),
          }}
        />

        {/* FAQ Schema for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Are the cognitive assessments really free?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, all our basic cognitive assessments including IQ tests, ADHD screenings, and autism assessments are completely free. No credit card required, no hidden fees."
                  }
                },
                {
                  "@type": "Question",
                  name: "How accurate are the free assessments?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Our assessments are based on scientifically validated psychological instruments and research-backed methodologies for accurate results."
                  }
                },
                {
                  "@type": "Question",
                  name: "Do I need to create an account for free assessments?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "You can take the assessments without creating an account, but creating a free account allows you to save your results and track your progress over time."
                  }
                }
              ]
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
