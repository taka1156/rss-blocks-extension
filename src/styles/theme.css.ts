import { globalStyle } from '@vanilla-extract/css';

globalStyle(':root', {
  colorScheme: 'light dark',
  vars: {
    '--bg': '#f4f5f7',
    '--bgStrong': '#edf3ff',
    '--card': '#fff',
    '--panel': 'rgba(255, 255, 255, 0.78)',
    '--panel-border': 'rgba(134, 149, 194, 0.18)',
    '--text': '#222',
    '--text-soft': '#4d5b7d',
    '--muted': '#888',
    '--accent': '#2563eb',
    '--primary': '#4f7cff',
    '--primary-strong': '#3459db',
    '--line': '#e5e7eb',
    '--paneWidth': 'max(380px, 42vw)',
    '--shadow': '0 24px 60px rgba(39, 64, 138, 0.14)',
  },
  '@media': {
    '(prefers-color-scheme: dark)': {
      vars: {
        '--bg': '#16181d',
        '--bgStrong': '#1a2332',
        '--card': '#22252c',
        '--panel': 'rgba(34, 37, 44, 0.88)',
        '--panel-border': 'rgba(91, 101, 127, 0.35)',
        '--text': '#e8e8e8',
        '--text-soft': '#c4c9d6',
        '--muted': '#8b93a1',
        '--accent': '#6ea0ff',
        '--primary': '#7aa7ff',
        '--primary-strong': '#a2c1ff',
        '--line': '#33373f',
        '--shadow': '0 24px 60px rgba(0, 0, 0, 0.38)',
      },
    },
  },
});

globalStyle('*', {
  boxSizing: 'border-box',
});

globalStyle('html', {
  scrollBehavior: 'smooth',
});

globalStyle('body', {
  margin: 0,
  minHeight: '100vh',
  background: 'linear-gradient(180deg, var(--bg) 0%, var(--bgStrong) 100%)',
  color: 'var(--text)',
  fontFamily: '"Segoe UI", "Hiragino Sans", "Yu Gothic", sans-serif',
});

globalStyle('img', {
  maxWidth: '100%',
  display: 'block',
});

globalStyle('button, a', {
  font: 'inherit',
});

globalStyle('button, input', {
  font: 'inherit',
});

globalStyle('button', {
  cursor: 'pointer',
});

globalStyle('input', {
  padding: '8px 12px',
  border: '1px solid var(--line)',
  borderRadius: '8px',
  background: 'var(--card)',
  color: 'var(--text)',
});
