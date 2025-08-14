"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, CreditCard, Apple, Gift, Crown } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { apiClient, formatCurrency } from "@/lib/api"

interface PaymentFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

interface SubscriptionPlan {
  id: string
  name: string
  price: number
  features: string[]
  icon: React.ReactNode
  popular?: boolean
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "trial",
    name: "7-Day Free Trial",
    price: 0,
    features: [
      "Full Access to All Features",
      "Detailed Assessment Results",
      "AI-Powered Recommendations",
      "Progress Tracking",
      "Advanced Analytics",
      "Priority Support",
      "Cancel Anytime"
    ],
    icon: <Gift className="h-5 w-5" />,
    popular: true
  },
  {
    id: "premium",
    name: "Premium Plan",
    price: 1999, // $19.99
    features: [
      "All Trial Features",
      "Advanced Pattern Analysis",
      "Detailed Reports",
      "Performance Insights",
      "Custom Recommendations",
      "Ongoing Support"
    ],
    icon: <Crown className="h-5 w-5" />
  }
]

export const PaymentForm = ({ onSuccess, onCancel }: PaymentFormProps) => {
  const [selectedPlan, setSelectedPlan] = useState<string>("trial")
  const [paymentMethod, setPaymentMethod] = useState<"card" | "apple_pay">("card")
  const [isLoading, setIsLoading] = useState(false)
  const [stripe, setStripe] = useState<any>(null)
  const [elements, setElements] = useState<any>(null)
  const [cardElement, setCardElement] = useState<any>(null)

  useEffect(() => {
    // Only load Stripe if not selecting trial plan
    if (selectedPlan !== "trial" && typeof window !== 'undefined') {
      const loadStripe = async () => {
        try {
          const { loadStripe } = await import('@stripe/stripe-js')
          const stripeInstance = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')
          setStripe(stripeInstance)
        } catch (error) {
          console.error('Failed to load Stripe:', error)
        }
      }
      loadStripe()
    }
  }, [selectedPlan])

  useEffect(() => {
    if (stripe && paymentMethod === "card" && selectedPlan !== "trial") {
      const { Elements } = require('@stripe/react-stripe-js')
      const elementsInstance = Elements({
        clientSecret: "",
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#0f172a',
          },
        },
      })
      setElements(elementsInstance)
    }
  }, [stripe, paymentMethod, selectedPlan])

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId)
  }

  const handlePaymentMethodChange = (method: "card" | "apple_pay") => {
    setPaymentMethod(method)
  }

  const handlePayment = async () => {
    setIsLoading(true)

    try {
      if (selectedPlan === "trial") {
        // Handle trial subscription
        const response = await apiClient.startTrial()

        if (!response.success) {
          throw new Error(response.message || "Failed to start trial")
        }

        toast({
          title: "Trial Started!",
          description: "Your 7-day free trial has been activated. Enjoy full access to all features!",
        })

        onSuccess?.()
        return
      }

      // Handle paid subscription
      if (!stripe) {
        toast({
          title: "Payment Error",
          description: "Stripe is not loaded. Please refresh the page.",
          variant: "destructive",
        })
        return
      }

      // Create payment intent
      const response = await apiClient.createPaymentIntent({
        subscriptionType: selectedPlan as any,
        paymentMethod: paymentMethod
      })

      if (!response.success) {
        throw new Error(response.message || "Failed to create payment intent")
      }

      const { clientSecret } = response

      if (paymentMethod === "apple_pay") {
        // Handle Apple Pay
        const { error } = await stripe.confirmPayment({
          clientSecret,
          confirmParams: {
            payment_method: {
              card: cardElement,
              billing_details: {
                name: "DataVine.ai Subscription",
              },
            },
            return_url: `${window.location.origin}/payment-success`,
          },
        })

        if (error) {
          throw new Error(error.message)
        }
      } else {
        // Handle card payment
        const { error } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: "DataVine.ai Subscription",
            },
          },
        })

        if (error) {
          throw new Error(error.message)
        }
      }

      // Confirm subscription
      await apiClient.confirmSubscription({
        paymentIntentId: response.paymentIntentId,
        subscriptionType: selectedPlan
      })

      toast({
        title: "Payment Successful!",
        description: "Your subscription has been activated.",
      })

      onSuccess?.()

    } catch (error) {
      console.error('Payment error:', error)
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "An error occurred during payment.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const selectedPlanData = subscriptionPlans.find(plan => plan.id === selectedPlan)

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Choose Your Plan</h1>
        <p className="text-slate-600">Unlock advanced features and AI-powered insights</p>
      </div>

      {/* Plan Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subscriptionPlans.map((plan) => (
          <Card
            key={plan.id}
            className={`cursor-pointer transition-all ${
              selectedPlan === plan.id
                ? "ring-2 ring-slate-900 border-slate-900"
                : "hover:shadow-lg"
            }`}
            onClick={() => handlePlanSelect(plan.id)}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-slate-900 text-white">Most Popular</Badge>
              </div>
            )}
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                <div className="p-2 bg-slate-100 rounded-lg">
                  {plan.icon}
                </div>
              </div>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="text-3xl font-bold text-slate-900">
                {formatCurrency(plan.price)}
                <span className="text-sm font-normal text-slate-600">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Choose how you'd like to pay</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant={paymentMethod === "card" ? "default" : "outline"}
              className="h-16 flex items-center justify-center space-x-2"
              onClick={() => handlePaymentMethodChange("card")}
            >
              <CreditCard className="h-5 w-5" />
              <span>Credit / Debit Card</span>
            </Button>
            <Button
              variant={paymentMethod === "apple_pay" ? "default" : "outline"}
              className="h-16 flex items-center justify-center space-x-2"
              onClick={() => handlePaymentMethodChange("apple_pay")}
            >
              <Apple className="h-5 w-5" />
              <span>Apple Pay</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Selected Plan:</span>
              <span className="font-medium">{selectedPlanData?.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Monthly Price:</span>
              <span className="font-medium">{formatCurrency(selectedPlanData?.price || 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Payment Method:</span>
              <span className="font-medium capitalize">
                {paymentMethod === "apple_pay" ? "Apple Pay" : "Credit Card"}
              </span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span>{formatCurrency(selectedPlanData?.price || 0)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          onClick={handlePayment}
          disabled={isLoading}
          className="bg-slate-900 hover:bg-slate-800 text-white"
        >
          {isLoading ? "Processing..." : `Subscribe to ${selectedPlanData?.name}`}
        </Button>
      </div>

      {/* Security Notice */}
      <div className="text-center text-sm text-slate-500">
        <p>🔒 Your payment is secure and encrypted</p>
        <p>Powered by Stripe • Cancel anytime</p>
      </div>
    </div>
  )
} 