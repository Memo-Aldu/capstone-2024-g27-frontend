import React, { useState, useEffect } from 'react'
import { Grid, List, ListItem, ListItemAvatar, Avatar, CircularProgress } from '@mui/material'
import { useGetConversationsByParticipantQuery } from '../../features/conversation/ConversationApiSlice'
import { useGetContactByIdQuery } from '../../features/contact/ContactApiSlice'
import type { Contact } from '../../types/Contact.type'
import type { BaseConversation } from '../../types/Conversation.type'

const Conversation: React.FC = () => {
  const userId = '12345'
  const [conversations, setConversations] = useState<BaseConversation[]>([])

  const { data: apiResponse, isLoading: isLoadingConversations } = useGetConversationsByParticipantQuery({ participantId: userId, page: 0, size: 10 })

  useEffect(() => {
    if (apiResponse?.data != null) {
      setConversations(apiResponse.data)
    }
  }, [apiResponse])

  const ConversationItem: React.FC<{ conversation: BaseConversation }> = ({ conversation }) => {
    const { data: contact, isLoading } = useGetContactByIdQuery(conversation.contactId)

    if (isLoading || (contact == null)) {
      return null // Don't render anything if loading or contact not found
    }
    const renderContactInitials = (contact: Contact): string => {
      return `${contact.firstName[0]}${contact.lastName[0]}`.toUpperCase()
    }

    return (
        <ListItem>
          <ListItemAvatar>
            <Avatar>{renderContactInitials(contact)}</Avatar>
          </ListItemAvatar>
        </ListItem>
    )
  }

  if (isLoadingConversations) {
    return <CircularProgress />
  }

  return (
      <Grid container sx={{ height: '90vh' }}>
        <Grid item xs={10} sx={{ borderRight: '1px solid #e0e0e0' }}>
          <List sx={{ height: '100%', overflowY: 'auto' }}>
            {conversations.map((conversation) => (
                <ConversationItem key={conversation.contactId} conversation={conversation} />
            ))}
          </List>
        </Grid>
      </Grid>
  )
}

export default Conversation
