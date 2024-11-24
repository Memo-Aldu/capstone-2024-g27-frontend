import CampaignIcon from '@mui/icons-material/Campaign'
import ContactMailIcon from '@mui/icons-material/ContactMail'
import HistoryIcon from '@mui/icons-material/History'
import SendIcon from '@mui/icons-material/Send'
import ChatIcon from '@mui/icons-material/Chat'
import UpcomingIcon from '@mui/icons-material/Upcoming'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { Box } from '@mui/system'
import { useNavigate } from 'react-router-dom'

function MessagingLayout (props: { children?: React.ReactNode }): JSX.Element {
  const navigate = useNavigate()
  const drawerWidth = 200
  const menuItems = [
    { name: 'Quick Message', path: '/messaging/quickmessage', icon: <SendIcon /> },
    { name: 'Conversation', path: '/messaging/conversation', icon: <ChatIcon /> },
    { name: 'Campaign', path: '/messaging/campaign', icon: <CampaignIcon /> },
    { name: 'Templates', path: '/messaging/templates', icon: <UpcomingIcon /> },
    { name: 'Email to SMS', path: '/messaging/emailToSMS', icon: <ContactMailIcon /> },
    { name: 'History', path: '/messaging/history', icon: <HistoryIcon /> }
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

export default MessagingLayout
