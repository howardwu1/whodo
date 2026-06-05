'use client';

import React, { useState } from 'react';
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
  const [username, setUsername] = useState('');
  const [project, setProject] = useState('');

  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContext.Provider value={{ username, setUsername, project, setProject }}>
          {children}
        </AppContext.Provider>
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
