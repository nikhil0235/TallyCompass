import { useState, useCallback } from 'react'
import { uploadMediaToBackend, deleteMediaFromBackend, getAllMediaFromBackend } from '../utils/imageDb'

export const useMediaManager = () => {
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load all media from backend
  const loadMedia = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await getAllMediaFromBackend()
      setMedia(result || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Upload new media
  const uploadMedia = useCallback(async (file, title = '') => {
    setLoading(true)
    setError(null)

    try {
      const result = await uploadMediaToBackend(file, title)
      setMedia(prev => [result, ...prev])
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Delete media
  const deleteMedia = useCallback(async (mediaId) => {
    setLoading(true)
    setError(null)

    try {
      await deleteMediaFromBackend(mediaId)
      setMedia(prev => prev.filter(item => item._id !== mediaId))
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Clear all media
  const clearMedia = useCallback(() => {
    setMedia([])
    setError(null)
  }, [])

  return {
    media,
    loading,
    error,
    loadMedia,
    uploadMedia,
    deleteMedia,
    clearMedia,
    setError
  }
}