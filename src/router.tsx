import * as React from 'react';
import { Route, Routes } from 'react-router-dom';

import Landing from './pages/landing';
import Dashboard from './pages/dashboard';

export default function Router() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </div>
  );
}