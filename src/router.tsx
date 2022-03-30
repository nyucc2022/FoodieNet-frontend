import * as React from 'react';
import { Route, Routes } from 'react-router-dom';

import Landing from './pages/landing';
import Dashboard from './pages/dashboard';
import { Alert, AlertColor, Backdrop, CircularProgress, Snackbar } from '@mui/material';
import AppContext from './api/state';

export default function Router() {
  const [backDropStatus, setBackDropStatus] = React.useState<boolean>(false);

  const [snackBarStatus, setSnackBarStatus] = React.useState<boolean>(false);
  const [snackBarSeverity, setSnackBarSeverity] = React.useState<AlertColor>('success');
  const [snackBarMessage, setSnackBarMessage] = React.useState<string>('');

  const handleSnackBarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackBarStatus(false);
  }

  const helpers = {
    setBackDropStatus,
    openSnackBar: (message: string, severity: AlertColor = 'success') => {
      setSnackBarSeverity(severity);
      setSnackBarMessage(message);
      setSnackBarStatus(true);
    },
  }

  return (
    <AppContext.Provider value={helpers}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backDropStatus}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar open={snackBarStatus} autoHideDuration={6000} onClose={handleSnackBarClose}>
        <Alert onClose={handleSnackBarClose} severity={snackBarSeverity} sx={{ width: '100%' }}>
          {snackBarMessage}
        </Alert>
      </Snackbar>
    </AppContext.Provider>
  );
}