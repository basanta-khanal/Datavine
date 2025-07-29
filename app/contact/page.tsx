import { Brain, Mail, Phone, MapPin, Clock, Send } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ContactPage() {
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
              <p className="text-xs text-slate-600">Contact Us</p>
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
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Contact Us</h1>
            <p className="text-xl text-slate-600">We'd love to hear from you. Get in touch with our team.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card className="border border-slate-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Send us a message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2">
                          First Name
                        </label>
                        <Input id="firstName" type="text" placeholder="John" />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-2">
                          Last Name
                        </label>
                        <Input id="lastName" type="text" placeholder="Doe" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address
                      </label>
                      <Input id="email" type="email" placeholder="john@example.com" />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                        Phone Number (Optional)
                      </label>
                      <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                        Subject
                      </label>
                      <Input id="subject" type="text" placeholder="How can we help you?" />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                        Message
                      </label>
                      <Textarea id="message" placeholder="Tell us more about your inquiry..." rows={6} />
                    </div>

                    <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white">
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="border border-slate-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Get in touch</CardTitle>
                  <CardDescription>Reach out to us through any of these channels.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Email</h3>
                      <p className="text-slate-600">support@datavine.ai</p>
                      <p className="text-sm text-slate-500">We'll respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Phone className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Phone</h3>
                      <p className="text-slate-600">+1 (555) 123-4567</p>
                      <p className="text-sm text-slate-500">Mon-Fri, 9AM-6PM EST</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <MapPin className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Office</h3>
                      <p className="text-slate-600">
                        123 Innovation Drive
                        <br />
                        San Francisco, CA 94105
                        <br />
                        United States
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-orange-100 p-3 rounded-full">
                      <Clock className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Business Hours</h3>
                      <p className="text-slate-600">
                        Monday - Friday: 9:00 AM - 6:00 PM EST
                        <br />
                        Saturday: 10:00 AM - 4:00 PM EST
                        <br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Quick Links */}
              <Card className="border border-slate-200 shadow-lg">
                <CardHeader>
                  <CardTitle>Quick Help</CardTitle>
                  <CardDescription>Looking for immediate answers? Check out these resources.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Brain className="h-4 w-4 mr-2" />
                    Assessment FAQ
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Mail className="h-4 w-4 mr-2" />
                    Technical Support
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Phone className="h-4 w-4 mr-2" />
                    Billing Questions
                  </Button>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card className="border border-red-200 bg-red-50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-red-900">Crisis Support</CardTitle>
                  <CardDescription className="text-red-700">
                    If you're experiencing a mental health crisis, please contact:
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p className="text-red-900 font-semibold">National Suicide Prevention Lifeline: 988</p>
                    <p className="text-red-800">Crisis Text Line: Text HOME to 741741</p>
                    <p className="text-red-700">Emergency Services: 911</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
