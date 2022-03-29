import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import App from './components/App';
import theme from './theme';

import './index.css';

const container = document.getElementById('root')!;
const root = ReactDOMClient.createRoot(container);

root.render(<React.StrictMode>
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>,
</React.StrictMode>);
