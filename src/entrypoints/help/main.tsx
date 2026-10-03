import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import Help from './Help';
import '@/styles/theme.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Help page root element was not found');

ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <Help />
  </StrictMode>,
);
