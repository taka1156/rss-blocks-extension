import { style } from '@vanilla-extract/css';

export const helpPage = style({
  width: 'min(1120px, calc(100% - 32px))',
  margin: '0 auto',
  padding: '40px 0 80px',
  '@media': {
    '(max-width: 640px)': {
      width: 'min(100% - 20px, 680px)',
      paddingTop: '20px',
    },
  },
});

export const hero = style({
  position: 'relative',
  padding: '36px 0 18px',
});

export const heroInner = style({
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(228, 237, 255, 0.76))',
  border: '1px solid var(--panel-border)',
  borderRadius: '28px',
  boxShadow: 'var(--shadow)',
  padding: 'clamp(28px, 4vw, 56px)',
  '@media': {
    '(prefers-color-scheme: dark)': {
      background: 'linear-gradient(135deg, rgba(34, 37, 44, 0.92), rgba(26, 35, 50, 0.85))',
    },
    '(max-width: 640px)': {
      padding: '24px 20px',
    },
  },
});

export const eyebrow = style({
  margin: '0 0 12px',
  fontSize: '0.78rem',
  fontWeight: 700,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'var(--primary-strong)',
});

export const heroTitle = style({
  margin: 0,
  maxWidth: '660px',
  fontSize: 'clamp(2.5rem, 6vw, 4.6rem)',
  lineHeight: 1.05,
  letterSpacing: '-0.06em',
});

export const lead = style({
  maxWidth: '720px',
  margin: '18px 0 0',
  fontSize: '1.08rem',
  lineHeight: 1.9,
  color: 'var(--text-soft)',
});

export const heroActions = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '16px',
  marginTop: '28px',
  '@media': {
    '(max-width: 640px)': {
      flexDirection: 'column',
    },
  },
});

export const button = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '52px',
  padding: '0 22px',
  borderRadius: '999px',
  fontWeight: 700,
  textDecoration: 'none',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  selectors: {
    '&:hover': {
      transform: 'translateY(-1px)',
    },
  },
  '@media': {
    '(max-width: 640px)': {
      width: '100%',
    },
  },
});

export const buttonPrimary = style({
  background: 'linear-gradient(135deg, var(--primary), var(--accent))',
  color: '#fff',
  boxShadow: '0 16px 30px rgba(79, 124, 255, 0.28)',
});

export const buttonSecondary = style({
  background: 'var(--panel)',
  border: '1px solid rgba(90, 110, 167, 0.18)',
  color: 'var(--text)',
});

export const metrics = style({
  listStyle: 'none',
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: '18px',
  margin: '30px 0 0',
  padding: 0,
  '@media': {
    '(max-width: 900px)': {
      gridTemplateColumns: '1fr 1fr',
    },
    '(max-width: 640px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const metricsItem = style({
  padding: '18px 20px',
  borderRadius: '18px',
  background: 'var(--panel)',
  border: '1px solid var(--panel-border)',
});

export const metricsStrong = style({
  display: 'block',
  fontSize: '1.2rem',
  marginBottom: '6px',
});

export const metricsText = style({
  color: 'var(--text-soft)',
});

export const section = style({
  paddingTop: '72px',
});

export const sectionAlt = style({
  paddingTop: '64px',
});

export const sectionHeader = style({
  marginBottom: '24px',
});

export const sectionTitle = style({
  margin: 0,
  fontSize: 'clamp(2rem, 3vw, 2.7rem)',
  lineHeight: 1.2,
  letterSpacing: '-0.04em',
});

export const featureGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: '22px',
  '@media': {
    '(max-width: 900px)': {
      gridTemplateColumns: '1fr 1fr',
    },
    '(max-width: 640px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const featureCard = style({
  background: 'var(--panel)',
  border: '1px solid var(--panel-border)',
  borderRadius: '22px',
  padding: '26px 22px',
  boxShadow: '0 10px 28px rgba(35, 58, 109, 0.06)',
});

export const featureCardBadge = style({
  display: 'inline-flex',
  width: '42px',
  height: '42px',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '12px',
  background: 'linear-gradient(135deg, rgba(79, 124, 255, 0.15), rgba(123, 133, 255, 0.18))',
  color: 'var(--primary-strong)',
  fontWeight: 700,
});

export const featureCardTitle = style({
  margin: '18px 0 12px',
  fontSize: '1.3rem',
});

export const bodyText = style({
  margin: 0,
  color: 'var(--text-soft)',
  lineHeight: 1.8,
});

export const steps = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '22px',
  '@media': {
    '(max-width: 900px)': {
      gridTemplateColumns: '1fr 1fr',
    },
    '(max-width: 640px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const step = style({
  background: 'var(--panel)',
  border: '1px solid var(--panel-border)',
  borderRadius: '22px',
  padding: '24px 22px',
});

export const stepLabel = style({
  display: 'inline-block',
  marginBottom: '10px',
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: '0.12em',
  color: 'var(--primary-strong)',
  textTransform: 'uppercase',
});

export const stepTitle = style({
  margin: '0 0 10px',
  fontSize: '1.35rem',
});

export const callout = style({
  display: 'grid',
  gridTemplateColumns: '1.1fr 1.6fr',
  gap: '22px',
  background: 'linear-gradient(135deg, rgba(79, 124, 255, 0.08), rgba(123, 133, 255, 0.12))',
  border: '1px solid var(--panel-border)',
  borderRadius: '26px',
  padding: 'clamp(22px, 3vw, 36px)',
  '@media': {
    '(max-width: 900px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const calloutTitle = style({
  margin: 0,
  fontSize: 'clamp(1.7rem, 2.4vw, 2.3rem)',
  letterSpacing: '-0.04em',
});

export const actionList = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '18px',
  '@media': {
    '(max-width: 900px)': {
      gridTemplateColumns: '1fr 1fr',
    },
    '(max-width: 640px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const actionItem = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  minHeight: '100px',
  padding: '18px 20px',
  borderRadius: '18px',
  background: 'var(--panel)',
  border: '1px solid rgba(79, 124, 255, 0.12)',
});

export const actionItemName = style({
  fontSize: '1.15rem',
  fontWeight: 700,
  marginBottom: '8px',
});
