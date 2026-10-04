'use client';

import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import NextLink from 'next/link';
import { useState } from 'react';
import { Img } from '@/components/common/Img';
import { asset } from '@/lib/asset';
import { colors, NAV_HEIGHT } from '@/theme/tokens';

export const NAV_LINKS = [
  { label: 'Games', href: '/#apps' },
  { label: 'Contact', href: '/#contact' },
] as const;

export function NavBar() {
  const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 24 });
  const [open, setOpen] = useState(false);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        height: NAV_HEIGHT,
        justifyContent: 'center',
        backgroundColor: scrolled ? 'rgba(15,12,20,0.72)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.35)' : 'none',
        borderBottom: `1px solid ${scrolled ? colors.border : 'transparent'}`,
        transition: 'background-color .3s, box-shadow .3s, border-color .3s',
      }}
    >
      <Toolbar sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
        <Box component={NextLink} href="/" aria-label="ntwins home" sx={{ display: 'flex' }}>
          <Img
            src={asset('/img/logo-ntwins.webp')}
            alt=""
            width={538}
            height={127}
            sx={{ height: 28, width: 'auto' }}
          />
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Box component="nav" aria-label="Main" sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          {NAV_LINKS.map((link) => (
            <Button key={link.href} component={NextLink} href={link.href} color="inherit">
              {link.label}
            </Button>
          ))}
        </Box>
        <IconButton
          aria-label="Open menu"
          color="inherit"
          onClick={() => setOpen(true)}
          sx={{ display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{ paper: { sx: { width: 260, backgroundColor: colors.paper } } }}
      >
        <List component="nav" aria-label="Mobile">
          {NAV_LINKS.map((link) => (
            <ListItemButton
              key={link.href}
              component={NextLink}
              href={link.href}
              onClick={() => setOpen(false)}
            >
              <ListItemText primary={link.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </AppBar>
  );
}
