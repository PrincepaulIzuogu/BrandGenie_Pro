import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

// Pages
import Home from './pages/Home';
import OneButtonApp from './pages/OneButtonApp';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/onebuttonapp" element={<OneButtonApp />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
