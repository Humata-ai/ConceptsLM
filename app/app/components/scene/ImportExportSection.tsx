'use client'

import { useState, useRef, useCallback } from 'react'
import { useQualityDomain } from '@/app/store'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import DownloadIcon from '@mui/icons-material/Download'
import UploadFileIcon from '@mui/icons-material/UploadFile'

export default function ImportExportSection() {
  const { state, addDomain, deleteDomain, selectDomain, addConcept, deleteConcept } = useQualityDomain()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Custom replacer to handle Infinity values and filter out selection state
  const getFormattedState = () =>
    JSON.stringify(state, (key, value) => {
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

  const handleDownload = () => {
    try {
      const json = getFormattedState()
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `conceptslm-state-${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setSuccess('State downloaded!')
      setTimeout(() => setSuccess(null), 2000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      setError(`Failed to download: ${errorMessage}`)
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

  const importFromJson = (jsonString: string) => {
    setError(null)
    setSuccess(null)

    try {
      const parsed = JSON.parse(jsonString)

      if (!validateState(parsed)) {
        return
      }

      // Clear existing domains
      state.scene.domains.forEach((domain) => {
        deleteDomain(domain.id)
      })

      // Clear existing concepts
      state.scene.concepts.forEach((concept) => {
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
      setTimeout(() => setSuccess(null), 2000)
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError(`Invalid JSON syntax: ${err.message}`)
      } else {
        setError(`Import failed: ${err instanceof Error ? err.message : String(err)}`)
      }
    }
  }

  const handleFileRead = useCallback((file: File) => {
    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      setError('Please upload a JSON file')
      setTimeout(() => setError(null), 5000)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result
      if (typeof text === 'string') {
        importFromJson(text)
      }
    }
    reader.onerror = () => {
      setError('Failed to read file')
      setTimeout(() => setError(null), 5000)
    }
    reader.readAsText(file)
  }, [state, deleteDomain, deleteConcept, addDomain, addConcept, selectDomain])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileRead(file)
    }
    // Reset so the same file can be re-uploaded
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileRead(file)
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

      {/* Export */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
        }}
      >
        <Typography variant="subtitle2" color="text.secondary">
          Export State
        </Typography>
        <Button
          onClick={handleDownload}
          variant="outlined"
          size="small"
          startIcon={<DownloadIcon />}
          sx={{ textTransform: 'none' }}
        >
          Download
        </Button>
      </Box>

      {/* Import */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        Import State
      </Typography>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileInput}
        style={{ display: 'none' }}
      />

      {/* Drop zone */}
      <Box
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        sx={{
          border: '2px dashed',
          borderColor: isDragOver ? 'primary.main' : 'grey.300',
          borderRadius: 1,
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: isDragOver ? 'primary.50' : 'grey.50',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: 'primary.light',
            bgcolor: 'grey.100',
          },
        }}
      >
        <UploadFileIcon sx={{ fontSize: 32, color: isDragOver ? 'primary.main' : 'grey.400', mb: 1 }} />
        <Typography variant="body2" color="text.secondary">
          Drag & drop a JSON file here
        </Typography>
        <Typography variant="caption" color="text.disabled">
          or click to browse
        </Typography>
      </Box>
    </Box>
  )
}
