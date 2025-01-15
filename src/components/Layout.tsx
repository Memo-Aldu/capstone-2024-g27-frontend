import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import ContactMailIcon from '@mui/icons-material/ContactMail'
import HelpIcon from '@mui/icons-material/Help'
import Dashboard from '@mui/icons-material/Dashboard'
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
import { Outlet, useNavigate } from 'react-router-dom'
import { IconButton, MenuItem, MenuList, Tooltip } from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import SettingsIcon from '@mui/icons-material/Settings'
import { useState } from 'react'
import Logout from 'src/components/Logout'

const drawerWidth = 300

export default function Layout (): JSX.Element {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = (): void => {
    setAnchorEl(null)
  }

  const handleAccountRedirect = (event: React.MouseEvent<HTMLElement>): void => {
    handleMenuClose()
    navigate('/app/my-account')
  }
  const menuItems1 = [
    { name: 'Dashboard', path: '/app/dashboard', icon: <Dashboard /> },
    { name: 'Contact Management', path: '/app/contact-management', icon: <ContactMailIcon /> },
    { name: 'Messaging', path: '/app/messaging', icon: <MessageIcon /> }
  ]
  const menuItems2 = [
    { name: 'Help', path: '/app/help', icon: <HelpIcon /> },
    { name: 'My Account', path: '/app/my-account', icon: <AccountCircleIcon /> }
  ]

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        borderBottom: '1px solid #E0E0E0'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
          RelayComs
        </Typography>
        {/* Right Icons */}
        <Box>
          <Tooltip title="Notifications">
            <IconButton size="large" color="inherit">
              <NotificationsIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Settings">
            <IconButton size="large" color="inherit">
              <SettingsIcon />
            </IconButton>
          </Tooltip>
          <Box
            onMouseEnter={handleMenuOpen}
            onMouseLeave={handleMenuClose}
            sx={{
              display: 'inline-block',
              position: 'relative'
            }}
          >
            {/* User Icon Button */}
            <IconButton
              size="large"
              color="inherit"
              aria-controls={open ? 'user-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <AccountCircleIcon />
            </IconButton>

            {open && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '40px',
                  left: 'calc(50% - 175px)',
                  backgroundColor: '#fff',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  borderRadius: '5px',
                  zIndex: 1,
                  minWidth: '200px'
                }}
              >
                <MenuList color='grey'>
                  <MenuItem onClick={handleAccountRedirect} sx={{ color: 'rgba(0, 0, 0, 0.87)' }}>Account Settings</MenuItem>
                  <MenuItem onClick={handleMenuClose} sx={{ color: 'red' }}>
                    <Logout />
                  </MenuItem>
                </MenuList>
              </Box>
            )}
          </Box>
        </Box>
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
        <Outlet />
      </Box>
    </Box>
  )
}
