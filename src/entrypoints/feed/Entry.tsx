import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './Feed';
import '@/styles/theme.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Feed dashboard root element was not found');

ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
