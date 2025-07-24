export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="container mx-auto px-4 py-6 border-b border-slate-100">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-slate-900 p-2.5 rounded-xl shadow-sm">
              <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">DataVine.ai</h1>
              <p className="text-xs text-slate-600">Research & Methodology</p>
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
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Research & Methodology</h1>
            <p className="text-xl text-slate-600">
              Scientific foundation behind our assessments
            </p>
          </div>

          <div className="prose prose-slate max-w-none">
            <h2>Our Scientific Approach</h2>
            <p>
              DataVine.ai's assessments are grounded in decades of psychological research and 
              established testing methodologies. We collaborate with licensed psychologists and 
              researchers to ensure our tools meet the highest standards of scientific rigor.
            </p>

            <h2>IQ Assessment Methodology</h2>
            <p>
              Our cognitive assessment is based on well-established intelligence testing principles:
            </p>
            <h3>Raven's Progressive Matrices</h3>
            <ul>
              <li>Non-verbal assessment of abstract reasoning</li>
              <li>Culture-fair testing approach</li>
              <li>Pattern recognition and logical thinking</li>
              <li>Validated across diverse populations</li>
            </ul>

            <h3>WAIS-IV Principles</h3>
            <ul>
              <li>Comprehensive cognitive assessment framework</li>
              <li>Multiple cognitive domains evaluation</li>
              <li>Age-appropriate normative data</li>
              <li>Standardized administration and scoring</li>
            </ul>

            <h2>ADHD Screening Framework</h2>
            <p>
              Our ADHD assessment incorporates evidence-based screening tools:
            </p>
            <h3>ASRS-v1.1 (Adult ADHD Self-Report Scale)</h3>
            <ul>
              <li>WHO-developed screening instrument</li>
              <li>18-item questionnaire covering DSM-5 criteria</li>
              <li>High sensitivity and specificity rates</li>
              <li>Validated in clinical populations</li>
            </ul>

            <h3>DSM-5 Criteria Integration</h3>
            <ul>
              <li>Inattention symptom assessment</li>
              <li>Hyperactivity-impulsivity evaluation</li>
              <li>Functional impairment consideration</li>
              <li>Developmental history factors</li>
            </ul>

            <h2>Autism Spectrum Assessment</h2>
            <p>
              Our autism screening is based on established research instruments:
            </p>
            <h3>Autism Spectrum Quotient (AQ)</h3>
            <ul>
              <li>Developed by Baron-Cohen et al. at Cambridge</li>
              <li>50-item self-report questionnaire</li>
              <li>Measures autistic traits in general population</li>
              <li>Extensively validated and researched</li>
            </ul>

            <h3>Key Assessment Domains</h3>
            <ul>
              <li>Social skills and communication</li>
              <li>Attention to detail and patterns</li>
              <li>Attention switching and flexibility</li>
              <li>Imagination and creativity</li>
            </ul>

            <h2>Validation Studies</h2>
            <p>
              We continuously validate our assessments through:
            </p>
            <ul>
              <li>Correlation studies with established tests</li>
              <li>Test-retest reliability analysis</li>
              <li>Cross-cultural validation</li>
              <li>Clinical population studies</li>
            </ul>

            <h2>Ethical Considerations</h2>
            <p>
              Our research and development process adheres to:
            </p>
            <ul>
              <li>APA ethical guidelines for psychological testing</li>
              <li>Informed consent principles</li>
              <li>Data privacy and security standards</li>
              <li>Cultural sensitivity and inclusivity</li>
            </ul>

            <h2>Limitations and Disclaimers</h2>
            <p>
              While our assessments are scientifically grounded, they have important limitations:
            </p>
            <ul>
              <li>Screening tools, not diagnostic instruments</li>
              <li>Should not replace professional evaluation</li>
              <li>Results may be influenced by various factors</li>
              <li>Cultural and linguistic considerations apply</li>
            </ul>

            <h2>Ongoing Research</h2>
            <p>
              We are committed to continuous improvement through:
            </p>
            <ul>
              <li>Regular assessment updates based on new research</li>
              <li>Collaboration with academic institutions</li>
              <li>User feedback integration</li>
              <li>Technology-enhanced assessment methods</li>
            </ul>

            <h2>Publications and References</h2>
            <p>
              Our methodology is based on peer-reviewed research including:
            </p>
            <ul>
              <li>Raven, J. (2000). The Raven's Progressive Matrices</li>
              <li>Wechsler, D. (2008). WAIS-IV Technical Manual</li>
              <li>Kessler, R.C. et al. (2005). ASRS-v1.1 Screener</li>
              <li>Baron-Cohen, S. et al. (2001). Autism Spectrum Quotient</li>
            </ul>

            <h2>Contact Our Research Team</h2>
            <p>
              For questions about our methodology or research collaborations, contact{' '}
              <a href="mailto:research@datavine.ai" className="text-blue-600 hover:text-blue-800">
                research@datavine.ai
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
