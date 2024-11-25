import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Avatar
} from '@mui/material'
import {
  Delete as DeleteIcon,
  Upload as UploadIcon
} from '@mui/icons-material'

interface UploadZoneProps {
  uploadStatus: string
  setUploadStatus: (uploadStatus: string) => void
  files: File[]
  setFiles: (files: File[]) => void
}

export function UploadZone (props: UploadZoneProps): JSX.Element {
  const { uploadStatus, files, setFiles } = props

  const handleAddFiles = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files !== null) {
      const newFiles = Array.from(event.target.files)
      setFiles([...files, ...newFiles])
    }
  }

  const handleRemoveFile = (index: number): void => {
    setFiles(files.filter((_, i) => i !== index))
  }

  return (
    <Box>
      <Button
        variant="contained"
        component="label"
        startIcon={<UploadIcon />}
        disabled={uploadStatus === 'uploading'}
      >
        Add File(s)
        <input
          type="file"
          multiple
          hidden
          onChange={handleAddFiles}
          disabled={uploadStatus === 'uploading'}
        />
      </Button>

      {files.length > 0 && (
        <Box mt={2}>
          <Typography variant="h6">
            {files.length} file(s) attached
          </Typography>
          <List>
            {files.map((file, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton
                    edge="end"
                    color="error"
                    onClick={() => { handleRemoveFile(index) }}
                    aria-label="remove"
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  {file.type.startsWith('image/')
                    ? (
                    <Avatar
                      variant="square"
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      sx={{ width: 50, height: 50 }}
                    />
                      )
                    : (
                    <Avatar>{file.name[0].toUpperCase()}</Avatar>
                      )}
                </ListItemAvatar>
                <ListItemText primary={file.name} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {uploadStatus === 'success' && (
        <Typography color="success.main" mt={2}>
          Upload successful!
        </Typography>
      )}
      {uploadStatus === 'error' && (
        <Typography color="error.main" mt={2}>
          Upload failed. Please try again.
        </Typography>
      )}
    </Box>
  )
}
