import React, { useState, useCallback } from 'react'
import { Box, Button, Typography, CircularProgress, Alert } from '@mui/material'
import { CloudUpload, Delete } from '@mui/icons-material'
import { validateImageFile } from '../utils/cloudinary'
import { uploadMediaToBackend } from '../utils/imageDb'

const MediaUpload = ({ 
  onUpload, 
  onDelete, 
  multiple = false, 
  maxFiles = 5,
  currentMedia = [],
  disabled = false 
}) => {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFileSelect = useCallback(async (files) => {
    if (disabled) return
    
    setError(null)
    setUploading(true)

    try {
      const fileArray = Array.from(files)
      
      if (!multiple && fileArray.length > 1) {
        throw new Error('Only one file allowed')
      }

      if (currentMedia.length + fileArray.length > maxFiles) {
        throw new Error(`Maximum ${maxFiles} files allowed`)
      }

      const uploadPromises = fileArray.map(async (file) => {
        validateImageFile(file)
        return await uploadMediaToBackend(file, file.name)
      })

      const results = await Promise.all(uploadPromises)
      onUpload(multiple ? results : results[0])
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }, [disabled, multiple, maxFiles, currentMedia.length, onUpload])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }, [handleFileSelect])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  return (
    <Box>
      <Box
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        sx={{
          border: `2px dashed ${dragOver ? '#1976d2' : '#ccc'}`,
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          backgroundColor: dragOver ? '#f5f5f5' : 'transparent',
          transition: 'all 0.3s ease'
        }}
      >
        <input
          type="file"
          multiple={multiple}
          accept="image/*,video/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          style={{ display: 'none' }}
          id="media-upload"
          disabled={disabled}
        />
        
        <label htmlFor="media-upload" style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}>
          <CloudUpload sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {uploading ? 'Uploading...' : 'Drop media here or click to upload'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {multiple ? `Up to ${maxFiles} files` : 'Single file'} • Images & Videos • Max 10MB
          </Typography>
        </label>

        {uploading && (
          <Box sx={{ mt: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {currentMedia.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Uploaded Media ({currentMedia.length})
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {currentMedia.map((media, index) => (
              <Box key={media._id || index} sx={{ position: 'relative' }}>
                <img
                  src={media.imageUrl}
                  alt={media.title || `Upload ${index + 1}`}
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: 'cover',
                    borderRadius: 8
                  }}
                />
                <Button
                  size="small"
                  onClick={() => onDelete(media._id || index)}
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    minWidth: 24,
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: 'error.main',
                    color: 'white',
                    '&:hover': { backgroundColor: 'error.dark' }
                  }}
                >
                  <Delete sx={{ fontSize: 14 }} />
                </Button>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default MediaUpload