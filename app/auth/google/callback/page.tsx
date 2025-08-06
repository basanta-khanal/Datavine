'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export default function GoogleCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const code = searchParams.get('code')
        const error = searchParams.get('error')

        if (error) {
          setStatus('error')
          setMessage('Google authentication was cancelled or failed.')
          return
        }

        if (!code) {
          setStatus('error')
          setMessage('No authorization code received from Google.')
          return
        }

        // Exchange code for user info and authenticate
        const response = await fetch('/api/auth/google/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        const data = await response.json();

        if (data.success) {
          setStatus('success')
          setMessage('Google authentication successful! Redirecting...')
          
          // Send message to parent window (popup)
          if (window.opener) {
            window.opener.postMessage({
              type: 'GOOGLE_AUTH_SUCCESS',
              user: data.user,
              token: data.token
            }, window.location.origin)
            window.close()
          } else {
            // Fallback: redirect to home
            setTimeout(() => {
              router.push('/')
            }, 2000)
          }
        } else {
          throw new Error(data.message || 'Authentication failed')
        }

      } catch (error) {
        console.error('Google callback error:', error)
        setStatus('error')
        setMessage('An error occurred during authentication.')
      }
    }

    handleGoogleCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          {status === 'loading' && (
            <>
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-slate-900" />
              <h1 className="text-xl font-semibold text-slate-900 mb-2">
                Processing Google Authentication
              </h1>
              <p className="text-slate-600">Please wait while we complete your sign-in...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-slate-900 mb-2">Authentication Successful!</h1>
              <p className="text-slate-600">{message}</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-slate-900 mb-2">Authentication Failed</h1>
              <p className="text-slate-600 mb-4">{message}</p>
              <Button 
                onClick={() => window.close()} 
                className="bg-slate-900 hover:bg-slate-800"
              >
                Close Window
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}