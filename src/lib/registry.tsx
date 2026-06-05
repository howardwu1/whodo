'use client';

import React, { useState, useEffect } from 'react';
import { createContext, useContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { NextAppDirEmotionCacheProvider } from './EmotionCache';

const theme = createTheme({
  palette: {
    primary: {
      main: '#191970',
    },
  },
});

interface AppContextType {
  username: string;
  setUsername: (value: string) => void;
  project: string;
  setProject: (value: string) => void;
}

export const AppContext = createContext<AppContextType>({
  username: '',
  setUsername: () => {},
  project: '',
  setProject: () => {},
});

export const useAppContext = () => useContext(AppContext);

function getStoredUsername(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('whodo_username') || '';
}

function setStoredUsername(value: string): void {
  if (typeof window === 'undefined') return;
  if (value) {
    localStorage.setItem('whodo_username', value);
  } else {
    localStorage.removeItem('whodo_username');
  }
}

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [username, setUsernameState] = useState('');
  const [project, setProject] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setUsernameState(getStoredUsername());
    setIsHydrated(true);
  }, []);

  const setUsername = (value: string) => {
    setStoredUsername(value);
    setUsernameState(value);
  };

  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContext.Provider value={{ username: isHydrated ? username : '', setUsername, project, setProject }}>
          {children}
        </AppContext.Provider>
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
