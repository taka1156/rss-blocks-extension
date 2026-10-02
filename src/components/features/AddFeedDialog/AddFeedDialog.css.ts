import { style } from '@vanilla-extract/css';

export const tabList = style({
  display: 'flex',
  gap: '4px',
  marginBottom: '12px',
  borderBottom: '1px solid var(--line)',
});

export const tabButton = style({
  borderRadius: '6px 6px 0 0',
  background: 'transparent',
  color: 'var(--muted)',
  selectors: {
    '&[aria-selected="true"]': {
      background: 'var(--accent)',
      color: '#fff',
    },
  },
});

export const panel = style({
  display: 'block',
  width: '100%',
  minWidth: 0,
  maxWidth: 'none',
  paddingTop: '8px',
});

export const controls = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flex: '1',
  minWidth: '260px',
  maxWidth: '560px',
  width: '100%',
});

export const input = style({
  flex: '1',
  minWidth: 0,
});

export const hiddenPanel = style({
  display: 'none',
});
