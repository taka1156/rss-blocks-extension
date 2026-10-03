import { useTranslation } from 'react-i18next';
import '@/styles/theme.css';
import { DashboardHeader } from '@/components/features/DashboardHeader/DashboardHeader';
import * as styles from './Help.css';

export default function Help() {
  const { t } = useTranslation();

  const features = [
    {
      title: t('help.features.0.title'),
      description: t('help.features.0.description'),
    },
    {
      title: t('help.features.1.title'),
      description: t('help.features.1.description'),
    },
    {
      title: t('help.features.2.title'),
      description: t('help.features.2.description'),
    },
    {
      title: t('help.features.3.title'),
      description: t('help.features.3.description'),
    },
  ];

  const steps = [
    {
      label: 'Step 1',
      title: t('help.steps.0.title'),
      text: t('help.steps.0.text'),
    },
    {
      label: 'Step 2',
      title: t('help.steps.1.title'),
      text: t('help.steps.1.text'),
    },
    {
      label: 'Step 3',
      title: t('help.steps.2.title'),
      text: t('help.steps.2.text'),
    },
    {
      label: 'Step 4',
      title: t('help.steps.3.title'),
      text: t('help.steps.3.text'),
    },
  ];

  const quickActions = [
    { name: t('header.add'), note: t('help.actions.0.note') },
    { name: t('header.addGroup'), note: t('help.actions.1.note') },
    { name: t('header.refresh'), note: t('help.actions.2.note') },
    { name: t('header.settings'), note: t('help.actions.3.note') },
  ];

  return (
    <>
      <DashboardHeader />
      <main className={styles.helpPage}>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>RSS Decks</p>
            <h1 className={styles.heroTitle}>{t('help.heroTitle')}</h1>
            <p className={styles.lead}>{t('help.lead')}</p>
            <div className={styles.heroActions}>
              <a href="#how-to-use" className={`${styles.button} ${styles.buttonPrimary}`}>
                {t('help.toHowTo')}
              </a>
              <a href="#features" className={`${styles.button} ${styles.buttonSecondary}`}>
                {t('help.toFeatures')}
              </a>
              <a href="/feed.html" className={`${styles.button} ${styles.buttonSecondary}`}>
                {t('help.toDashboard')}
              </a>
            </div>
            <ul className={styles.metrics} aria-label={t('help.metricsLabel')}>
              <li className={styles.metricsItem}>
                <strong className={styles.metricsStrong}>{t('help.metrics.0.title')}</strong>
                <span className={styles.metricsText}>{t('help.metrics.0.text')}</span>
              </li>
              <li className={styles.metricsItem}>
                <strong className={styles.metricsStrong}>{t('help.metrics.1.title')}</strong>
                <span className={styles.metricsText}>{t('help.metrics.1.text')}</span>
              </li>
              <li className={styles.metricsItem}>
                <strong className={styles.metricsStrong}>{t('help.metrics.2.title')}</strong>
                <span className={styles.metricsText}>{t('help.metrics.2.text')}</span>
              </li>
            </ul>
          </div>
        </section>

        <section id="features" className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Features</p>
            <h2 className={styles.sectionTitle}>{t('help.featuresTitle')}</h2>
          </div>
          <div className={styles.featureGrid}>
            {features.map((feature) => (
              <article key={feature.title} className={styles.featureCard}>
                <div className={styles.featureCardBadge} aria-hidden="true">
                  ✓
                </div>
                <h3 className={styles.featureCardTitle}>{feature.title}</h3>
                <p className={styles.bodyText}>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="how-to-use" className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>How to use</p>
            <h2 className={styles.sectionTitle}>{t('help.howToTitle')}</h2>
          </div>
          <div className={styles.steps}>
            {steps.map((step) => (
              <div key={step.label} className={styles.step}>
                <span className={styles.stepLabel}>{step.label}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.bodyText}>{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.callout}>
            <div>
              <p className={styles.eyebrow}>Quick actions</p>
              <h2 className={styles.calloutTitle}>{t('help.quickTitle')}</h2>
            </div>
            <div className={styles.actionList}>
              {quickActions.map((action) => (
                <div key={action.name} className={styles.actionItem}>
                  <span className={styles.actionItemName}>{action.name}</span>
                  <small className={styles.bodyText}>{action.note}</small>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.heroActions}>
            <a href="/feed.html" className={`${styles.button} ${styles.buttonPrimary}`}>
              {t('help.toDashboard')}
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
