import { style } from '@vanilla-extract/css';

export const root = style({
  position: 'relative',
});

export const menu = style({
  position: 'absolute',
  top: 'calc(100% + 4px)',
  right: 0,
  zIndex: 20,
  minWidth: '140px',
  margin: 0,
  padding: '4px',
  background: 'var(--panel, #fff)',
  border: '1px solid var(--line)',
  borderRadius: '10px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
});

export const menuItem = style({
  display: 'block',
  width: '100%',
  padding: '8px 12px',
  border: 0,
  borderRadius: '6px',
  background: 'transparent',
  color: 'inherit',
  font: 'inherit',
  fontSize: '13px',
  textAlign: 'left',
  cursor: 'pointer',
  ':hover': {
    background: 'var(--line)',
  },
});

export const menuItemActive = style({
  fontWeight: 700,
});
