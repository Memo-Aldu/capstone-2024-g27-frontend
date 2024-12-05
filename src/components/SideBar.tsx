import React from 'react'
import { Box, List, ListItem, ListItemText, IconButton, Typography } from '@mui/material'
import GroupAddIcon from '@mui/icons-material/GroupAdd'

interface SidebarProps {
  items: Array<{ id: string, name: string }>
  selectedId: string
  sideBarName: string
  onSelect: (id: string) => void
  onAddClick: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ items, selectedId, onSelect, sideBarName, onAddClick }) => (
  <Box sx={{ width: 250, borderRight: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column' }}>
    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h6">{sideBarName}</Typography>
      <IconButton color="primary" onClick={onAddClick}>
        <GroupAddIcon />
      </IconButton>
    </Box>
    <List>
      {items.map(item => (
        <ListItem
          key={item.id}
          button
          selected={item.id === selectedId}
          onClick={() => { onSelect(item.id) }}
          sx={{
            '&.Mui-selected': {
              backgroundColor: '#e3f2fd',
              '&:hover': { backgroundColor: '#e3f2fd' }
            }
          }}
        >
          <ListItemText primary={item.name} />
        </ListItem>
      ))}
    </List>
  </Box>
)

export default Sidebar
