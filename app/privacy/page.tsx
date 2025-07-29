import { Brain } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="container mx-auto px-4 py-6 border-b border-slate-100">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-slate-900 p-2.5 rounded-xl shadow-sm">
              <Brain className="h-7 w-7 text-white" />
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
          <h1 className="text-4xl font-bold text-slate-900 mb-8">Privacy Policy</h1>

          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 mb-8">Last updated: January 2024</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Information We Collect</h2>
              <p className="text-slate-700 mb-4">
                We collect information you provide directly to us, such as when you create an account, take assessments,
                or contact us for support.
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li>Personal information (name, email address)</li>
                <li>Assessment responses and results</li>
                <li>Usage data and analytics</li>
                <li>Device and browser information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">How We Use Your Information</h2>
              <p className="text-slate-700 mb-4">
                We use the information we collect to provide, maintain, and improve our services.
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li>Provide personalized assessment results</li>
                <li>Improve our assessment algorithms</li>
                <li>Send you updates and notifications</li>
                <li>Provide customer support</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Data Security</h2>
              <p className="text-slate-700">
                We implement appropriate security measures to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Contact Us</h2>
              <p className="text-slate-700">
                If you have any questions about this Privacy Policy, please contact us at privacy@datavine.ai
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
