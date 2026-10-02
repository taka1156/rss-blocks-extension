import { style } from '@vanilla-extract/css';

export const form = style({
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  padding: '12px 14px',
  borderBottom: '1px solid var(--line)',
  fontSize: '12px',
  color: 'var(--muted)',
});

export const label = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

export const colorRow = style({
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
});

export const colorInput = style({
  flex: 'none',
  width: '48px',
  height: '32px',
  padding: '2px',
  cursor: 'pointer',
});

export const buttons = style({
  display: 'flex',
  gap: '8px',
});
