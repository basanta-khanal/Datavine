'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { apiClient } from '@/lib/api'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
    general: ''
  })
  
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      toast({
        title: "Invalid Reset Link",
        description: "This password reset link is invalid or has expired.",
        variant: "destructive",
      })
      router.push('/')
    }
  }, [token, router, toast])

  const validatePassword = (password: string): string => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long'
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter'
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter'
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number'
    }
    return ''
  }

  const validateConfirmPassword = (password: string, confirmPassword: string): string => {
    if (password !== confirmPassword) {
      return 'Passwords do not match'
    }
    return ''
  }

  const clearErrors = () => {
    setErrors({
      password: '',
      confirmPassword: '',
      general: ''
    })
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: '' }))
    }
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
    if (errors.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    clearErrors()

    // Validate password
    const passwordError = validatePassword(password)
    if (passwordError) {
      setErrors(prev => ({ ...prev, password: passwordError }))
      setIsSubmitting(false)
      return
    }

    // Validate confirm password
    const confirmPasswordError = validateConfirmPassword(password, confirmPassword)
    if (confirmPasswordError) {
      setErrors(prev => ({ ...prev, confirmPassword: confirmPasswordError }))
      setIsSubmitting(false)
      return
    }

    try {
      const response = await apiClient.resetPassword(token!, password)
      if (response.success) {
        toast({
          title: "Password Reset Successfully",
          description: "Your password has been reset. You can now sign in with your new password.",
        })
        router.push('/')
      } else {
        setErrors(prev => ({ ...prev, general: response.message || "Failed to reset password" }))
      }
    } catch (error) {
      console.error('Reset password error:', error)
      setErrors(prev => ({ ...prev, general: "Failed to reset password. Please try again." }))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!token) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Reset Your Password</h1>
          <p className="text-slate-600">Enter your new password below</p>
        </div>

        {/* General error message */}
        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              New Password
            </label>
            <Input
              type="password"
              id="password"
              placeholder="Enter new password"
              value={password}
              onChange={handlePasswordChange}
              className={errors.password ? "border-red-300 focus:border-red-500" : ""}
              required
              minLength={8}
              autoComplete="new-password"
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            {errors.password && (
              <p id="password-error" className="text-sm text-red-600 mt-1" role="alert">{errors.password}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
              Confirm New Password
            </label>
            <Input
              type="password"
              id="confirmPassword"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className={errors.confirmPassword ? "border-red-300 focus:border-red-500" : ""}
              required
              minLength={8}
              autoComplete="new-password"
              aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
            />
            {errors.confirmPassword && (
              <p id="confirm-password-error" className="text-sm text-red-600 mt-1" role="alert">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="p-3 bg-slate-50 rounded text-xs text-slate-600">
            <p className="font-medium mb-1">Password requirements:</p>
            <ul className="space-y-1">
              <li className={password.length >= 8 ? "text-green-600" : ""}>
                • At least 8 characters
              </li>
              <li className={/(?=.*[a-z])/.test(password) ? "text-green-600" : ""}>
                • One lowercase letter
              </li>
              <li className={/(?=.*[A-Z])/.test(password) ? "text-green-600" : ""}>
                • One uppercase letter
              </li>
              <li className={/(?=.*\d)/.test(password) ? "text-green-600" : ""}>
                • One number
              </li>
            </ul>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-slate-900 hover:bg-slate-800 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Resetting Password...
              </div>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/')} 
            className="text-slate-600"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
} 