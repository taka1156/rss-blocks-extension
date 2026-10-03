import { style } from '@vanilla-extract/css';

export const header = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px 20px',
  alignItems: 'center',
  padding: '16px 24px',
});

export const brand = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export const brandIcon = style({
  width: '28px',
  height: '28px',
});

export const title = style({
  margin: 0,
  fontSize: '20px',
});

export const tools = style({
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
  flexWrap: 'wrap',
});

export const checkLabel = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '13px',
  cursor: 'pointer',
});

export const helpLink = style({
  textDecoration: 'none',
});
