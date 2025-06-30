import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App';
import Catalogue from './pages/Catalogue';

function Router() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/catalogue" element={<Catalogue />} />
    </Routes>
  );
}

export default Router;
