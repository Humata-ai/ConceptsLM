/**
 * Validation Utilities
 * 
 * Reusable validation functions for forms
 */

export type ValidationError = string
export type Validator<T> = (value: T) => ValidationError | null

/**
 * Validate that a string field is not empty
 */
export function required(fieldName: string): Validator<string> {
  return (value: string) => {
    if (!value || !value.trim()) {
      return `${fieldName} is required`
    }
    return null
  }
}

/**
 * Validate that an array has at least one element
 */
export function arrayMinLength<T>(
  fieldName: string,
  minLength: number = 1
): Validator<T[]> {
  return (value: T[]) => {
    if (!value || value.length < minLength) {
      return `At least ${minLength} ${fieldName} ${minLength === 1 ? 'is' : 'are'} required`
    }
    return null
  }
}

/**
 * Validate that a number is within a range
 */
export function numberInRange(
  fieldName: string,
  min: number,
  max: number
): Validator<number> {
  return (value: number) => {
    if (value < min || value > max) {
      return `${fieldName} must be between ${min} and ${max}`
    }
    return null
  }
}

/**
 * Validate that a range [min, max] is valid (min < max)
 */
export function validRange(
  fieldName: string
): Validator<readonly [number, number]> {
  return (value: readonly [number, number]) => {
    const [min, max] = value
    if (min >= max) {
      return `${fieldName}: Min must be less than Max`
    }
    return null
  }
}

/**
 * Compose multiple validators
 */
export function compose<T>(...validators: Validator<T>[]): Validator<T> {
  return (value: T) => {
    for (const validator of validators) {
      const error = validator(value)
      if (error) return error
    }
    return null
  }
}

/**
 * Run all validators and collect errors
 * 
 * @param validations - Array of tuples [value, validator]
 * @returns Array of error messages
 */
export function collectErrors<T>(
  validations: Array<[T, Validator<T>]>
): string[] {
  const errors: string[] = []
  
  for (const [value, validator] of validations) {
    const error = validator(value)
    if (error) {
      errors.push(error)
    }
  }
  
  return errors
}

/**
 * Validate all items in an array with a validator
 * 
 * @param items - Array of items to validate
 * @param validator - Validator function
 * @param itemName - Name for error messages (e.g., "Dimension")
 * @returns Array of error messages
 */
export function validateArray<T>(
  items: T[],
  validator: Validator<T>,
  itemName: string
): string[] {
  const errors: string[] = []
  
  items.forEach((item, index) => {
    const error = validator(item)
    if (error) {
      errors.push(`${itemName} ${index + 1}: ${error}`)
    }
  })
  
  return errors
}
