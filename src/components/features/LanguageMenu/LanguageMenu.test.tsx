import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import i18n from '@/i18n';
import { LanguageMenu } from './LanguageMenu';

describe('LanguageMenu', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('ja');
  });

  afterEach(async () => {
    await i18n.changeLanguage('ja');
  });

  it('renders a closed toggle showing the current language', () => {
    render(<LanguageMenu />);
    const toggle = screen.getByRole('button', { name: '言語を切り替える' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveTextContent('日本語');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('opens the menu with both languages and marks the current one', async () => {
    render(<LanguageMenu />);
    await userEvent.setup().click(screen.getByRole('button', { name: '言語を切り替える' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitemradio', { name: '日本語' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect(screen.getByRole('menuitemradio', { name: 'English' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
  });

  it('changes language, persists it and closes the menu on selection', async () => {
    render(<LanguageMenu />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: '言語を切り替える' }));
    await user.click(screen.getByRole('menuitemradio', { name: 'English' }));
    expect(i18n.language).toBe('en');
    expect(localStorage.getItem('rss-decks-language')).toBe('en');
    expect(document.documentElement.lang).toBe('en');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Switch language' })).toHaveTextContent('English');
  });

  it('closes on Escape', async () => {
    render(<LanguageMenu />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: '言語を切り替える' }));
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('closes on outside click but not on inside click of the toggle twice', async () => {
    render(
      <div>
        <LanguageMenu />
        <p>outside</p>
      </div>,
    );
    const user = userEvent.setup();
    const toggle = screen.getByRole('button', { name: '言語を切り替える' });
    await user.click(toggle);
    await user.click(screen.getByText('outside'));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    await user.click(toggle);
    await user.click(toggle);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
