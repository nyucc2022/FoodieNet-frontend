import React from 'react';
import * as ReactDOMClient from 'react-dom/client';

import { BrowserRouter } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import Router from './router';
import getTheme from './theme';

import './index.css';
import { useMediaQuery } from '@mui/material';

const container = document.getElementById('root')!;
const root = ReactDOMClient.createRoot(container);

const App = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () => getTheme(prefersDarkMode ? 'dark' : 'light'),
    [prefersDarkMode],
  );
  
  return(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router />
      </ThemeProvider>
    </BrowserRouter>
  );
}

root.render(<App />);
