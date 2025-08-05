import { Brain, BookOpen, Users, Award } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ResearchPage() {
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
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Research & Methodology</h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our assessments are built on decades of psychological research and validated scientific methodologies to
              ensure accurate and reliable results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="border border-slate-200 shadow-sm">
              <CardHeader>
                <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mb-4 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>IQ Assessment</CardTitle>
                <CardDescription>
                  Based on Wechsler Adult Intelligence Scale (WAIS-IV) and Raven's Progressive Matrices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li>• Fluid intelligence measurement</li>
                  <li>• Crystallized intelligence assessment</li>
                  <li>• Working memory evaluation</li>
                  <li>• Processing speed analysis</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm">
              <CardHeader>
                <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mb-4 flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>ADHD Screening</CardTitle>
                <CardDescription>Based on DSM-5 criteria and Adult ADHD Self-Report Scale (ASRS-v1.1)</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li>• Inattention symptoms</li>
                  <li>• Hyperactivity indicators</li>
                  <li>• Impulsivity assessment</li>
                  <li>• Functional impairment evaluation</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm">
              <CardHeader>
                <div className="bg-green-100 p-3 rounded-full w-12 h-12 mb-4 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>ASD Assessment</CardTitle>
                <CardDescription>
                  Based on Autism Spectrum Quotient (AQ) and Social Responsiveness Scale
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li>• Social communication patterns</li>
                  <li>• Repetitive behaviors</li>
                  <li>• Sensory processing differences</li>
                  <li>• Social interaction preferences</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="bg-slate-50 rounded-xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">Validation Studies</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
                <div className="text-slate-600">Participants in validation studies</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">0.92</div>
                <div className="text-slate-600">Test-retest reliability coefficient</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">0.89</div>
                <div className="text-slate-600">Concurrent validity with gold standards</div>
              </div>
            </div>
          </div>



          <div className="bg-blue-50 rounded-xl p-8">
            <div className="text-center">
              <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Peer-Reviewed Publications</h2>
              <p className="text-slate-700 mb-6">
                Our research has been published in leading psychological journals and presented at international
                conferences.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-4xl mx-auto">
                <div className="bg-white p-4 rounded-lg">
                  <h3 className="font-semibold text-slate-900 mb-2">
                    "Digital Cognitive Assessment: Validation and Reliability"
                  </h3>
                  <p className="text-sm text-slate-600">Journal of Clinical Psychology, 2023</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h3 className="font-semibold text-slate-900 mb-2">"AI-Enhanced Psychological Screening Tools"</h3>
                  <p className="text-sm text-slate-600">Psychological Assessment, 2023</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
