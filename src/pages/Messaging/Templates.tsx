import { Typography, Box, Button, Input } from '@mui/material'
import { useEffect, useState } from 'react'
import MessagingLayout from 'src/components/MessagingLayout'

const Templates = (): JSX.Element => {
  const [templates, setTemplates] = useState<string[]>([])
  const [newTemplate, setNewTemplate] = useState('')
  useEffect(() => {
    const storedTemplates = JSON.parse(
      localStorage.getItem('MessageTemplates') ?? '[]'
    ) as string[]
    setTemplates(storedTemplates)
  }, [])

  const saveTemplate = (newTemplate: string): void => {
    const updatedTemplates = [...templates, newTemplate]
    setTemplates(updatedTemplates)
    localStorage.setItem(
      'MessageTemplates',
      JSON.stringify(updatedTemplates)
    )
  }

  const deleteTemplate = (template: string): void => {
    const updatedTemplates = templates.filter((t) => t !== template)
    setTemplates(updatedTemplates)
    localStorage.setItem(
      'MessageTemplates',
      JSON.stringify(updatedTemplates)
    )
  }

  return (
    <MessagingLayout>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Templates
        </Typography>
      </Box>
      {templates.map((template: string) => (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }} key={template}>
          <Typography variant="body1">{template}</Typography>
          <Button sx={{ ml: 2 }} variant="contained" onClick={() => { deleteTemplate(template) }}>Delete</Button>
          <hr />
        </Box>
      ))}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Input type="text" placeholder="New template" onChange={(event) => { setNewTemplate(event.target.value) }} />
        <Button sx={{ ml: 2 }} variant="contained" onClick={() => { saveTemplate(newTemplate) }}>Save</Button>
      </Box>

    </MessagingLayout>

  )
}

export default Templates
