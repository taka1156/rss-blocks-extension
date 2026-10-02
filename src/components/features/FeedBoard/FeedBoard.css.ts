import { style } from '@vanilla-extract/css';

export const main = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '0 24px 24px',
});

export const groups = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  gap: '16px',
});

export const grid = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: '16px',
  alignItems: 'start',
  minHeight: '40px',
});

export const over = style({
  outline: '2px dashed var(--accent)',
  outlineOffset: '4px',
  borderRadius: '8px',
});
