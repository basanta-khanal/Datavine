import { BreadcrumbNav } from "@/components/breadcrumb-nav"

export default function AboutPage() {
  const breadcrumbItems = [{ label: "About Us", current: true }]

  return (
    <div className="min-h-screen bg-white">
      <header className="container mx-auto px-4 py-6 border-b border-slate-100">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-slate-900 p-2.5 rounded-xl shadow-sm">
              <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">DataVine.ai</h1>
              <p className="text-xs text-slate-600">About Us</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <a href="/" className="text-slate-600 hover:text-slate-900">
              ← Back to Home
            </a>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <BreadcrumbNav items={breadcrumbItems} />

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">About DataVine.ai</h1>
            <p className="text-xl text-slate-600">
              Empowering individuals through scientifically-validated cognitive assessments
            </p>
          </div>

          <div className="prose prose-slate max-w-none">
            <h2>Our Mission</h2>
            <p>
              At DataVine.ai, we believe that understanding your cognitive abilities is the first step toward personal
              growth and self-improvement. Our mission is to make professional-grade psychological assessments
              accessible to everyone, providing insights that were once only available through expensive clinical
              evaluations.
            </p>

            <h2>Our Story</h2>
            <p>
              Founded in 2024 by a team of cognitive psychologists and data scientists, DataVine.ai emerged from the
              recognition that traditional psychological testing was often inaccessible, expensive, and time-consuming.
              We set out to democratize cognitive assessment by leveraging cutting-edge technology and established
              psychological methodologies.
            </p>

            <h2>Scientific Foundation</h2>
            <p>Our assessments are based on well-established psychological testing frameworks:</p>
            <ul>
              <li>
                <strong>IQ Assessment:</strong> Based on Raven's Progressive Matrices and WAIS-IV principles
              </li>
              <li>
                <strong>ADHD Screening:</strong> Adapted from ASRS-v1.1 and DSM-5 criteria
              </li>
              <li>
                <strong>Autism Screening:</strong> Based on the Autism Spectrum Quotient (AQ) research
              </li>
            </ul>

            <h2>Our Team</h2>
            <p>
              Our multidisciplinary team includes licensed psychologists, data scientists, and user experience designers
              who work together to ensure our assessments are both scientifically rigorous and user-friendly.
            </p>

            <h2>Privacy & Security</h2>
            <p>
              We take your privacy seriously. All assessment data is encrypted and stored securely. We never share
              individual results with third parties and comply with all relevant data protection regulations.
            </p>

            <h2>Contact Us</h2>
            <p>
              Have questions about our assessments or need support? Reach out to us at{" "}
              <a href="mailto:support@datavine.ai" className="text-blue-600 hover:text-blue-800">
                support@datavine.ai
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
