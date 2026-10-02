import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { BaseInput } from './BaseInput';

describe('BaseInput', () => {
  it('renders an input element', () => {
    render(<BaseInput data-testid="test-input" />);
    const input = screen.getByTestId('test-input');
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe('INPUT');
  });

  it('supports text input type', () => {
    render(<BaseInput type="text" data-testid="text-input" />);
    const input = screen.getByTestId('text-input') as HTMLInputElement;
    expect(input.type).toBe('text');
  });

  it('supports checkbox input type', () => {
    render(<BaseInput type="checkbox" data-testid="checkbox-input" />);
    const input = screen.getByTestId('checkbox-input') as HTMLInputElement;
    expect(input.type).toBe('checkbox');
  });

  it('supports color input type', () => {
    render(<BaseInput type="color" defaultValue="#ff0000" data-testid="color-input" />);
    const input = screen.getByTestId('color-input') as HTMLInputElement;
    expect(input.type).toBe('color');
    expect(input.value).toBe('#ff0000');
  });

  it('supports url input type', () => {
    render(<BaseInput type="url" data-testid="url-input" />);
    const input = screen.getByTestId('url-input') as HTMLInputElement;
    expect(input.type).toBe('url');
  });

  it('handles onChange events', async () => {
    const handleChange = vi.fn();
    render(<BaseInput onChange={handleChange} data-testid="input" />);
    const input = screen.getByTestId('input');
    await userEvent.setup().type(input, 'test');
    expect(handleChange).toHaveBeenCalled();
  });

  it('supports placeholder attribute', () => {
    render(<BaseInput placeholder="Enter text" data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('placeholder', 'Enter text');
  });

  it('supports disabled state', () => {
    render(<BaseInput disabled data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input).toBeDisabled();
  });

  it('supports required attribute', () => {
    render(<BaseInput required data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input).toBeRequired();
  });

  it('supports value prop', () => {
    render(<BaseInput value="initial value" readOnly data-testid="input" />);
    const input = screen.getByTestId('input') as HTMLInputElement;
    expect(input.value).toBe('initial value');
  });

  it('spreads additional HTML attributes', () => {
    render(
      <BaseInput data-testid="input" aria-label="Test input" maxLength={100} min="1" max="100" />,
    );
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('aria-label', 'Test input');
    expect(input).toHaveAttribute('maxlength', '100');
    expect(input).toHaveAttribute('min', '1');
    expect(input).toHaveAttribute('max', '100');
  });
});
