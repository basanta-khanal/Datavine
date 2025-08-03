import { Brain, MessageCircle, Book, Phone, Mail, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function HelpPage() {
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
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Help & Support</h1>
            <p className="text-xl text-slate-600">
              Get the help you need to make the most of your DataVine.ai experience
            </p>
          </div>

          {/* Support Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="text-center">
                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <MessageCircle className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>Live Chat</CardTitle>
                <CardDescription>Get instant help from our support team</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Start Chat</Button>
                <p className="text-sm text-slate-600 mt-2">Available 24/7</p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="text-center">
                <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Mail className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>Email Support</CardTitle>
                <CardDescription>Send us a detailed message</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button variant="outline" className="w-full bg-transparent">
                  Send Email
                </Button>
                <p className="text-sm text-slate-600 mt-2">Response within 24 hours</p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="text-center">
                <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Book className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle>Knowledge Base</CardTitle>
                <CardDescription>Browse our comprehensive guides</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button variant="outline" className="w-full bg-transparent">
                  Browse Articles
                </Button>
                <p className="text-sm text-slate-600 mt-2">Self-service resources</p>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <Card className="border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg">How accurate are the assessments?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700">
                    Our assessments are based on scientifically validated instruments with high reliability coefficients
                    (r {">"} 0.90). They have been validated against gold standard clinical assessments and show strong
                    concurrent validity.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg">How long do the assessments take?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700">
                    IQ assessments typically take 45-60 minutes, ADHD screenings take 15-20 minutes, ASD assessments
                    take 20-25 minutes, and anxiety assessments take 10-15 minutes. You can pause and resume at any
                    time.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg">Can I retake an assessment?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700">
                    Yes, you can retake assessments after a 30-day waiting period to ensure reliable results. Premium
                    users have unlimited access to all assessments with detailed progress tracking.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg">Is my data secure and private?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700">
                    Absolutely. We use enterprise-grade encryption and follow strict privacy protocols. Your assessment
                    data is never shared with third parties and is stored securely in compliance with GDPR and HIPAA
                    standards.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg">What do I get with premium access?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700">
                    Premium access includes unlimited assessments, detailed PDF reports, progress tracking, personalized
                    recommendations, priority support, and access to advanced analytics and cognitive training
                    resources.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-slate-50 rounded-xl p-8">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                Still need help? Contact us directly
              </h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                      Name
                    </label>
                    <Input id="name" type="text" placeholder="Your name" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                      Email
                    </label>
                    <Input id="email" type="email" placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                    Subject
                  </label>
                  <Input id="subject" type="text" placeholder="How can we help?" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                    Message
                  </label>
                  <Textarea id="message" placeholder="Please describe your question or issue in detail..." rows={5} />
                </div>
                <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white">
                  Send Message
                </Button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Other Ways to Reach Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <Phone className="h-8 w-8 text-slate-600 mb-2" />
                <h3 className="font-semibold text-slate-900">Phone Support</h3>
                <p className="text-slate-600">+1 (555) 123-4567</p>
                <p className="text-sm text-slate-500">Mon-Fri, 9AM-6PM EST</p>
              </div>
              <div className="flex flex-col items-center">
                <Mail className="h-8 w-8 text-slate-600 mb-2" />
                <h3 className="font-semibold text-slate-900">Email</h3>
                <p className="text-slate-600">support@datavine.ai</p>
                <p className="text-sm text-slate-500">24-hour response time</p>
              </div>
              <div className="flex flex-col items-center">
                <Clock className="h-8 w-8 text-slate-600 mb-2" />
                <h3 className="font-semibold text-slate-900">Business Hours</h3>
                <p className="text-slate-600">Monday - Friday</p>
                <p className="text-sm text-slate-500">9:00 AM - 6:00 PM EST</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
