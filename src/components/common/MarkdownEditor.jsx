import React, { useState, useRef, useEffect, useCallback } from 'react'
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
  const editorBoxRef = useRef(null)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const mentionPositionLocked = useRef(false)
  const editorRef = useRef(null)
  const mentionListRef = useRef(null)
  const mentionDropdownRef = useRef(null)

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
        setHighlightedIndex(0)
        // Only set position if not already locked
        if (!mentionPositionLocked.current) {
          setTimeout(() => {
            if (editorRef.current && editorBoxRef.current) {
              const iframe = editorRef.current.iframeElement || editorRef.current.getDoc()?.defaultView?.frameElement;
              if (iframe) {
                const win = iframe.contentWindow;
                const sel = win.getSelection();
                if (sel && sel.rangeCount > 0) {
                  const range = sel.getRangeAt(0).cloneRange();
                  const rect = range.getClientRects()[0];
                  if (rect) {
                    // Get iframe and editor box position relative to page
                    const iframeRect = iframe.getBoundingClientRect();
                    const editorBoxRect = editorBoxRef.current.getBoundingClientRect();
                    // Calculate dropdown position relative to editor box
                    let top = rect.bottom + iframeRect.top - editorBoxRect.top;
                    let left = rect.left + iframeRect.left - editorBoxRect.left;
                    // Prevent overflow from editor box
                    const dropdownWidth = 250;
                    const dropdownHeight = 200;
                    if (left + dropdownWidth > editorBoxRect.width) {
                      left = editorBoxRect.width - dropdownWidth - 8;
                    }
                    if (top + dropdownHeight > editorBoxRect.height) {
                      top = editorBoxRect.height - dropdownHeight - 8;
                    }
                    setMentionPosition({ top, left });
                    mentionPositionLocked.current = true;
                  }
                }
              }
            }
          }, 0);
        }
      } else {
        setShowMentions(false)
        mentionPositionLocked.current = false;
      }
    } else {
      setShowMentions(false)
      mentionPositionLocked.current = false;
    }
  }

  const insertMention = useCallback((user) => {
    if (!editorRef.current) return
    try {
      const editor = editorRef.current;
      const content = editor.getContent();
      const plainText = content.replace(/<[^>]*>/g, '');
      const lastAtIndex = plainText.lastIndexOf('@');
      if (lastAtIndex !== -1) {
        const beforeAt = plainText.substring(0, lastAtIndex);
        const afterAt = plainText.substring(lastAtIndex + 1);
        const afterMention = afterAt.replace(/^[a-zA-Z]*/, '');
        const mentionText = `@${user.userName}`;
        const newContent = `${beforeAt}${mentionText} ${afterMention}`;
        editor.setContent(newContent);
        onChange(newContent);
        // Move cursor after the inserted mention and space, even with multiple mentions
        setTimeout(() => {
          const doc = editor.getDoc();
          const body = editor.getBody();
          // Find the last occurrence of the mentionText + ' '
          const searchText = `${mentionText} `;
          let charCount = 0;
          let targetStart = -1;
          function findLastMention(node) {
            if (node.nodeType === 3) { // text node
              let idx = -1;
              let searchFrom = 0;
              while ((idx = node.data.indexOf(searchText, searchFrom)) !== -1) {
                targetStart = charCount + idx + searchText.length;
                searchFrom = idx + 1;
              }
              charCount += node.data.length;
            } else if (node.nodeType === 1 && node.childNodes) {
              for (let i = 0; i < node.childNodes.length; i++) {
                findLastMention(node.childNodes[i]);
              }
            }
          }
          findLastMention(body);
          if (targetStart !== -1) {
            // Set the cursor at the end of the last inserted mention
            let currCount = 0;
            let found = false;
            function setCursor(node) {
              if (found) return;
              if (node.nodeType === 3) {
                if (currCount + node.length >= targetStart) {
                  const range = doc.createRange();
                  range.setStart(node, targetStart - currCount);
                  range.collapse(true);
                  editor.selection.setRng(range);
                  found = true;
                }
                currCount += node.length;
              } else if (node.nodeType === 1 && node.childNodes) {
                for (let i = 0; i < node.childNodes.length; i++) {
                  setCursor(node.childNodes[i]);
                  if (found) break;
                }
              }
            }
            setCursor(body);
          }
        }, 0);
      }
    } catch (err) {
      console.error('Error inserting mention:', err)
    }
    setShowMentions(false);
    mentionPositionLocked.current = false;
    setHighlightedIndex(0);
  }, [onChange]);

  // Keyboard navigation and outside click/blur handling
  useEffect(() => {
    if (!showMentions) return;
    // Keyboard handler
    const handleKeyDown = (e) => {
      if (!showMentions || filteredUsers.length === 0) return;
      if (["ArrowDown", "ArrowUp", "Enter", "Escape"].includes(e.key)) {
        e.preventDefault();
        if (e.key === "ArrowDown") {
          setHighlightedIndex((prev) => (prev + 1) % filteredUsers.length);
        } else if (e.key === "ArrowUp") {
          setHighlightedIndex((prev) => (prev - 1 + filteredUsers.length) % filteredUsers.length);
        } else if (e.key === "Enter") {
          insertMention(filteredUsers[highlightedIndex]);
        } else if (e.key === "Escape") {
          setShowMentions(false);
          mentionPositionLocked.current = false;
        }
      }
    };
    // Outside click/touch/blur handler
    const handleOutside = (e) => {
      if (!mentionDropdownRef.current) return;
      if (
        !mentionDropdownRef.current.contains(e.target) &&
        (!editorRef.current || !editorRef.current.getDoc().body.contains(e.target))
      ) {
        setShowMentions(false);
        mentionPositionLocked.current = false;
      }
    };
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('mousedown', handleOutside, true);
    document.addEventListener('touchstart', handleOutside, true);
    window.addEventListener('blur', () => {
      setShowMentions(false);
      mentionPositionLocked.current = false;
    });
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('mousedown', handleOutside, true);
      document.removeEventListener('touchstart', handleOutside, true);
    };
  }, [showMentions, filteredUsers, highlightedIndex, insertMention]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (showMentions && mentionListRef.current) {
      const active = mentionListRef.current.querySelector('.mention-active');
      if (active) active.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex, showMentions]);

  return (
    <Box sx={{ position: 'relative' }} ref={editorBoxRef}>
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
          ref={mentionDropdownRef}
          sx={{
            position: 'absolute',
            top: `${mentionPosition.top}px`,
            left: `${mentionPosition.left}px`,
            width: 250,
            maxHeight: 200,
            overflow: 'auto',
            zIndex: 1300,
            border: `2px solid ${theme.palette.primary.main}`,
            boxShadow: 8,
            outline: 'none',
          }}
        >
          <List sx={{ py: 0 }} ref={mentionListRef}>
            {filteredUsers.map((user, index) => (
              <React.Fragment key={user._id}>
                <ListItemButton
                  onClick={() => insertMention(user)}
                  selected={index === highlightedIndex}
                  className={index === highlightedIndex ? 'mention-active' : ''}
                  sx={{
                    py: 0.5,
                    px: 1,
                    minHeight: 44,
                    backgroundColor: index === highlightedIndex ? theme.palette.action.selected : 'inherit',
                    '&.mention-active, &:hover': {
                      backgroundColor: theme.palette.action.selected,
                    },
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onMouseDown={e => e.preventDefault()}
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