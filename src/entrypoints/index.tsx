import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import Feed from './feed/Feed';
import '@/styles/theme.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Feed page root element was not found');

ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <Feed />
  </StrictMode>,
);
