import React, { useState, useRef, useEffect } from 'react'
import getCaretCoordinates from 'textarea-caret';
import { Box, Typography, IconButton, Dialog, DialogContent, DialogTitle, List, ListItemButton, ListItemText, Paper, Avatar, Divider } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useSelector, useDispatch } from 'react-redux'
import { Editor } from '@tinymce/tinymce-react'
import { Fullscreen, FullscreenExit, Person } from '@mui/icons-material'
import { setUsers, fetchUsers } from '../../store/slices/userListSlice'
import userService from '../../services/userService'

const MarkdownEditor = ({
  value = '',
  onChange = () => {},
  placeholder = 'Enter text...',
  error = false,
  helperText = '',
  disabled = false,
  height = 300,
  users = []
}) => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const userListState = useSelector(state => {
    console.log('Full Redux state:', state)
    console.log('UserList state:', state.userList)
    console.log('UserList users:', state.userList?.users)
    return state.userList || { users: [], loading: false, error: null }
  })
  const { users: reduxUsers, loading, error: reduxError } = userListState
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showMentions, setShowMentions] = useState(false)
  const [mentionQuery, setMentionQuery] = useState('')
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 })
  const editorRef = useRef(null)

  useEffect(() => {
    console.log('Redux state changed:', { reduxUsers, length: reduxUsers?.length })
  }, [reduxUsers])

  useEffect(() => {
    const loadUsers = async () => {
      console.log('Loading users...', { reduxUsers, length: reduxUsers?.length })
      if (!reduxUsers || reduxUsers.length === 0) {
        console.log('Dispatching fetchUsers thunk')
        dispatch(fetchUsers())
      } else {
        console.log('Users already exist in Redux:', reduxUsers)
      }
    }
    loadUsers()
  }, [dispatch])

  const userMentions = reduxUsers || []

  console.log('Redux Users:', reduxUsers)
  console.log('User Mentions:', userMentions)

  const filteredUsers = userMentions.filter(user => 
    user.userName.toLowerCase().includes(mentionQuery.toLowerCase())
  )

  const handleEditorChange = (content) => {
    onChange(content)
    
    // Get plain text content without HTML tags
    const plainText = content.replace(/<[^>]*>/g, '')
    const lastAtIndex = plainText.lastIndexOf('@')
    
    if (lastAtIndex !== -1) {
      const afterAt = plainText.substring(lastAtIndex + 1)
      // Show mentions if @ is at end or followed by letters only
      if (afterAt === '' || /^[a-zA-Z]*$/.test(afterAt)) {
        setShowMentions(true)
        setMentionQuery(afterAt)
        // Calculate caret position for dropdown
        setTimeout(() => {
          if (editorRef.current) {
            const iframe = editorRef.current.iframeElement || editorRef.current.getDoc()?.defaultView?.frameElement;
            if (iframe) {
              const win = iframe.contentWindow;
              const sel = win.getSelection();
              if (sel && sel.rangeCount > 0) {
                const range = sel.getRangeAt(0).cloneRange();
                const rect = range.getClientRects()[0];
                if (rect) {
                  // Get iframe position relative to page
                  const iframeRect = iframe.getBoundingClientRect();
                  setMentionPosition({
                    top: rect.bottom + iframeRect.top + window.scrollY,
                    left: rect.left + iframeRect.left + window.scrollX
                  });
                }
              }
            }
          }
        }, 0);
      } else {
        setShowMentions(false)
      }
    } else {
      setShowMentions(false)
    }
  }

  const insertMention = (user) => {
    if (!editorRef.current) return
    
    try {
      const content = editorRef.current.getContent()
      const plainText = content.replace(/<[^>]*>/g, '')
      const lastAtIndex = plainText.lastIndexOf('@')
      
      if (lastAtIndex !== -1) {
        const beforeAt = plainText.substring(0, lastAtIndex)
        const afterAt = plainText.substring(lastAtIndex + 1)
        const afterMention = afterAt.replace(/^[a-zA-Z]*/, '')
        
        const newContent = `${beforeAt}@${user.userName}${afterMention}`
        editorRef.current.setContent(newContent)
        onChange(newContent)
      }
    } catch (err) {
      console.error('Error inserting mention:', err)
    }
    
    setShowMentions(false)
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        sx={{
          border: `1.5px solid ${error ? theme.palette.error.main : theme.palette.grey[300]}`,
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: 'white',
          transition: 'all 0.2s ease',
          position: 'relative',
          '&:hover': {
            borderColor: error ? theme.palette.error.main : theme.palette.primary.light,
            boxShadow: `0 4px 12px ${error ? theme.palette.error.main : theme.palette.primary.main}10`
          },
          '&:focus-within': {
            borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
            boxShadow: `0 8px 24px ${error ? theme.palette.error.main : theme.palette.primary.main}25`
          }
        }}
      >
        <IconButton
          onClick={() => setIsFullscreen(true)}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1000,
            backgroundColor: 'rgba(255,255,255,0.9)',
            '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
          }}
          size="small"
        >
          <Fullscreen fontSize="small" />
        </IconButton>
        
        <Editor
          apiKey="vrkussnx0tcror9jp3ozirnwqxr5quy3wfn07jlunq9phtkr"
          onInit={(evt, editor) => editorRef.current = editor}
          value={value}
          onEditorChange={handleEditorChange}
          disabled={disabled}
          init={{
            height,
            menubar: false,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'charmap', 'image',
              'anchor', 'searchreplace', 'visualblocks', 'code',
              'insertdatetime', 'table', 'help', 'wordcount'
            ],
            toolbar: 'undo redo | bold italic underline | forecolor backcolor | alignleft aligncenter alignright | bullist numlist | link | removeformat',
            content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px } .mention { background-color: #e3f2fd; color: #1976d2; padding: 2px 6px; border-radius: 4px; font-weight: 500; }',
            placeholder,
            branding: false,
            statusbar: false
          }}
        />
      </Box>

      {showMentions && (
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            top: `${mentionPosition.top}px`,
            left: `${mentionPosition.left}px`,
            width: 250,
            maxHeight: 200,
            overflow: 'auto',
            zIndex: 1300,
            border: `2px solid ${theme.palette.primary.main}`,
            boxShadow: 8
          }}
        >
          <List sx={{ py: 0 }}>
            {filteredUsers.map((user, index) => (
              <React.Fragment key={user._id}>
                <ListItemButton
                  onClick={() => insertMention(user)}
                  sx={{
                    py: 0.5,
                    px: 1,
                    minHeight: 44,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover
                    }
                  }}
                >
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      mr: 1,
                      bgcolor: theme.palette.primary.main,
                      fontSize: '10px'
                    }}
                  >
                    <Person fontSize="small" />
                  </Avatar>
                  <ListItemText
                    primary={user.userName}
                    secondary={
                      <>
                        <Typography variant="caption" sx={{ fontSize: '10px', color: 'text.secondary' }}>
                          {user.email}
                        </Typography>
                        <Typography variant="caption" sx={{ fontSize: '9px', color: 'text.disabled', display: 'block' }}>
                          {user.function}
                        </Typography>
                      </>
                    }
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 600, fontSize: '12px' }}
                  />
                </ListItemButton>
                {index < filteredUsers.length - 1 && <Divider sx={{ mx: 1.5 }} />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
      
      <Dialog
        open={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        maxWidth={false}
        fullScreen
        sx={{
          '& .MuiDialog-paper': {
            margin: 0,
            maxHeight: '100vh'
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Typography variant="h6">Full Screen Editor</Typography>
          <IconButton onClick={() => setIsFullscreen(false)}>
            <FullscreenExit />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 2, flex: 1, position: 'relative' }}>
          <Editor
            apiKey="vrkussnx0tcror9jp3ozirnwqxr5quy3wfn07jlunq9phtkr"
            value={value}
            onEditorChange={handleEditorChange}
            disabled={disabled}
            init={{
              height: 'calc(100vh - 120px)',
              menubar: false,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'charmap', 'image',
                'anchor', 'searchreplace', 'visualblocks', 'code',
                'insertdatetime', 'table', 'help', 'wordcount'
              ],
              toolbar: 'undo redo | blocks | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | table | code | removeformat | help',
              content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px } .mention { background-color: #e3f2fd; color: #1976d2; padding: 2px 6px; border-radius: 4px; font-weight: 500; }',
              placeholder,
              branding: false,
              statusbar: false
            }}
          />
          
          {showMentions && (
            <Paper
              elevation={8}
              sx={{
                position: 'absolute',
                top: '50px',
                right: '20px',
                width: 350,
                maxHeight: 300,
                overflow: 'auto',
                zIndex: 10000,
                border: `2px solid ${theme.palette.primary.main}`
              }}
            >
              <List sx={{ py: 0 }}>
                {filteredUsers.map((user, index) => (
                  <React.Fragment key={user._id}>
                    <ListItemButton
                      onClick={() => insertMention(user)}
                      sx={{
                        py: 0.75,
                        px: 1.5,
                        minHeight: 56,
                        '&:hover': {
                          backgroundColor: theme.palette.action.hover
                        }
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,
                          mr: 1.2,
                          bgcolor: theme.palette.primary.main,
                          fontSize: '12px'
                        }}
                      >
                        <Person fontSize="small" />
                      </Avatar>
                      <ListItemText
                        primary={user.userName}
                        secondary={
                          <>
                            <Typography variant="caption" sx={{ fontSize: '11px', color: 'text.secondary' }}>
                              {user.email}
                            </Typography>
                            <Typography variant="caption" sx={{ fontSize: '10px', color: 'text.disabled', display: 'block' }}>
                              {user.function}
                            </Typography>
                          </>
                        }
                        primaryTypographyProps={{ variant: 'body2', fontWeight: 600, fontSize: '13px' }}
                      />
                    </ListItemButton>
                    {index < filteredUsers.length - 1 && <Divider sx={{ mx: 1.5 }} />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          )}
        </DialogContent>
      </Dialog>
      
      {helperText && (
        <Typography
          variant="caption"
          color={error ? 'error' : 'text.secondary'}
          sx={{ mt: 1, display: 'block' }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  )
}

export default MarkdownEditor