import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import Feed from './Feed';
import '@/styles/theme.css';
import '@/i18n';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Feed page root element was not found');

ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <Feed />
  </StrictMode>,
);
