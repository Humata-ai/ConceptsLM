'use client'

import { useState, useCallback } from 'react'
import { useToast } from '@/app/components/ToastProvider'

interface DomainNameInputProps {
  value: string
  onChange: (value: string) => void
}

const DOMAIN_SUFFIX = ' Domain'

function hasDomainSuffix(value: string): boolean {
  return value.trimEnd().toLowerCase().endsWith('domain')
}

export default function DomainNameInput({ value, onChange }: DomainNameInputProps) {
  const { showToast } = useToast()
  const [isFocused, setIsFocused] = useState(false)

  const handleBlur = useCallback(() => {
    setIsFocused(false)
    const trimmed = value.trim()
    if (trimmed.length === 0) return
    if (hasDomainSuffix(trimmed)) return

    onChange(trimmed + DOMAIN_SUFFIX)
    showToast('Added postfix of "Domain"')
  }, [value, onChange, showToast])

  const handleFocus = useCallback(() => {
    setIsFocused(true)
  }, [])

  return (
    <div>
      <label htmlFor="domain-name" className="block text-sm font-medium mb-1">
        Domain name
      </label>
      <input
        id="domain-name"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={handleBlur}
        onFocus={handleFocus}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        placeholder="e.g., Temperature Range"
        required
      />
    </div>
  )
}
