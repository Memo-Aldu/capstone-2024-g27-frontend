import {
  Typography,
  Box,
  Button,
  TextField,
  InputAdornment,
  DialogActions,
  DialogContent,
  Dialog,
  DialogTitle,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  TableHead,
  Tooltip
} from '@mui/material'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Delete, Edit, Search } from '@mui/icons-material'
import Paper from '@mui/material/Paper'
import { type Template } from 'src/types/Template.type.ts'
import MessagingLayout from 'src/components/MessagingLayout'

const defaultTemplates: Template[] = [
  {
    id: '02be3592-af25-41b0-9c9e-c62acd28547e',
    name: 'Welcome Message',
    body: 'Hello {{firstName}}, welcome to our service!'
  },
  {
    id: '1cfe861e-2870-4ab9-a30b-d488fa84e06b',
    name: 'Daily Message',
    body: 'Hello {{firstName}}, today is {{Day}}, {{Month}} {{Date}}, {{Year}}. Your lucky number {{RandomNumber}}'
  },
  {
    id: 'b9e7298a-e7f6-43ef-935d-28b1dc31faa0',
    name: 'Thank You Message',
    body: 'Thank you for using our services, {{firstName}}!'
  }
]

const Templates: React.FC = () => {
  const [templates, setTemplates] = useState(defaultTemplates)
  const [currentTemplateName, setCurrentTemplateName] = useState('')
  const [currentTemplateBody, setCurrentTemplateBody] = useState('')
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const storedTemplates: Template[] = JSON.parse(localStorage.getItem('MessageTemplates') ?? '[]')
    if (storedTemplates.length > 0) {
      setTemplates(storedTemplates)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('MessageTemplates', JSON.stringify(templates))
  }, [templates])

  const openModalForAdd = (): void => {
    setCurrentTemplateName('')
    setCurrentTemplateBody('')
    setEditingTemplate(null)
    setIsModalOpen(true)
  }

  const openModalForEdit = (template: Template): void => {
    setCurrentTemplateName(template.name)
    setCurrentTemplateBody(template.body)
    setEditingTemplate(template)
    setIsModalOpen(true)
  }

  const handleSaveTemplate = (): void => {
    if (currentTemplateName.trim() === '' || currentTemplateBody.trim() === '') return

    if (editingTemplate == null) {
      // Adding a new template
      setTemplates([...templates, { id: uuidv4(), name: currentTemplateName, body: currentTemplateBody }])
    } else {
      // Editing an existing template
      setTemplates(
        templates.map((template) =>
          template.id === editingTemplate.id
            ? { ...template, name: currentTemplateName, body: currentTemplateBody }
            : template
        )
      )
    }

    setIsModalOpen(false)
  }

  const handleDeleteTemplate = (templateName: string): void => {
    setTemplates(templates.filter((template) => template.name !== templateName))
  }

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <MessagingLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          SMS Templates
        </Typography>

        {/* Search Bar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <TextField
            placeholder="Search..."
            variant="outlined"
            size="small"
            sx={{ width: '300px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
            onChange={(e) => { setSearchQuery(e.target.value) }}
          />
          <Button variant="contained" color="primary" onClick={openModalForAdd}>
            Add Template
          </Button>
        </Box>

        {/* Template Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Body</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTemplates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell>{template.name}</TableCell>
                  <TableCell>
                    <Tooltip title={template.body}>
                      <span>
                        {template.body.length > 50
                          ? `${template.body.slice(0, 50)}...`
                          : template.body}
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => { openModalForEdit(template) }}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => { handleDeleteTemplate(template.name) }}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add/Edit Template Modal */}
        <Dialog open={isModalOpen} onClose={() => { setIsModalOpen(false) }} maxWidth="sm" fullWidth>
          <DialogTitle>{editingTemplate == null ? 'Add Template' : 'Edit Template'}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Template Name"
              value={currentTemplateName}
              onChange={(e) => { setCurrentTemplateName(e.target.value) }}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Body"
              multiline
              rows={4}
              value={currentTemplateBody}
              onChange={(e) => { setCurrentTemplateBody(e.target.value) }}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setIsModalOpen(false) }}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleSaveTemplate}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </MessagingLayout>
  )
}

export default Templates
