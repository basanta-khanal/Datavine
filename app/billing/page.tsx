"use client"

import { useState } from "react"
import { Brain, CreditCard, Download, Calendar, CheckCircle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"

export default function BillingPage() {
  const [currentPlan] = useState({
    name: "Premium",
    price: 19.99,
    period: "monthly",
    status: "active",
    nextBilling: "2024-02-15",
    features: [
      "Unlimited IQ assessments",
      "Personality assessments",
      "Detailed PDF reports",
      "Progress tracking",
      "Priority support",
    ],
  })

  const [billingHistory] = useState([
    { date: "2024-01-15", amount: 19.99, status: "paid", invoice: "INV-001" },
    { date: "2023-12-15", amount: 19.99, status: "paid", invoice: "INV-002" },
    { date: "2023-11-15", amount: 19.99, status: "paid", invoice: "INV-003" },
    { date: "2023-10-15", amount: 19.99, status: "paid", invoice: "INV-004" },
  ])

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Billing", current: true },
  ]

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
              <p className="text-xs text-slate-600">Billing & Payments</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <a href="/dashboard" className="text-slate-600 hover:text-slate-900">
              ← Back to Dashboard
            </a>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <BreadcrumbNav items={breadcrumbItems} />

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Billing & Payments</h1>
            <p className="text-slate-600">Manage your subscription and billing information</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Current Plan */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Current Plan</CardTitle>
                      <CardDescription>Your active subscription details</CardDescription>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {currentPlan.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">{currentPlan.name}</h3>
                        <p className="text-slate-600">
                          ${currentPlan.price}/{currentPlan.period}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600">Next billing date</p>
                        <p className="font-semibold text-slate-900">{currentPlan.nextBilling}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Plan Features</h4>
                      <ul className="space-y-2">
                        {currentPlan.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-slate-700">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex space-x-4">
                      <Button variant="outline">Change Plan</Button>
                      <Button variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
                        Cancel Subscription
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Billing History */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                  <CardDescription>Your payment history and invoices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {billingHistory.map((payment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="bg-slate-100 p-2 rounded-full">
                            <CreditCard className="h-4 w-4 text-slate-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{payment.invoice}</p>
                            <p className="text-sm text-slate-600">{payment.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-semibold text-slate-900">${payment.amount}</p>
                            <Badge
                              className={
                                payment.status === "paid" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }
                            >
                              {payment.status}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Method & Quick Actions */}
            <div className="space-y-8">
              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>Your default payment method</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 p-4 border border-slate-200 rounded-lg">
                    <div className="bg-slate-100 p-2 rounded-full">
                      <CreditCard className="h-5 w-5 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">•••• •••• •••• 4242</p>
                      <p className="text-sm text-slate-600">Expires 12/25</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4 bg-transparent">
                    Update Payment Method
                  </Button>
                </CardContent>
              </Card>

              {/* Usage Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Usage Summary</CardTitle>
                  <CardDescription>Current billing period usage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-600">IQ Assessments</span>
                    <span className="font-semibold">12 / Unlimited</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Personality Tests</span>
                    <span className="font-semibold">3 / Unlimited</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">PDF Reports</span>
                    <span className="font-semibold">15 / Unlimited</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Support Tickets</span>
                    <span className="font-semibold">2 / Priority</span>
                  </div>
                </CardContent>
              </Card>

              {/* Billing Alerts */}
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    <CardTitle className="text-orange-900">Billing Alert</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-orange-800 text-sm mb-4">
                    Your payment method will expire soon. Please update your card information to avoid service
                    interruption.
                  </p>
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                    Update Now
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Download All Invoices
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Payment Calendar
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Billing Preferences
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
