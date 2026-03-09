import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRouter } from './router';
import '../styles/tokens.css';
import '../styles/responsive.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>,
);
