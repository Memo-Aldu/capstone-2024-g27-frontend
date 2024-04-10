import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import ContactMailIcon from '@mui/icons-material/ContactMail'
import HelpIcon from '@mui/icons-material/Help'
import HomeIcon from '@mui/icons-material/Home'
import MessageIcon from '@mui/icons-material/Message'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'

const drawerWidth = 200

export default function Layout (props: { children: React.ReactNode }): JSX.Element {
  const navigate = useNavigate()
  const menuItems1 = [
    { name: 'Home', path: '/', icon: <HomeIcon /> },
    { name: 'Contact Management', path: '/contact-management', icon: <ContactMailIcon /> },
    { name: 'Messaging', path: '/messaging', icon: <MessageIcon /> }
  ]
  const menuItems2 = [
    { name: 'Help', path: '/help', icon: <HelpIcon /> },
    { name: 'My Account', path: '/my-account', icon: <AccountCircleIcon /> }
  ]

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            PharmfinderCRM
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' }
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems1.map((item) => (
              <ListItem key={item.name} disablePadding>
                <ListItemButton onClick={() => { navigate(item.path) }}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>))}
          </List>
          <Divider />
          <List>
            {menuItems2.map((item) => (
              <ListItem key={item.name} disablePadding>
                <ListItemButton onClick={() => { navigate(item.path) }}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>))}
          </List>
        </Box>
      </Drawer>
      <Box component="main">
        <Toolbar />
        {props.children}
      </Box>
    </Box>
  )
}
