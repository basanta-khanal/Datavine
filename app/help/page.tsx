export default function HelpPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="container mx-auto px-4 py-6 border-b border-slate-100">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-slate-900 p-2.5 rounded-xl shadow-sm">
              <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">DataVine.ai</h1>
              <p className="text-xs text-slate-600">Help & Support</p>
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
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Help & Support</h1>
            <p className="text-xl text-slate-600">
              Find answers to common questions and get support
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 border border-slate-200 rounded-lg">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="h-8 w-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2Z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Live Chat</h3>
              <p className="text-slate-600 mb-4">Get instant help from our support team</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Start Chat
              </button>
            </div>

            <div className="text-center p-6 border border-slate-200 rounded-lg">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="h-8 w-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Email Support</h3>
              <p className="text-slate-600 mb-4">Send us a detailed message</p>
              <a href="mailto:support@datavine.ai" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 inline-block">
                Email Us
              </a>
            </div>

            <div className="text-center p-6 border border-slate-200 rounded-lg">
              <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="h-8 w-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Knowledge Base</h3>
              <p className="text-slate-600 mb-4">Browse our comprehensive guides</p>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                Browse Articles
              </button>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <h2>Frequently Asked Questions</h2>

            <h3>Getting Started</h3>
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-2">How do I create an account?</h4>
                <p className="text-slate-600">
                  Click "Sign Up" on the homepage, fill in your details, and verify your email address. 
                  You can then start taking assessments immediately.
                </p>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-2">Are the assessments free?</h4>
                <p className="text-slate-600">
                  Basic assessments and results are free. Premium features like detailed reports, 
                  unlimited assessments, and advanced insights require a subscription.
                </p>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-2">How long do assessments take?</h4>
                <p className="text-slate-600">
                  IQ assessments take about 15-20 minutes, ADHD screenings about 5-10 minutes, 
                  and autism screenings about 10-15 minutes.
                </p>
              </div>
            </div>

            <h3>Assessment Questions</h3>
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-2">How accurate are the results?</h4>
                <p className="text-slate-600">
                  Our assessments are based on scientifically validated methods and show high 
                  correlation with professional tests. However, they are screening tools and 
                  should not replace professional evaluation.
                </p>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-2">Can I retake an assessment?</h4>
                <p className="text-slate-600">
                  Yes, you can retake assessments. However, we recommend waiting at least 30 days 
                  between attempts to ensure accurate results and avoid practice effects.
                </p>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-2">What if I disagree with my results?</h4>
                <p className="text-slate-600">
                  Assessment results can vary based on many factors. If you have concerns, 
                  consider consulting with a licensed psychologist for a comprehensive evaluation.
                </p>
              </div>
            </div>

            <h3>Technical Support</h3>
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-2">The assessment won't load</h4>
                <p className="text-slate-600">
                  Try refreshing your browser, clearing your cache, or using a different browser. 
                  Ensure you have a stable internet connection.
                </p>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-2">I can't access my results</h4>
                <p className="text-slate-600">
                  Make sure you're logged into the correct account. If you're still having issues, 
                  contact our support team with your account email.
                </p>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-2">Payment issues</h4>
                <p className="text-slate-600">
                  For billing questions or payment issues, contact our support team. We offer 
                  a 30-day money-back guarantee on all purchases.
                </p>
              </div>
            </div>

            <h2>Contact Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3>General Support</h3>
                <p>Email: <a href="mailto:support@datavine.ai" className="text-blue-600">support@datavine.ai</a></p>
                <p>Response time: Within 24 hours</p>
              </div>
              <div>
                <h3>Technical Issues</h3>
                <p>Email: <a href="mailto:tech@datavine.ai" className="text-blue-600">tech@datavine.ai</a></p>
                <p>Response time: Within 12 hours</p>
              </div>
            </div>

            <h2>System Requirements</h2>
            <ul>
              <li>Modern web browser (Chrome, Firefox, Safari, Edge)</li>
              <li>Stable internet connection</li>
              <li>JavaScript enabled</li>
              <li>Screen resolution: 1024x768 or higher</li>
            </ul>

            <h2>Privacy & Security</h2>
            <p>
              Your privacy and data security are our top priorities. All data is encrypted 
              and stored securely. We never share individual results with third parties. 
              For more information, see our <a href="/privacy" className="text-blue-600">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
