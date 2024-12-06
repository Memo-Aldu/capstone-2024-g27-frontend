import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Button,
  CircularProgress
} from '@mui/material'
import { useGetMessagesByUserIdQuery, usePatchMessageByIdMutation } from 'src/features/message/MessageApiSlice'
import { type MessageResponse } from 'src/types/Message.type'
import { useSelector } from 'react-redux'
import { type RootState } from 'src/app/store'
import { useNotify } from 'src/utils/notify'
import MessagingLayout from 'src/components/MessagingLayout'
import Loading from 'src/components/Loading'

const HistoryPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth)
  const userId = user?.localAccountId ?? ''
  const notify = useNotify()

  // State for pagination
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)

  const [patchMessageById] = usePatchMessageByIdMutation()
  const { data: messagesData, isLoading, refetch } = useGetMessagesByUserIdQuery({
    userId,
    page,
    size: rowsPerPage,
    sortBy: 'createdDate',
    order: 'desc'
  })
  const [messages, setMessages] = useState<MessageResponse[]>([])

  useEffect(() => {
    if (messagesData?.data !== undefined) {
      setMessages(messagesData.data)
    }
  }, [messagesData])

  useEffect(() => {
    const pollInterval = setInterval(() => {
      void refetch()
    }, 2000)
    return () => { clearInterval(pollInterval) }
  }, [messagesData, refetch])

  const getStatusColor = (status: string): string => {
    switch (status.toUpperCase()) {
      case 'DELIVERED':
      case 'RECEIVED':
        return '#4CAF50'
      case 'FAILED':
      case 'UNDELIVERED':
      case 'UNKNOWN':
        return '#F44336'
      default:
        return '#FFC107'
    }
  }

  const getDirectionLabel = (direction: string): string => {
    return direction === 'INBOUND' ? 'Inbound' : 'Outbound'
  }

  const handleCancelMessage = async (messageId: string): Promise<void> => {
    const response = await patchMessageById(messageId).unwrap()
    if (response.status === 'OK') {
      setMessages(messages.filter((message) => message.id !== messageId))
      notify(`Scheduled message with ID ${messageId} canceled.`, 'success')
    }
  }

  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number): void => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }
  if (isLoading) {
    return (
      <Box sx={{ mb: 2, textAlign: 'center', width: 'calc(90vw - 200px)' }}>
        <Loading message={'Getting Messages..'} />
      </Box>
    )
  }
  return (
    <MessagingLayout>
      <Box sx={{ p: 3, maxWidth: '100vw' }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Message History
        </Typography>
        {isLoading
          // eslint-disable-next-line multiline-ternary
          ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <CircularProgress />
          </Box>
            ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">To</TableCell>
                  <TableCell align="center">From</TableCell>
                  <TableCell align="center">Content</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Direction</TableCell>
                  <TableCell align="center">Price</TableCell>
                  <TableCell align="center">Scheduled Date</TableCell>
                  <TableCell align="center">Created Date</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {messages.map((message: MessageResponse) => (
                  <TableRow key={message.id}>
                    <TableCell align="center">{message.to}</TableCell>
                    <TableCell align="center">{message.from ?? 'Pending'}</TableCell>
                    <TableCell align="center">
                      {message.content.slice(0, 10)}
                      {message.content.length > 15 && '...'}
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'white',
                          backgroundColor: getStatusColor(message.status),
                          borderRadius: '8px',
                          p: 1,
                          textAlign: 'center',
                          width: 'fit-content'
                        }}
                      >
                        {message.status}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">{getDirectionLabel(message.direction)}</TableCell>
                    <TableCell align="center">
                      {(message.price !== null && message.price !== 0.00 && message.currency !== null) ? `${message.currency} ${message.price.toFixed(2)}` : 'N/A' }
                    </TableCell>
                    <TableCell align="center">{message.scheduledDate === null ? 'N/A' : new Date(message.scheduledDate).toLocaleString()}</TableCell>
                    <TableCell align="center">{new Date(message.createdDate).toLocaleString()}</TableCell>
                    <TableCell align="center">
                      {message.status === 'SCHEDULED' && (
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => { void handleCancelMessage(message.id) }}
                        >
                          Cancel
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* Pagination */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={messagesData?.totalElements ?? 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
            )}
      </Box>
    </MessagingLayout>
  )
}

export default HistoryPage
