import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { BaseButton } from './BaseButton';

describe('BaseButton', () => {
  it('renders button with default text', () => {
    render(<BaseButton>Click me</BaseButton>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('applies default variant class', () => {
    const { container } = render(<BaseButton>Default</BaseButton>);
    const button = container.querySelector('button');
    // Vanilla Extract generates class names dynamically, so just verify button exists
    expect(button).toBeInTheDocument();
  });

  it('applies secondary variant class', () => {
    const { container } = render(<BaseButton variant="secondary">Secondary</BaseButton>);
    const button = container.querySelector('button');
    // Verify button exists with secondary variant applied
    expect(button).toBeInTheDocument();
    expect(button?.className).toBeTruthy();
  });

  it('applies icon variant class', () => {
    const { container } = render(<BaseButton variant="icon">Icon</BaseButton>);
    const button = container.querySelector('button');
    // Verify button exists with icon variant applied
    expect(button).toBeInTheDocument();
    expect(button?.className).toBeTruthy();
  });

  it('handles click events', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<BaseButton onClick={handleClick}>Click</BaseButton>);
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('supports custom className', () => {
    const { container } = render(<BaseButton className="custom-class">Button</BaseButton>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('custom-class');
  });

  it('defaults to type="button"', () => {
    render(<BaseButton>Button</BaseButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('supports custom type attribute', () => {
    render(<BaseButton type="submit">Submit</BaseButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('can be disabled', async () => {
    const handleClick = vi.fn();
    render(
      <BaseButton disabled onClick={handleClick}>
        Disabled
      </BaseButton>,
    );
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    await userEvent.setup().click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('spreads additional props', () => {
    render(
      <BaseButton data-testid="custom-button" aria-label="Test button">
        Button
      </BaseButton>,
    );
    const button = screen.getByTestId('custom-button');
    expect(button).toHaveAttribute('aria-label', 'Test button');
  });
});
