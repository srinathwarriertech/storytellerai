'use client';

import { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box, 
  Menu, 
  MenuItem, 
  Avatar,
  Chip,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

// Import icons (these would be from your icon library)
const MenuIcon = () => <div className="w-6 h-6">☰</div>;
const DashboardIcon = () => <div className="w-5 h-5">⊞</div>;
const BookIcon = () => <div className="w-5 h-5">📖</div>;
const UserIcon = () => <div className="w-5 h-5">👤</div>;
const LogoutIcon = () => <div className="w-5 h-5">→</div>;
const MagicIcon = () => <div className="w-5 h-5">✨</div>;

export default function ModernNavbar() {
  const { user, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    await signOut();
    handleMenuClose();
  };

  const toggleMobileDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  const navigationItems = [
    { label: 'Dashboard', href: '/dashboard', icon: <DashboardIcon /> },
    { label: 'My Stories', href: '/dashboard/stories', icon: <BookIcon /> },
  ];

  const mobileDrawer = (
    <Box sx={{ width: 280 }} className="h-full bg-white">
      <Box className="p-6 border-b border-gray-100">
        <Typography variant="h6" className="text-gradient font-bold">
          StoryTeller AI
        </Typography>
        <Typography variant="body2" color="text.secondary" className="mt-1">
          {user?.email}
        </Typography>
      </Box>
      
      <List className="px-4 py-2">
        {navigationItems.map((item) => (
          <ListItem 
            key={item.label}
            component={Link}
            href={item.href}
            className="rounded-xl mb-2 hover:bg-primary-50 transition-colors duration-200"
            onClick={toggleMobileDrawer}
          >
            <ListItemIcon className="text-primary-600 min-w-0 mr-3">
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.label}
              primaryTypographyProps={{
                fontWeight: 500,
                color: 'text.primary'
              }}
            />
          </ListItem>
        ))}
        
        <Divider className="my-4" />
        
        <ListItem 
          component="button"
          onClick={handleSignOut}
          sx={{
            borderRadius: 3,
            '&:hover': { backgroundColor: 'rgba(254, 226, 226, 0.8)' },
            transition: 'background-color 0.2s',
            cursor: 'pointer',
            width: '100%',
            textAlign: 'left',
            padding: '8px 16px',
            border: 'none',
            background: 'none',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <ListItemIcon className="text-red-500 min-w-0 mr-3">
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Sign Out"
            primaryTypographyProps={{
              fontWeight: 500,
              color: 'error.main'
            }}
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        className="glass-effect"
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <Toolbar className="px-4 sm:px-6 lg:px-8">
          <Box className="flex items-center flex-1">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <MagicIcon />
              <Typography 
                variant="h6" 
                className="text-gradient font-bold hidden sm:block"
              >
                StoryTeller AI
              </Typography>
            </Link>
            
            {/* Desktop Navigation */}
            <Box className="hidden md:flex items-center space-x-1 ml-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-4 py-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </Box>
          </Box>

          {/* Desktop User Menu */}
          <Box className="hidden md:flex items-center space-x-4">
            <Chip 
              label="Pro" 
              size="small" 
              className="gradient-primary text-white font-semibold"
            />
            <IconButton
              onClick={handleProfileMenuOpen}
              className="p-1"
            >
              <Avatar 
                sx={{ 
                  width: 36, 
                  height: 36,
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #a855f7 100%)'
                }}
              >
                <UserIcon />
              </Avatar>
            </IconButton>
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            className="md:hidden text-gray-600"
            onClick={toggleMobileDrawer}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Desktop Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          className: 'mt-2 shadow-modern rounded-xl border border-gray-100',
          sx: { minWidth: 200 }
        }}
      >
        <MenuItem onClick={handleMenuClose} className="py-3">
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {user?.email}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Pro Account
            </Typography>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleSignOut} className="py-3 text-red-600">
          <LogoutIcon />
          <span className="ml-2">Sign Out</span>
        </MenuItem>
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={toggleMobileDrawer}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {mobileDrawer}
      </Drawer>
    </>
  );
}