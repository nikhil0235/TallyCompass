import { useState, useRef, useEffect } from 'react'
import { 
  Drawer, 
  Box, 
  Typography, 
  TextField, 
  IconButton, 
  Paper,
  Avatar,
  Button,
  Link
} from '@mui/material'
import { Send, Close, SmartToy, Person } from '@mui/icons-material'

const ChatPanel = ({ open, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your TallyCompass assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const hardcodedResponses = {
    'hello': 'Hello! How can I assist you with TallyCompass today?',
    'help': 'I can help you with customer feedback, VOC analysis, and product insights.',
    'dashboard': 'Here\'s your dashboard overview with key metrics and insights.',
    'image': {
      type: 'image',
      url: 'https://via.placeholder.com/300x200/4CAF50/white?text=Sample+Chart',
      caption: 'Sample analytics chart'
    },
    'video': {
      type: 'video',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      title: 'TallyCompass Tutorial Video'
    },
    'link': {
      type: 'link',
      url: 'https://example.com/docs',
      title: 'TallyCompass Documentation'
    }
  }

  const handleSend = () => {
    if (!inputValue.trim()) return

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])

    // Generate bot response
    setTimeout(() => {
      const key = inputValue.toLowerCase()
      let response = hardcodedResponses[key] || "I'm not sure about that. Try asking about 'help', 'dashboard', 'image', 'video', or 'link'."
      
      const botMessage = {
        id: Date.now() + 1,
        ...response,
        sender: 'bot',
        timestamp: new Date()
      }

      if (typeof response === 'string') {
        botMessage.text = response
      }

      setMessages(prev => [...prev, botMessage])
    }, 1000)

    setInputValue('')
  }

  const renderMessage = (message) => {
    const isBot = message.sender === 'bot'
    
    return (
      <Box
        key={message.id}
        sx={{
          display: 'flex',
          mb: 2,
          justifyContent: isBot ? 'flex-start' : 'flex-end'
        }}
      >
        {isBot && (
          <Avatar sx={{ mr: 1, bgcolor: 'primary.main' }}>
            <SmartToy />
          </Avatar>
        )}
        <Paper
          sx={{
            p: 2,
            maxWidth: '70%',
            bgcolor: isBot ? 'grey.100' : 'primary.main',
            color: isBot ? 'text.primary' : 'white'
          }}
        >
          {message.text && <Typography variant="body2">{message.text}</Typography>}
          
          {message.type === 'image' && (
            <Box>
              <img 
                src={message.url} 
                alt={message.caption}
                style={{ width: '100%', borderRadius: 4, marginTop: 8 }}
              />
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                {message.caption}
              </Typography>
            </Box>
          )}
          
          {message.type === 'video' && (
            <Box sx={{ mt: 1 }}>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => window.open(message.url, '_blank')}
              >
                Watch: {message.title}
              </Button>
            </Box>
          )}
          
          {message.type === 'link' && (
            <Box sx={{ mt: 1 }}>
              <Link 
                href={message.url} 
                target="_blank" 
                rel="noopener"
                underline="hover"
              >
                {message.title}
              </Link>
            </Box>
          )}
        </Paper>
        {!isBot && (
          <Avatar sx={{ ml: 1, bgcolor: 'secondary.main' }}>
            <Person />
          </Avatar>
        )}
      </Box>
    )
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 400,
          maxWidth: '90vw'
        }
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">TallyCompass Assistant</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        {/* Messages */}
        <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
          {messages.map(renderMessage)}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Ask me anything..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <IconButton color="primary" onClick={handleSend}>
              <Send />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Drawer>
  )
}

export default ChatPanel