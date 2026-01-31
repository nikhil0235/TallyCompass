// Cloudinary configuration and utilities
const CLOUDINARY_CLOUD_NAME = 'dstu23eod'
const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'ml_default'
const CLOUDINARY_API_KEY = '979189689421184'
const CLOUDINARY_API_SECRET = 'zWZL4-l-VuJuuX-_yg21GtwZnnA'

const CLOUDINARY_BASE_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}`

// Upload image to Cloudinary
export const uploadImage = async (file) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME)

    const response = await fetch(`${CLOUDINARY_BASE_URL}/image/upload`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
      format: data.format
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw error
  }
}

// Get optimized image URL
export const getOptimizedImageUrl = (publicId, options = {}) => {
  const {
    width = 'auto',
    height = 'auto',
    crop = 'fill',
    quality = 'auto',
    format = 'auto'
  } = options

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/w_${width},h_${height},c_${crop},q_${quality},f_${format}/${publicId}`
}

// Delete image from Cloudinary
export const deleteImage = async (publicId) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000)
    const signature = await generateSignature(publicId, timestamp)

    const formData = new FormData()
    formData.append('public_id', publicId)
    formData.append('signature', signature)
    formData.append('api_key', CLOUDINARY_API_KEY)
    formData.append('timestamp', timestamp)

    const response = await fetch(`${CLOUDINARY_BASE_URL}/image/destroy`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error(`Delete failed: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    throw error
  }
}

// Generate signature for authenticated requests (requires backend)
const generateSignature = async (publicId, timestamp) => {
  // This should be done on your backend for security
  // For now, return empty string - implement backend endpoint
  console.warn('Signature generation should be done on backend')
  return ''
}

// Validate image file
export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  const maxSize = 10 * 1024 * 1024 // 10MB

  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload JPEG, PNG, GIF, or WebP images.')
  }

  if (file.size > maxSize) {
    throw new Error('File too large. Please upload images smaller than 10MB.')
  }

  return true
}

// Upload multiple images
export const uploadMultipleImages = async (files) => {
  try {
    const uploadPromises = Array.from(files).map(file => {
      validateImageFile(file)
      return uploadImage(file)
    })

    return await Promise.all(uploadPromises)
  } catch (error) {
    console.error('Multiple upload error:', error)
    throw error
  }
}