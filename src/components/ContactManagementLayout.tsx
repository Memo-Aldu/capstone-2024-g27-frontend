import GroupsIcon from '@mui/icons-material/Groups'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { Box } from '@mui/system'
import { useNavigate } from 'react-router-dom'
import Contact from '@mui/icons-material/Contacts'

function ContactManagementLayout (props: { children?: React.ReactNode }): JSX.Element {
  const navigate = useNavigate()
  const drawerWidth = 200
  const menuItems = [

    { name: 'Groups', path: '/app/ContactManagement/ContactGroup', icon: <GroupsIcon/> },
    { name: 'Contacts', path: '/app/ContactManagement/Contacts', icon: < Contact/> }

  ]
  return (
    <Box sx={{ display: 'flex' }}>

      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', position: 'relative' }
        }}
      >
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.name} disablePadding>
                <ListItemButton onClick={() => { navigate(item.path) }}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {props.children}
      </Box>
    </Box>
  )
}

export default ContactManagementLayout
