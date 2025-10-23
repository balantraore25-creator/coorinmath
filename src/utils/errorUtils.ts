import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { SerializedError } from '@reduxjs/toolkit'

/**
 * Type guard pour vérifier si l'erreur est un FetchBaseQueryError
 */
export function isFetchBaseQueryError(
  error: unknown
): error is FetchBaseQueryError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'data' in error
  )
}

/**
 * Type guard pour vérifier si l'erreur est un SerializedError
 */
export function isSerializedError(
  error: unknown
): error is SerializedError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'name' in error
  )
}

/**
 * Fonction utilitaire pour extraire un message d'erreur lisible
 */
export function getErrorMessage(error: unknown): string {
  if (isFetchBaseQueryError(error)) {
    if (typeof error.data === 'string') return error.data
    if (typeof error.data === 'object' && error.data !== null && 'message' in error.data) {
      return String((error.data as { message?: unknown }).message)
    }
    return `Erreur HTTP ${error.status}`
  }

  if (isSerializedError(error)) {
    return error.message || 'Erreur inconnue'
  }

  return 'Une erreur inattendue est survenue'
}
