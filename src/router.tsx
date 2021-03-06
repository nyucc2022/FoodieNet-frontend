import * as React from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { Alert, AlertColor, Backdrop, CircularProgress, Snackbar } from '@mui/material';
import AppContext from './api/state';

import Landing from './pages/landing';
import Dashboard from './pages/dashboard';
import SignIn from './pages/signin';
import SignUp from './pages/signup';
import { getUser, signOut } from './api/amplify';
import { assign, call } from './api/utils';

export default function Router() {
  const navigate = useNavigate();
  const location = useLocation();
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

  React.useEffect(() => {
    getUser().then(user => {
      if (!user && location.pathname.startsWith('/dashboard')) {
        navigate(`/signin?redirect=${location.pathname}`);
      } else if (user && ['/', '/signin', '/signup'].includes(location.pathname)) {
        navigate(`/dashboard/management`);
      }
    });
    // eslint-disable-next-line
  }, []);

  const helpers = {
    setBackDropStatus,
    openSnackBar: (message: string, severity: AlertColor = 'success') => {
      setSnackBarSeverity(severity);
      setSnackBarMessage(message);
      setSnackBarStatus(true);
    },
    logout: async (showMessage = false, backTo='') => {
      try {
        await signOut();
        navigate(`/signin${backTo ? `?redirect=${backTo}` : ''}`);
        if (showMessage) {
          call("openSnackBar", "Success, you are logged out!");
        }
      } catch(err) {
        console.error(`Sign out error: ${err}`)
      }
    },
    navigate: (path: string) => {
      navigate(path);
    }
  };
  assign("helpers", helpers);

  return (
    <AppContext.Provider value={helpers}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.modal + 1 }}
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