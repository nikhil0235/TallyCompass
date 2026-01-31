// Backend API integration for media operations
import { validateImageFile } from './cloudinary'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'

// Upload media to backend (which handles Cloudinary)
export const uploadMediaToBackend = async (file, title = '') => {
  try {
    validateImageFile(file)
    
    const formData = new FormData()
    formData.append('media', file)
    formData.append('title', title || file.name)

    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/media/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`)
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    console.error('Backend upload error:', error)
    throw error
  }
}

// Get all media from backend
export const getAllMediaFromBackend = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/media/media`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error(`Fetch failed: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Backend fetch error:', error)
    throw error
  }
}

// Delete media from backend
export const deleteMediaFromBackend = async (mediaId) => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/media/media/${mediaId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error(`Delete failed: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Backend delete error:', error)
    throw error
  }
}

// Create VOC with media
export const createVOCWithMedia = async (vocData, uploadedMedia = []) => {
  try {
    const mediaList = uploadedMedia.map(media => ({
      mediaType: media.resourceType || 'image',
      mediaDescription: media.title || 'Uploaded media',
      mediaURL: media.imageUrl
    }))

    const vocPayload = {
      ...vocData,
      mediaList
    }

    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/voc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(vocPayload)
    })

    if (!response.ok) {
      throw new Error(`VOC creation failed: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('VOC creation error:', error)
    throw error
  }
}

// Upload multiple files and create VOC
export const uploadAndCreateVOC = async (files, vocData) => {
  try {
    // Upload all files first
    const uploadPromises = Array.from(files).map(file => 
      uploadMediaToBackend(file, file.name)
    )
    const uploadedMedia = await Promise.all(uploadPromises)

    // Create VOC with uploaded media
    return await createVOCWithMedia(vocData, uploadedMedia)
  } catch (error) {
    console.error('Upload and create VOC error:', error)
    throw error
  }
}