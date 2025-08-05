'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Brain } from 'lucide-react'

interface TestErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface TestErrorBoundaryProps {
  children: React.ReactNode
  onReset?: () => void
}

export class TestErrorBoundary extends React.Component<TestErrorBoundaryProps, TestErrorBoundaryState> {
  constructor(props: TestErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): TestErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Test Error Boundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-red-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Brain className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Test Error</h2>
            <p className="text-slate-600 mb-6">
              Something went wrong during the assessment. Please try again or contact support if the problem persists.
            </p>
            <div className="space-y-3">
              <Button onClick={this.handleReset} className="w-full bg-slate-900 hover:bg-slate-800 text-white">
                Restart Assessment
              </Button>
              <Button 
                onClick={() => window.location.href = '/'} 
                variant="outline" 
                className="w-full"
              >
                Go to Home
              </Button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-slate-500">Error Details (Development)</summary>
                <pre className="mt-2 p-3 bg-slate-100 rounded text-xs text-slate-700 overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
} 