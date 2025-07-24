export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="container mx-auto px-4 py-6 border-b border-slate-100">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-slate-900 p-2.5 rounded-xl shadow-sm">
              <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">DataVine.ai</h1>
              <p className="text-xs text-slate-600">Terms of Service</p>
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
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Terms of Service</h1>
            <p className="text-xl text-slate-600">
              Last updated: January 2024
            </p>
          </div>

          <div className="prose prose-slate max-w-none">
            <h2>Acceptance of Terms</h2>
            <p>
              By accessing and using DataVine.ai, you accept and agree to be bound by the terms 
              and provision of this agreement.
            </p>

            <h2>Description of Service</h2>
            <p>
              DataVine.ai provides online cognitive assessments and related services. Our assessments 
              are designed for educational and informational purposes and should not be considered 
              as professional medical or psychological diagnosis.
            </p>

            <h2>User Accounts</h2>
            <p>
              To access certain features, you must create an account. You are responsible for:
            </p>
            <ul>
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Providing accurate and complete information</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>

            <h2>Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the service</li>
              <li>Share your account credentials with others</li>
              <li>Use automated systems to access the service</li>
            </ul>

            <h2>Assessment Limitations</h2>
            <p>
              Our assessments are screening tools and should not be used as:
            </p>
            <ul>
              <li>Professional medical or psychological diagnosis</li>
              <li>Substitute for professional consultation</li>
              <li>Basis for making important life decisions without professional guidance</li>
            </ul>

            <h2>Intellectual Property</h2>
            <p>
              All content, features, and functionality of DataVine.ai are owned by us and are 
              protected by copyright, trademark, and other intellectual property laws.
            </p>

            <h2>Payment Terms</h2>
            <p>
              For paid services:
            </p>
            <ul>
              <li>Payments are processed securely through third-party providers</li>
              <li>Subscriptions automatically renew unless cancelled</li>
              <li>Refunds are available within 30 days of purchase</li>
              <li>Prices may change with notice to existing subscribers</li>
            </ul>

            <h2>Privacy</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy, which also 
              governs your use of the service.
            </p>

            <h2>Disclaimers</h2>
            <p>
              The service is provided "as is" without warranties of any kind. We do not guarantee 
              that the service will be uninterrupted, secure, or error-free.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              In no event shall DataVine.ai be liable for any indirect, incidental, special, 
              consequential, or punitive damages arising out of your use of the service.
            </p>

            <h2>Termination</h2>
            <p>
              We may terminate or suspend your account at any time for violations of these terms. 
              You may also terminate your account at any time.
            </p>

            <h2>Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of 
              material changes via email or through the service.
            </p>

            <h2>Governing Law</h2>
            <p>
              These terms are governed by and construed in accordance with applicable laws, 
              without regard to conflict of law principles.
            </p>

            <h2>Contact Information</h2>
            <p>
              Questions about these terms should be sent to{' '}
              <a href="mailto:legal@datavine.ai" className="text-blue-600 hover:text-blue-800">
                legal@datavine.ai
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
