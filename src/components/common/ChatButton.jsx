import { Fab, useMediaQuery, useTheme } from '@mui/material'
import { Chat } from '@mui/icons-material'
import { useState } from 'react'
import ChatPanel from './ChatPanel'

const ChatButton = () => {
  const [chatOpen, setChatOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleChatClick = () => {
    setChatOpen(true)
  }

  return (
    <>
      <Fab
        color="primary"
        aria-label="chat"
        onClick={handleChatClick}
        size={isMobile ? 'medium' : 'large'}
        sx={{
          position: 'fixed',
          bottom: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
          zIndex: 1000
        }}
      >
        <Chat />
      </Fab>
      <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  )
}

export default ChatButton