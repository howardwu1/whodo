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

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [username, setUsernameState] = useState('');
  const [project, setProject] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Fetch user info from server-side session instead of localStorage
    async function fetchUserFromSession() {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const user = await response.json();
          setUsernameState(user.username || '');
        } else {
          // Not authenticated or session expired
          setUsernameState('');
        }
      } catch (error) {
        console.error('Failed to fetch user from session:', error);
        setUsernameState('');
      }
      setIsHydrated(true);
    }

    fetchUserFromSession();
  }, []);

  // setUsername now just updates local state - session is server-side
  const setUsername = (value: string) => {
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
