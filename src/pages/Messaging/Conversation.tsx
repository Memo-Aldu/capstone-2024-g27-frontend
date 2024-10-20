import React, { useState, useEffect, useCallback } from 'react'
import { Grid, List, ListItem, ListItemAvatar, Avatar, CircularProgress, Typography, Box, TextField, Button } from '@mui/material'
import { useGetConversationsByParticipantQuery } from '../../features/conversation/ConversationApiSlice'
import { useGetContactByIdQuery } from '../../features/contact/ContactApiSlice'
import { useGetMessagesQuery, useSendMessageMutation } from '../../features/message/MessageApiSlice'
import type { Contact } from '../../types/Contact.type'
import type { BaseConversation } from '../../types/Conversation.type'
import type { MessageResponse, MessageRequest } from '../../types/Message.type'

const Conversation: React.FC = () => {
  const userId = '12345'
  const [conversations, setConversations] = useState<BaseConversation[]>([])
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null)
  const [selectedContactPhone, setSelectedContactPhone] = useState<string | null>(null)
  const [messages, setMessages] = useState<MessageResponse[]>([])
  const [newMessage, setNewMessage] = useState('')

  const { data: conversationsResponse, isLoading: isLoadingConversations } = useGetConversationsByParticipantQuery({ participantId: userId, page: 0, size: 10 })
  const { data: messagesResponse, isLoading: isLoadingMessages, refetch: refetchMessages } = useGetMessagesQuery({ userId, contactId: selectedContactId ?? '', page: 0, size: 10 }, { skip: selectedContactId == null })
  const [sendMessage] = useSendMessageMutation()

  useEffect(() => {
    if (conversationsResponse?.data != null) {
      setConversations(conversationsResponse.data)
    }
  }, [conversationsResponse])

  useEffect(() => {
    if (messagesResponse?.data != null) {
      setMessages(messagesResponse.data)
    }
  }, [messagesResponse])

  const handleContactClick = (contactId: string, phone: string): void => {
    setSelectedContactId(contactId)
    setSelectedContactPhone(phone)
  }

  const formatPhoneNumber = (phone: string): string => {
    const digitsOnly = phone.replace(/\D/g, '')
    return digitsOnly.startsWith('1') ? `+${digitsOnly}` : `+1${digitsOnly}`
  }

  const handleSendMessage = async (): Promise<void> => {
    if ((selectedContactPhone != null) && (newMessage.trim() !== '')) {
      const formattedPhone = formatPhoneNumber(selectedContactPhone)
      const messageRequest: MessageRequest = {
        userId,
        from: formatPhoneNumber(process.env.REACT_APP_TWILIO_NUMBER ?? ''),
        messageItems: [{
          content: newMessage,
          contactId: selectedContactId ?? '',
          to: formattedPhone
        }]
      }

      try {
        const response = await sendMessage(messageRequest).unwrap()
        setMessages(prevMessages => [...prevMessages, response])
        setNewMessage('')
        void refetchMessages()
      } catch (error) {
      }
    }
  }
  const updateMessages = useCallback(() => {
    if (messagesResponse?.data != null) {
      setMessages(messagesResponse.data)
    }
  }, [messagesResponse])

  useEffect(() => {
    updateMessages()
  }, [updateMessages])

  useEffect(() => {
    const pollInterval = setInterval(() => {
      if (selectedContactId != null) {
        void refetchMessages()
      }
    }, 2000)

    return () => { clearInterval(pollInterval) }
  }, [selectedContactId, refetchMessages])
  const ConversationItem: React.FC<{ conversation: BaseConversation }> = ({ conversation }) => {
    const { data: contact, isLoading } = useGetContactByIdQuery(conversation.contactId)

    if (isLoading || (contact == null)) {
      return null
    }
    const renderContactInitials = (contact: Contact): string => {
      return `${contact.firstName[0]}${contact.lastName[0]}`.toUpperCase()
    }

    return (
        <ListItem>
          <ListItemAvatar>
            <Avatar onClick={() => { handleContactClick(conversation.contactId, contact.phone) }}>{renderContactInitials(contact)}</Avatar>
          </ListItemAvatar>
        </ListItem>
    )
  }

  const ChatMessage: React.FC<{ message: MessageResponse }> = ({ message }) => {
    return (
        <Box sx={{ mb: 2, textAlign: message.direction === 'OUTBOUND_API' ? 'right' : 'left' }}>
          <Typography variant="body2" sx={{ backgroundColor: message.direction === 'OUTBOUND_API' ? '#e3f2fd' : '#f5f5f5', p: 1, borderRadius: 1, display: 'inline-block' }}>
            {message.content}
          </Typography>
        </Box>
    )
  }

  if (isLoadingConversations) {
    return <CircularProgress />
  }

  return (
      <Grid container sx={{ height: '80vh' }}>
        <Grid item xs={3} sx={{ borderRight: '1px solid #e0e0e0' }}>
          <List sx={{ height: '100%', overflowY: 'auto' }}>
            {conversations.map((conversation) => (
                <ConversationItem key={conversation.contactId} conversation={conversation} />
            ))}
          </List>
        </Grid>
        <Grid item xs={8} sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          {isLoadingMessages
            ? (
                  <CircularProgress />
              )
            : (
                  <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
                    {messages.map((message) => (
                        <ChatMessage key={message.id} message={message} />
                    ))}
                  </Box>
              )}
          <Box sx={{ display: 'flex', mt: 'auto' }}>
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Type a message"
                value={newMessage}
                onChange={(e) => { setNewMessage(e.target.value) }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    void handleSendMessage()
                  }
                }}
            />
            <Button
                variant="contained"
                onClick={() => { void handleSendMessage() }}
                disabled={(selectedContactPhone == null) || (newMessage.trim() === '')}
            >
              Send
            </Button>
          </Box>
        </Grid>
      </Grid>
  )
}
export default Conversation
