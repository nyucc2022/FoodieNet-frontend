import React from 'react';
import * as ReactDOMClient from 'react-dom/client';

import { BrowserRouter } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import Router from './router';
import theme from './theme';

import './index.css';

const container = document.getElementById('root')!;
const root = ReactDOMClient.createRoot(container);

root.render(<BrowserRouter>
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Router />
  </ThemeProvider>
</BrowserRouter>);
