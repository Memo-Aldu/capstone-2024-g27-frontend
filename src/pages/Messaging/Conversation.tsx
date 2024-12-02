import React, { useState, useEffect, useCallback } from 'react'
import { List, ListItem, ListItemAvatar, ListItemText, Avatar, CircularProgress, Typography, Box, TextField, Button } from '@mui/material'
import { useGetConversationsByParticipantQuery } from '../../features/conversation/ConversationApiSlice'
import { useGetContactByIdQuery } from '../../features/contact/ContactApiSlice'
import { useGetMessagesQuery, useSendMessageMutation } from '../../features/message/MessageApiSlice'
import type { Contact } from '../../types/Contact.type'
import type { BaseConversation } from '../../types/Conversation.type'
import type { MessageResponse, MessageRequest } from '../../types/Message.type'
import MessagingLayout from '../../components/MessagingLayout'
import { useSelector } from 'react-redux'
import type { RootState } from 'src/app/store'

const Conversation: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth)
  const userId = user?.localAccountId ?? ''
  const [conversations, setConversations] = useState<BaseConversation[]>([])
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null)
  const [selectedContactPhone, setSelectedContactPhone] = useState<string | null>(null)
  const [messages, setMessages] = useState<MessageResponse[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [selectedContactName, setSelectedContactName] = useState<string | null>(null)

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

  const handleContactClick = (contactId: string, phone: string, contactName: string): void => {
    setSelectedContactId(contactId)
    setSelectedContactPhone(phone)
    setSelectedContactName(contactName)
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
      <ListItem
        button
        onClick={() => { handleContactClick(conversation.contactId, contact.phone, `${contact.firstName} ${contact.lastName}`) }}
        selected={selectedContactId === conversation.contactId}
        sx={{
          mb: 1,
          borderRadius: 1,
          '&.Mui-selected': {
            backgroundColor: '#e3f2fd',
            '&:hover': {
              backgroundColor: '#e3f2fd'
            }
          }
        }}
      >
        <ListItemAvatar>
          <Avatar>{renderContactInitials(contact)}</Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={`${contact.firstName} ${contact.lastName}`}
          secondary={contact.phone}
        />
      </ListItem>
    )
  }

  const ChatMessage: React.FC<{ message: MessageResponse }> = ({ message }) => {
    return (
      <Box sx={{ mb: 2, textAlign: message.direction === 'OUTBOUND_API' ? 'right' : 'left' }}>
        <Typography
          variant="body2"
          sx={{
            backgroundColor: message.direction === 'OUTBOUND_API' ? '#e3f2fd' : '#f5f5f5',
            p: 2,
            borderRadius: 2,
            display: 'inline-block',
            maxWidth: '70%',
            wordBreak: 'break-word'
          }}
        >
          {message.content}
        </Typography>
      </Box>
    )
  }

  if (isLoadingConversations) {
    return <CircularProgress />
  }

  return (
    <MessagingLayout>
      <Box sx={{ height: 'calc(100vh - 200px)', display: 'flex' }}>
        <Box sx={{ width: 320, borderRight: '1px solid #e0e0e0', height: '100%' }}>
          <Typography variant="h6" sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
            Conversations
          </Typography>
          <List sx={{ height: 'calc(100% - 60px)', overflowY: 'auto', p: 2 }}>
            {conversations.map((conversation) => (
              <ConversationItem key={conversation.contactId} conversation={conversation} />
            ))}
          </List>
        </Box>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
          {(selectedContactId != null)
            ? (
              <>
                <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                  <Typography variant="h6">
                    {selectedContactName}
                  </Typography>
                </Box>

                <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
                  {isLoadingMessages
                    ? (
                      <CircularProgress />
                      )
                    : (
                        messages.map((message) => (
                        <ChatMessage key={message.id} message={message} />
                        ))
                      )}
                </Box>

                <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', display: 'flex', gap: 1 }}>
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
                    size="small"
                  />
                  <Button
                    variant="contained"
                    onClick={() => { void handleSendMessage() }}
                    disabled={selectedContactPhone == null || newMessage.trim() === ''}
                  >
                    Send
                  </Button>
                </Box>
              </>
              )
            : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Typography variant="body1" color="textSecondary">
                  Select a conversation to start messaging
                </Typography>
              </Box>
              )}
        </Box>
      </Box>
    </MessagingLayout>
  )
}

export default Conversation
