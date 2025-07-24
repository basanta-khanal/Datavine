"use client"

import { useState } from "react"
import { Brain, CreditCard, Check, Star, Calendar, Download, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"

export default function BillingPage() {
  const [currentPlan, setCurrentPlan] = useState("premium")

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for trying out our assessments",
      features: ["3 assessments per month", "Basic results", "Email support", "Community access"],
      limitations: ["Limited detailed analysis", "No progress tracking", "No PDF reports"],
    },
    {
      id: "premium",
      name: "Premium",
      price: "$9.99",
      period: "per month",
      description: "Most popular choice for regular users",
      features: [
        "Unlimited assessments",
        "Detailed analysis & insights",
        "Progress tracking",
        "PDF reports",
        "Priority email support",
        "Advanced recommendations",
        "Goal setting tools",
      ],
      popular: true,
    },
    {
      id: "professional",
      name: "Professional",
      price: "$29.99",
      period: "per month",
      description: "For professionals and organizations",
      features: [
        "Everything in Premium",
        "Team management",
        "Bulk assessments",
        "API access",
        "Custom branding",
        "Phone support",
        "Advanced analytics",
        "Export capabilities",
      ],
    },
  ]

  const billingHistory = [
    {
      date: "2024-01-01",
      description: "Premium Monthly Subscription",
      amount: "$9.99",
      status: "Paid",
      invoice: "INV-2024-001",
    },
    {
      date: "2023-12-01",
      description: "Premium Monthly Subscription",
      amount: "$9.99",
      status: "Paid",
      invoice: "INV-2023-012",
    },
    {
      date: "2023-11-01",
      description: "Premium Monthly Subscription",
      amount: "$9.99",
      status: "Paid",
      invoice: "INV-2023-011",
    },
  ]

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Payment Plans", current: true },
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
              <p className="text-xs text-slate-600">Payment Plans</p>
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
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Payment Plans</h1>
            <p className="text-slate-600">Choose the plan that best fits your cognitive assessment needs.</p>
          </div>

          {/* Current Plan Status */}
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-blue-900">Current Plan: Premium</CardTitle>
                  <CardDescription className="text-blue-700">
                    Your subscription renews on February 1, 2024
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-900">$9.99/month • Next billing: Feb 1, 2024</span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Update Payment Method
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                  >
                    Cancel Subscription
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {plans.map((plan) => (
              <Card key={plan.id} className={`relative ${plan.popular ? "border-blue-500 shadow-lg" : ""}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-3 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                    <span className="text-slate-600 ml-2">{plan.period}</span>
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-slate-700">{feature}</span>
                      </li>
                    ))}
                    {plan.limitations &&
                      plan.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <AlertCircle className="h-4 w-4 text-slate-400 flex-shrink-0" />
                          <span className="text-sm text-slate-500">{limitation}</span>
                        </li>
                      ))}
                  </ul>
                  <Button
                    className={`w-full ${currentPlan === plan.id ? "bg-slate-400 cursor-not-allowed" : plan.popular ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                    disabled={currentPlan === plan.id}
                  >
                    {currentPlan === plan.id ? "Current Plan" : `Choose ${plan.name}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Billing History */}
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>View and download your past invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {billingHistory.map((bill, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-slate-100 p-2 rounded-full">
                        <Calendar className="h-4 w-4 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{bill.description}</p>
                        <p className="text-sm text-slate-600">{new Date(bill.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">{bill.amount}</p>
                        <Badge variant={bill.status === "Paid" ? "default" : "secondary"} className="text-xs">
                          {bill.status}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Manage your payment information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="bg-slate-100 p-2 rounded-full">
                    <CreditCard className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">•••• •••• •••• 4242</p>
                    <p className="text-sm text-slate-600">Expires 12/2025</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Update Card
                  </Button>
                  <Button variant="outline" size="sm">
                    Add New Card
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
