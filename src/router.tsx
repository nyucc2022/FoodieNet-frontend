import * as React from 'react';
import { Route, Routes } from 'react-router-dom';

import Landing from './pages/landing';
import Dashboard from './pages/dashboard';
import { Backdrop, CircularProgress } from '@mui/material';
import AppContext from './api/state';

export default function Router() {
  const [backDropStatus, setBackDropStatus] = React.useState<boolean>(false);

  const helpers = {
    setBackDropStatus,
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
    </AppContext.Provider>
  );
}