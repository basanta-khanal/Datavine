export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="container mx-auto px-4 py-6 border-b border-slate-100">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-slate-900 p-2.5 rounded-xl shadow-sm">
              <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">DataVine.ai</h1>
              <p className="text-xs text-slate-600">Privacy Policy</p>
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
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
            <p className="text-xl text-slate-600">
              Last updated: January 2024
            </p>
          </div>

          <div className="prose prose-slate max-w-none">
            <h2>Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you create an account, 
              take an assessment, or contact us for support.
            </p>

            <h3>Personal Information</h3>
            <ul>
              <li>Name and email address</li>
              <li>Phone number (optional)</li>
              <li>Demographic information (age, gender)</li>
              <li>Assessment responses and results</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <ul>
              <li>Device information and IP address</li>
              <li>Usage data and analytics</li>
              <li>Cookies and similar technologies</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide and improve our assessment services</li>
              <li>Generate your personalized results and reports</li>
              <li>Communicate with you about your account and our services</li>
              <li>Conduct research to improve our assessments (anonymized data only)</li>
              <li>Ensure the security and integrity of our platform</li>
            </ul>

            <h2>Information Sharing</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              without your consent, except as described in this policy:
            </p>
            <ul>
              <li>Service providers who assist in operating our platform</li>
              <li>Legal requirements or to protect our rights</li>
              <li>Business transfers (with notice to users)</li>
            </ul>

            <h2>Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction. This includes:
            </p>
            <ul>
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication measures</li>
              <li>Employee training on data protection</li>
            </ul>

            <h2>Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and associated data</li>
              <li>Export your data</li>
              <li>Opt out of marketing communications</li>
            </ul>

            <h2>Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to provide our services 
              and fulfill the purposes outlined in this policy, unless a longer retention period 
              is required by law.
            </p>

            <h2>Children's Privacy</h2>
            <p>
              Our services are not intended for children under 13. We do not knowingly collect 
              personal information from children under 13.
            </p>

            <h2>International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your own. 
              We ensure appropriate safeguards are in place for such transfers.
            </p>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any 
              material changes by posting the new policy on this page and updating the "Last updated" date.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have questions about this privacy policy, please contact us at{' '}
              <a href="mailto:privacy@datavine.ai" className="text-blue-600 hover:text-blue-800">
                privacy@datavine.ai
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
