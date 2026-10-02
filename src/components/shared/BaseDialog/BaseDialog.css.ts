import { style } from '@vanilla-extract/css';

export const dialog = style({
  position: 'fixed',
  inset: 0,
  width: 'min(520px, calc(100vw - 32px))',
  maxWidth: 'none',
  maxHeight: 'calc(100vh - 32px)',
  margin: 'auto',
  padding: 0,
  overflow: 'auto',
  border: '1px solid var(--line)',
  borderRadius: '10px',
  background: 'var(--card)',
  color: 'var(--text)',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.24)',
  selectors: {
    '&::backdrop': {
      background: 'rgba(0, 0, 0, 0.42)',
      backdropFilter: 'blur(2px)',
    },
  },
});

export const dialogHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 16px',
  borderBottom: '1px solid var(--line)',
});

export const dialogTitle = style({
  margin: 0,
  fontSize: '16px',
});

export const dialogBody = style({
  padding: '16px',
});
