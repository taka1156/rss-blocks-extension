import { globalStyle, style } from '@vanilla-extract/css';

export const section = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  padding: '0 24px 16px',
  borderBottom: '1px solid var(--line)',
});

export const toolbar = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '8px 16px',
});

export const toolbarTitle = style({
  margin: 0,
  fontSize: '14px',
});

export const list = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
});

export const entry = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  minHeight: '38px',
  padding: '4px 6px 4px 10px',
  border: '1px solid var(--line)',
  borderRadius: '8px',
  background: 'var(--card)',
});

export const link = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  maxWidth: '240px',
  color: 'var(--text)',
  fontSize: '13px',
  textDecoration: 'none',
});

globalStyle(`${link} > span:last-child`, {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const icon = style({
  flex: 'none',
  width: '20px',
  height: '20px',
  objectFit: 'contain',
});

export const fallback = style({
  flex: 'none',
  display: 'grid',
  placeItems: 'center',
  width: '20px',
  height: '20px',
  borderRadius: '4px',
  background: 'var(--line)',
  color: 'var(--muted)',
  fontSize: '12px',
});

export const removeButton = style({
  padding: '2px 5px',
  border: 0,
  background: 'transparent',
  color: 'var(--muted)',
  fontSize: '18px',
  cursor: 'pointer',
  ':hover': {
    color: '#e11d48',
  },
});
