import { 
  Box, Card, CardContent, Typography, Chip, Button, 
  IconButton, Alert
} from '@mui/material'
import { 
  CloudUpload as CloudUploadIcon, 
  Description as FileIcon, Delete as DeleteIcon
} from '@mui/icons-material'
import { useState } from 'react'

const MediaUploadStep = ({ uploadedFiles, setUploadedFiles, setFormData, theme }) => {
  const [uploadError, setUploadError] = useState(null)

  const handleFileUpload = (e) => {
    try {
      const files = Array.from(e.target.files)
      const validFiles = files.filter(file => {
        if (file.size > 10 * 1024 * 1024) {
          setUploadError(`File ${file.name} is too large (max 10MB)`)
          return false
        }
        return true
      })
      
      if (validFiles.length > 0) {
        const newFiles = validFiles.map(file => ({
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          file: file
        }))
        setUploadedFiles(prev => [...prev, ...newFiles])
        setFormData(prev => ({
          ...prev,
          mediaList: [...prev.mediaList, ...newFiles.map(f => ({ fileName: f.name, fileSize: f.size, fileType: f.type }))]
        }))
        setUploadError(null)
      }
    } catch (error) {
      setUploadError('Failed to upload files')
    }
  }

  const handleFileDelete = (fileId, fileName) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
    setFormData(prev => ({
      ...prev,
      mediaList: prev.mediaList.filter(m => m.fileName !== fileName)
    }))
  }

  return (
    <Box sx={{ p: 1.5, borderTop: `2px solid ${theme.palette.divider}` }}>
      <Card sx={{ 
        borderRadius: '12px', 
        boxShadow: `0 4px 16px ${theme.palette.secondary.main}08`,
        border: `1px solid ${theme.palette.secondary.main}15`,
        background: theme.palette.background.paper,
        overflow: 'hidden'
      }}>


        <CardContent sx={{ p: 2, pt: 2.5 }}>
          {uploadError && (
            <Alert severity="error" onClose={() => setUploadError(null)} sx={{ mb: 1.5, py: 0.5 }}>
              {uploadError}
            </Alert>
          )}

          <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5, alignItems: 'center' }}>
            <Chip
              label={`${uploadedFiles.length} Files`}
              size="small"
              sx={{
                height: '20px',
                fontSize: '0.7rem',
                backgroundColor: uploadedFiles.length > 0 ? theme.palette.secondary.main : theme.palette.grey[300],
                color: 'white',
                fontWeight: 600
              }}
            />
          </Box>

          <Card sx={{
            p: 2,
            borderRadius: '8px',
            border: `1px dashed ${theme.palette.secondary.main}40`,
            textAlign: 'center',
            mb: 1.5,
            '&:hover': {
              borderColor: theme.palette.secondary.main,
              backgroundColor: theme.palette.secondary.main + '05'
            }
          }}>
            <input
              type="file"
              multiple
              accept="*/*"
              style={{ display: 'none' }}
              id="file-upload"
              onChange={handleFileUpload}
            />
            <label htmlFor="file-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<CloudUploadIcon sx={{ fontSize: 16 }} />}
                size="small"
                sx={{
                  borderRadius: '6px',
                  textTransform: 'none',
                  fontSize: '0.8rem',
                  backgroundColor: theme.palette.secondary.main,
                  mb: 0.5,
                  py: 0.5
                }}
              >
                Upload Files
              </Button>
            </label>
            <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontSize: '0.65rem' }}>
              All file types • Max 10MB per file
            </Typography>
          </Card>

          {uploadedFiles.length > 0 && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.8rem' }}>
                Uploaded Files ({uploadedFiles.length})
              </Typography>
              <Box sx={{ display: 'grid', gap: 0.75 }}>
                {uploadedFiles.map((file) => (
                  <Card key={file.id} sx={{ 
                    p: 1,
                    borderRadius: '6px',
                    border: `1px solid ${theme.palette.divider}`,
                    '&:hover': {
                      boxShadow: `0 1px 4px ${theme.palette.secondary.main}25`
                    }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FileIcon sx={{ color: theme.palette.secondary.main, fontSize: 16 }} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ 
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {file.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => handleFileDelete(file.id, file.name)}
                        sx={{ 
                          color: theme.palette.error.main,
                          padding: 0.25,
                          '&:hover': { backgroundColor: theme.palette.error.main + '08' }
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Box>
                  </Card>
                ))}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default MediaUploadStep