import { globalStyle, style } from '@vanilla-extract/css';

export const pane = style({
  display: 'flex',
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  width: 'min(80vw, var(--paneWidth))',
  flexDirection: 'column',
  background: 'var(--card)',
  borderLeft: '1px solid var(--line)',
  boxShadow: '-4px 0 16px rgba(0, 0, 0, 0.12)',
  zIndex: 10,
});

globalStyle('body.pane-open', {
  marginRight: 'min(80vw, var(--paneWidth))',
});

export const resizeHandle = style({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: '-4px',
  width: '8px',
  margin: 0,
  border: 0,
  cursor: 'ew-resize',
  touchAction: 'none',
  ':focus-visible': {
    outline: '2px solid var(--accent)',
    outlineOffset: '-2px',
  },
});

export const audioBar = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '6px',
  padding: '10px 12px',
  borderBottom: '1px solid var(--line)',
});

export const audioTitle = style({
  flex: 1,
  minWidth: 0,
  fontSize: '13px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const player = style({
  width: '100%',
});

export const articleWrap = style({
  display: 'flex',
  flex: 1,
  minHeight: 0,
  flexDirection: 'column',
});

export const paneHead = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '8px 12px',
  borderBottom: '1px solid var(--line)',
});

export const articleTitle = style({
  flex: 1,
  minWidth: 0,
  fontSize: '13px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const articleFrame = style({
  flex: 1,
  border: 0,
  background: '#fff',
});
