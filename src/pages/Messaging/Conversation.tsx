import React, { useState, useEffect, useCallback } from 'react'
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle, DialogContent, DialogActions, MenuItem
} from '@mui/material'
import { useGetConversationsByParticipantQuery, useCreateConversationMutation } from 'src/features/conversation/ConversationApiSlice'
import { useGetContactByIdQuery, useGetAllContactsByUserIdQuery } from 'src/features/contact/ContactApiSlice'
import { useGetMessagesQuery, useSendMessageMutation } from 'src/features/message/MessageApiSlice'
import type { Contact } from 'src/types/Contact.type'
import type { BaseConversation, ConversationResponse } from 'src/types/Conversation.type'
import type { MessageResponse, MessageRequest } from 'src/types/Message.type'
import MessagingLayout from 'src/components/MessagingLayout'
import { useSelector } from 'react-redux'
import type { RootState } from 'src/app/store'
import Loading from 'src/components/Loading'
import { useNotify } from 'src/utils/notify'

const Conversation: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth)
  const notify = useNotify()
  const userId: string = user?.localAccountId ?? ''
  const [conversations, setConversations] = useState<BaseConversation[]>([])
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null)
  const [selectedContactPhone, setSelectedContactPhone] = useState<string | null>(null)
  const [messages, setMessages] = useState<MessageResponse[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [newConversationName, setNewConversationName] = useState('')
  const [newContactId, setNewContactId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedContactName, setSelectedContactName] = useState<string | null>(null)

  const { data: conversationsResponse, isLoading: isLoadingConversations } = useGetConversationsByParticipantQuery({ participantId: userId, page: 0, size: 10 })
  const { data: messagesResponse, isLoading: isLoadingMessages, refetch: refetchMessages } = useGetMessagesQuery({ userId, contactId: selectedContactId ?? '', page: 0, size: 10 }, { skip: selectedContactId == null })
  const [createConversation, { isLoading: isCreatingConversation }] = useCreateConversationMutation()
  const { data: contactsResponse, isLoading: isLoadingContacts } = useGetAllContactsByUserIdQuery(userId)
  const [sendMessage] = useSendMessageMutation()

  const handleOpenModal = (): void => { setIsModalOpen(true) }
  const handleCloseModal = (): void => { setIsModalOpen(false) }

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

  const handleCreateConversation = async (): Promise<void> => {
    if ((newContactId != null) && (newConversationName !== '')) {
      try {
        const response: ConversationResponse = await createConversation({
          userId,
          contactId: newContactId,
          conversationName: newConversationName
        }).unwrap()
        setConversations(e => [...e, response.data])
        setNewConversationName('')
        setNewContactId(null)
        setIsModalOpen(false)
        notify('Conversation created successfully!', 'success')
      } catch (error: any) {
        console.error('Error creating conversation:', error)
        if (error?.status === 409) {
          notify('Conversation already exists', 'warning')
        } else {
          notify('Error creating conversation', 'error')
        }
      }
    }
  }

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
        notify('Message sent successfully!', 'success')
        void refetchMessages()
      } catch (error) {
        console.error('Error sending message:', error)
        notify('Error sending message', 'error')
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
    return (
      <Box sx={{ mb: 2, textAlign: 'center', width: 'calc(90vw - 200px)' }}>
        <Loading message={'Getting Conversations..'} />
      </Box>
    )
  }
  return (
    <MessagingLayout>
      <Box sx={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'row' }}>
        {/* Conversation List */}
        <Box
          sx={{
            width: 400,
            borderRight: '1px solid #e0e0e0',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Header with Title and Button */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              borderBottom: '1px solid #e0e0e0',
              gap: 2
            }}
          >
            <Typography variant="h6" noWrap>
              Conversations
            </Typography>
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={handleOpenModal}
              sx={{
                textTransform: 'none',
                whiteSpace: 'nowrap',
                minWidth: 'fit-content'
              }}
            >
              New Conversation
            </Button>
          </Box>
          <List sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
            {conversations.map((conversation) => (
              <ConversationItem key={conversation.contactId} conversation={conversation} />
            ))}
          </List>
        </Box>

        {/* Chat Section */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', width: 'calc(60vw - 200px)' }}>
          {/* Chat Header */}
          {/* eslint-disable-next-line multiline-ternary */}
          {(selectedContactId != null) ? (
            <>
              <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', flexShrink: 0 }}>
                <Typography variant="h6">{selectedContactName}</Typography>
              </Box>

              {/* Chat Messages */}
              <Box
                sx={{
                  flex: 1,
                  overflowY: 'auto',
                  p: 2,
                  backgroundColor: '#f9f9f9'
                }}
              >
                {isLoadingMessages
                  ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Loading message='Getting Messages...' />
                  </Box>
                    )
                  : (
                      messages.map((message) => (
                        <ChatMessage key={message.id} message={message} />
                      ))
                    )}
              </Box>

              {/* Input Bar */}
              <Box
                sx={{
                  p: 2,
                  borderTop: '1px solid #e0e0e0',
                  display: 'flex',
                  gap: 1,
                  flexShrink: 0
                }}
              >
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
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1
              }}
            >
              <Typography variant="h4" color="textSecondary">
                Select a conversation to start messaging
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
      {/* Modal for New Conversation */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>Create New Conversation</DialogTitle>
        <DialogContent>
          {(isLoadingContacts)
            ? (
            <Loading message={'Loading Contacts...'} />
              )
            : (
            <>
              <TextField
                fullWidth
                select
                label="Select Contact"
                value={newContactId ?? ''}
                onChange={(e) => { setNewContactId(e.target.value) }}
                margin="normal"
              >
                {contactsResponse?.map((contact: Contact, key: number) => (
                  <MenuItem key={contact.id} value={contact.id}>
                    {contact.firstName} {contact.lastName}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Conversation Name"
                value={newConversationName}
                onChange={(e) => { setNewConversationName(e.target.value) }}
                margin="normal"
              />
            </>
              )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => { void handleCreateConversation() }}
            variant="contained"
            color="primary"
            disabled={(newContactId == null) || (newConversationName === '') || isCreatingConversation}
          >
            {isCreatingConversation ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </MessagingLayout>
  )
}

export default Conversation
