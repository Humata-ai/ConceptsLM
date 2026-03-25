'use client'

import { useState } from 'react'
import { useQualityDomain } from '@/app/store'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import FileUploadIcon from '@mui/icons-material/FileUpload'

export default function ImportExportSection() {
  const { state, addDomain, deleteDomain, selectDomain, addConcept, deleteConcept } = useQualityDomain()
  const [jsonInput, setJsonInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Custom replacer to handle Infinity values and filter out selection state
  const formattedState = JSON.stringify(state, (key, value) => {
    if (
      key === 'selectedDomainId' ||
      key === 'selectedLabelId' ||
      key === 'selectedLabelDomainId' ||
      key === 'selectedConceptId'
    ) {
      return undefined
    }
    if (value === Infinity) return 'Infinity'
    if (value === -Infinity) return '-Infinity'
    return value
  }, 2)

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(formattedState)
        setSuccess('Copied to clipboard!')
        setTimeout(() => setSuccess(null), 2000)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = formattedState
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()

        try {
          const successful = document.execCommand('copy')
          document.body.removeChild(textArea)
          if (successful) {
            setSuccess('Copied to clipboard!')
            setTimeout(() => setSuccess(null), 2000)
          } else {
            throw new Error('Copy command failed')
          }
        } catch (err) {
          document.body.removeChild(textArea)
          throw err
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      setError(`Failed to copy: ${errorMessage}`)
      setTimeout(() => setError(null), 5000)
    }
  }

  const validateState = (data: any): boolean => {
    if (!data || typeof data !== 'object') {
      setError('Invalid JSON: must be an object')
      return false
    }

    if (!Array.isArray(data.domains)) {
      setError("Invalid state: missing 'domains' array")
      return false
    }

    for (let i = 0; i < data.domains.length; i++) {
      const domain = data.domains[i]

      if (!domain.id || typeof domain.id !== 'string') {
        setError(`Invalid domain at index ${i}: missing or invalid 'id'`)
        return false
      }

      if (!domain.name || typeof domain.name !== 'string') {
        setError(`Invalid domain at index ${i}: missing or invalid 'name'`)
        return false
      }

      if (!Array.isArray(domain.dimensions)) {
        setError(`Invalid domain at index ${i}: 'dimensions' must be an array`)
        return false
      }

      if (!domain.createdAt) {
        setError(`Invalid domain at index ${i}: missing 'createdAt'`)
        return false
      }

      for (let j = 0; j < domain.dimensions.length; j++) {
        const dim = domain.dimensions[j]

        if (!dim.id || typeof dim.id !== 'string') {
          setError(`Invalid dimension at domain ${i}, dimension ${j}: missing or invalid 'id'`)
          return false
        }

        if (!dim.name || typeof dim.name !== 'string') {
          setError(`Invalid dimension at domain ${i}, dimension ${j}: missing or invalid 'name'`)
          return false
        }

        if (!Array.isArray(dim.range) || dim.range.length !== 2) {
          setError(`Invalid dimension at domain ${i}, dimension ${j}: 'range' must be an array of 2 values`)
          return false
        }

        const isValidRangeValue = (val: any) =>
          typeof val === 'number' || val === 'Infinity' || val === '-Infinity'

        if (!isValidRangeValue(dim.range[0]) || !isValidRangeValue(dim.range[1])) {
          setError(`Invalid dimension at domain ${i}, dimension ${j}: 'range' values must be numbers or "Infinity"`)
          return false
        }

        const min = dim.range[0] === 'Infinity' ? Infinity : dim.range[0] === '-Infinity' ? -Infinity : dim.range[0]
        const max = dim.range[1] === 'Infinity' ? Infinity : dim.range[1] === '-Infinity' ? -Infinity : dim.range[1]

        if (min >= max) {
          setError(`Invalid dimension at domain ${i}, dimension ${j}: range[0] must be less than range[1]`)
          return false
        }
      }
    }

    return true
  }

  const handleImport = () => {
    setError(null)
    setSuccess(null)

    try {
      const parsed = JSON.parse(jsonInput)

      if (!validateState(parsed)) {
        return
      }

      // Clear existing domains
      state.domains.forEach((domain) => {
        deleteDomain(domain.id)
      })

      // Clear existing concepts
      state.concepts.forEach((concept) => {
        deleteConcept(concept.id)
      })

      // Add new domains with converted dates and Infinity values
      parsed.domains.forEach((domain: any) => {
        addDomain({
          ...domain,
          createdAt: new Date(domain.createdAt),
          dimensions: domain.dimensions.map((dim: any) => {
            const convertValue = (val: any) => {
              if (val === 'Infinity') return Infinity
              if (val === '-Infinity') return -Infinity
              return val
            }

            return {
              ...dim,
              range: [convertValue(dim.range[0]), convertValue(dim.range[1])] as const
            }
          })
        })
      })

      // Add new concepts with converted dates
      if (parsed.concepts && Array.isArray(parsed.concepts)) {
        parsed.concepts.forEach((concept: any) => {
          addConcept({
            ...concept,
            createdAt: new Date(concept.createdAt)
          })
        })
      }

      selectDomain(null)

      setSuccess('State imported successfully!')
      setJsonInput('')
      setTimeout(() => setSuccess(null), 2000)
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError(`Invalid JSON syntax: ${err.message}`)
      } else {
        setError(`Import failed: ${err instanceof Error ? err.message : String(err)}`)
      }
    }
  }

  return (
    <Box sx={{ px: 2, py: 2 }}>
      {/* Status Messages */}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Summary */}
      <Box sx={{ mb: 2, p: 1.5, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'grey.200' }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
          Domains: {state.domains.length} &middot; Labels:{' '}
          {state.domains.reduce((total, d) => total + d.labels.length, 0)} &middot; Concepts:{' '}
          {state.concepts.length}
        </Typography>
      </Box>

      {/* Export */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        Export State
      </Typography>
      <Box
        sx={{
          bgcolor: 'grey.50',
          border: '1px solid',
          borderColor: 'grey.200',
          borderRadius: 1,
          p: 1,
          maxHeight: 200,
          overflow: 'auto',
          mb: 1
        }}
      >
        <pre style={{ margin: 0, fontSize: '10px', fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
          {formattedState}
        </pre>
      </Box>
      <Button
        onClick={handleCopy}
        variant="outlined"
        size="small"
        fullWidth
        startIcon={<ContentCopyIcon />}
        sx={{ textTransform: 'none', mb: 3 }}
      >
        Copy to clipboard
      </Button>

      {/* Import */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        Import State
      </Typography>
      <TextField
        multiline
        minRows={4}
        maxRows={8}
        fullWidth
        value={jsonInput}
        onChange={(e) => {
          setJsonInput(e.target.value)
          setError(null)
        }}
        placeholder="Paste JSON here..."
        size="small"
        sx={{
          mb: 1,
          '& .MuiInputBase-input': {
            fontFamily: 'monospace',
            fontSize: '11px'
          }
        }}
      />
      <Button
        onClick={handleImport}
        disabled={!jsonInput.trim()}
        variant="contained"
        size="small"
        fullWidth
        startIcon={<FileUploadIcon />}
        sx={{ textTransform: 'none' }}
      >
        Import
      </Button>
    </Box>
  )
}
