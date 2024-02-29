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

const drawerWidth = 200

const drawerIcons = {
  Home: <HomeIcon />,
  'Contact Management': <ContactMailIcon />,
  Messaging: <MessageIcon />,
  Help: <HelpIcon />,
  'My Account': <AccountCircleIcon />
}

const DrawerIcons = ({ iconNames }) => {
  return iconNames.map((iconName) => (
    <ListItem key={iconName} disablePadding>
      <ListItemButton>
        <ListItemIcon>{drawerIcons[iconName]}</ListItemIcon>
        <ListItemText primary={iconName} />
      </ListItemButton>
    </ListItem>
  ))
}

export default function Layout (props) {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Pharmfinder
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
            <DrawerIcons iconNames={['Home', 'Contact Management', 'Messaging']} />
          </List>
          <Divider />
          <List>
            <DrawerIcons iconNames={['Help', 'My Account']} />
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {props.children}
      </Box>
    </Box>
  )
}
