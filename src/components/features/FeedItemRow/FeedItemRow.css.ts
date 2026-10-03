import { style } from '@vanilla-extract/css';

export const itemRow = style({
  display: 'flex',
  gap: '10px',
  padding: '8px 12px',
  borderBottom: '1px solid var(--line)',
});

export const itemThumb = style({
  flex: '0 0 auto',
  width: '56px',
  height: '56px',
  objectFit: 'cover',
  borderRadius: '6px',
});

export const itemBody = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '4px',
  minWidth: 0,
  flex: 1,
});

export const itemLink = style({
  color: 'inherit',
  fontSize: '13px',
  textDecoration: 'none',
  wordBreak: 'break-word',
});

export const itemDate = style({
  color: 'var(--muted)',
  fontSize: '11px',
});

export const itemStatus = style({
  padding: '2px 8px',
  color: 'var(--muted)',
  fontSize: '16px',
});
