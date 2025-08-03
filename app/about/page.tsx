import { Brain, Users, Award, Target, Heart, Lightbulb } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
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
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">About DataVine.ai</h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We're on a mission to make professional-grade psychological assessments accessible to everyone, helping
              individuals understand their cognitive abilities and mental health patterns.
            </p>
          </div>

          {/* Mission, Vision, Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="border border-slate-200 shadow-sm text-center">
              <CardHeader>
                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700">
                  To democratize access to scientifically validated psychological assessments, empowering individuals
                  with insights into their cognitive and emotional well-being.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm text-center">
              <CardHeader>
                <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Lightbulb className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle>Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700">
                  A world where everyone has access to professional-grade mental health and cognitive assessments,
                  leading to better self-understanding and improved outcomes.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm text-center">
              <CardHeader>
                <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>Our Values</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700">
                  Scientific rigor, accessibility, privacy, and compassion guide everything we do. We believe in
                  evidence-based approaches and treating every user with dignity.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Our Story */}
          <div className="bg-slate-50 rounded-xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">Our Story</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-slate-700 mb-4 text-lg">
                DataVine.ai was founded in 2023 by a team of clinical psychologists, data scientists, and technology
                experts who recognized a critical gap in mental health accessibility. Traditional psychological
                assessments were often expensive, time-consuming, and difficult to access for many people who could
                benefit from them.
              </p>
              <p className="text-slate-700 mb-4 text-lg">
                Our founders, having worked in clinical settings for years, witnessed firsthand how early identification
                of cognitive patterns and mental health indicators could dramatically improve outcomes. They envisioned
                a platform that could bring the same level of scientific rigor found in clinical settings to anyone with
                an internet connection.
              </p>
              <p className="text-slate-700 text-lg">
                Today, DataVine.ai serves thousands of users worldwide, providing scientifically validated assessments
                that help people understand their cognitive abilities, identify potential mental health concerns, and
                make informed decisions about their well-being.
              </p>
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border border-slate-200 shadow-sm">
                <CardHeader className="text-center">
                  <div className="bg-slate-200 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-12 w-12 text-slate-600" />
                  </div>
                  <CardTitle>Dr. Sarah Chen</CardTitle>
                  <CardDescription>Co-Founder & Chief Clinical Officer</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 text-sm">
                    Clinical psychologist with 15+ years of experience in cognitive assessment. Ph.D. from Stanford
                    University, specializing in neuropsychological testing.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 shadow-sm">
                <CardHeader className="text-center">
                  <div className="bg-slate-200 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-12 w-12 text-slate-600" />
                  </div>
                  <CardTitle>Michael Rodriguez</CardTitle>
                  <CardDescription>Co-Founder & CEO</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 text-sm">
                    Former tech executive with a passion for mental health accessibility. MBA from Wharton, previously
                    led product teams at major healthcare companies.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 shadow-sm">
                <CardHeader className="text-center">
                  <div className="bg-slate-200 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-12 w-12 text-slate-600" />
                  </div>
                  <CardTitle>Dr. James Park</CardTitle>
                  <CardDescription>Chief Technology Officer</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 text-sm">
                    AI researcher and software architect with expertise in machine learning applications in healthcare.
                    Ph.D. in Computer Science from MIT.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-slate-900 rounded-xl p-8 text-white mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold mb-2">50,000+</div>
                <div className="text-slate-300">Assessments Completed</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">25,000+</div>
                <div className="text-slate-300">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">98%</div>
                <div className="text-slate-300">User Satisfaction</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">15+</div>
                <div className="text-slate-300">Countries Served</div>
              </div>
            </div>
          </div>

          {/* Partnerships */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Trusted Partners</h2>
            <p className="text-slate-600 mb-8 max-w-3xl mx-auto">
              We collaborate with leading academic institutions, healthcare organizations, and research centers to
              ensure our assessments meet the highest standards of scientific validity and clinical utility.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border border-slate-200 shadow-sm">
                <CardHeader className="text-center">
                  <Award className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <CardTitle>Academic Partnerships</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 text-sm">
                    Collaborating with top universities for ongoing research and validation studies.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 shadow-sm">
                <CardHeader className="text-center">
                  <Heart className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <CardTitle>Healthcare Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 text-sm">
                    Working with healthcare providers to integrate our assessments into clinical workflows.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 shadow-sm">
                <CardHeader className="text-center">
                  <Brain className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <CardTitle>Research Initiatives</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 text-sm">
                    Contributing to mental health research through data insights and collaborative studies.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
