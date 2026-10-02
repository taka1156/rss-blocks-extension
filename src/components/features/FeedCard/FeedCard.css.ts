import { style } from '@vanilla-extract/css';

export const block = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxHeight: '520px',
  background: 'var(--card)',
  border: '2px solid var(--line)',
  borderRadius: '12px',
});

export const dragging = style({
  opacity: 0.4,
});

export const blockHead = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '4px',
  padding: '10px 10px 10px 6px',
  borderBottom: '1px solid var(--line)',
});

export const handle = style({
  padding: '0 6px',
  color: 'var(--muted)',
  fontSize: '16px',
  userSelect: 'none',
  cursor: 'grab',
});

export const title = style({
  flex: 1,
  minWidth: 0,
  margin: 0,
  fontSize: '15px',
});

export const titleText = style({
  display: 'block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const subtitle = style({
  display: 'block',
  color: 'var(--muted)',
  fontSize: '11px',
  fontWeight: 'normal',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const actions = style({
  display: 'flex',
  gap: '8px',
  flex: '0 0 auto',
  marginLeft: 'auto',
});

export const icon = style({
  padding: '2px 8px',
  border: '0',
  background: 'transparent',
  color: 'var(--muted)',
  fontSize: '16px',
  cursor: 'pointer',
  ':hover': {
    color: 'var(--accent)',
  },
});

export const removeIcon = style({
  fontSize: '18px',
  ':hover': {
    color: '#e11d48',
  },
});

export const status = style({
  padding: '16px 14px',
  color: 'var(--muted)',
  fontSize: '13px',
});

export const errorStatus = style({
  color: '#e11d48',
});

export const itemList = style({
  margin: 0,
  padding: 0,
  listStyle: 'none',
  overflowY: 'auto',
});
