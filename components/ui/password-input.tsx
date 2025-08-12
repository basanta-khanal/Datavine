"use client"

import React, { useState } from 'react'
import { Input } from './input'
import { Button } from './button'
import { Eye, EyeOff } from 'lucide-react'

interface PasswordInputProps {
  id: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  autoComplete?: string
  required?: boolean
  minLength?: number
  'aria-describedby'?: string
  error?: boolean
}

export function PasswordInput({
  id,
  placeholder = "Password",
  value,
  onChange,
  className = "",
  autoComplete = "current-password",
  required = false,
  minLength,
  'aria-describedby': ariaDescribedBy,
  error = false
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`pr-10 ${className} ${error ? "border-red-300 focus:border-red-500" : ""}`}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
        aria-describedby={ariaDescribedBy}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={togglePasswordVisibility}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4 text-slate-500" />
        ) : (
          <Eye className="h-4 w-4 text-slate-500" />
        )}
      </Button>
    </div>
  )
}
