import { Brain } from "lucide-react"

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold text-slate-900 mb-8">Terms of Service</h1>

          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 mb-8">Last updated: January 2024</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Acceptance of Terms</h2>
              <p className="text-slate-700">
                By accessing and using DataVine.ai, you accept and agree to be bound by the terms and provision of this
                agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Use License</h2>
              <p className="text-slate-700 mb-4">
                Permission is granted to temporarily use DataVine.ai for personal, non-commercial transitory viewing
                only.
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li>This is the grant of a license, not a transfer of title</li>
                <li>You may not modify or copy the materials</li>
                <li>You may not use the materials for commercial purposes</li>
                <li>You may not reverse engineer any software</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Disclaimer</h2>
              <p className="text-slate-700">
                The materials on DataVine.ai are provided on an 'as is' basis. DataVine.ai makes no warranties,
                expressed or implied, and hereby disclaims and negates all other warranties including without
                limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or
                non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Limitations</h2>
              <p className="text-slate-700">
                In no event shall DataVine.ai or its suppliers be liable for any damages (including, without limitation,
                damages for loss of data or profit, or due to business interruption) arising out of the use or inability
                to use the materials on DataVine.ai, even if DataVine.ai or an authorized representative has been
                notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Contact Information</h2>
              <p className="text-slate-700">
                If you have any questions about these Terms of Service, please contact us at legal@datavine.ai
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
