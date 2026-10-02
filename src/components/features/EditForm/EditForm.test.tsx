import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EditForm, type EditValues } from './EditForm';

describe('EditForm', () => {
  const defaultProps = {
    titleLabel: 'Title',
    initial: { title: '', url: '', color: '#2563eb' },
    onColorPreview: vi.fn(),
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
  };

  it('renders form with title label', () => {
    render(<EditForm {...defaultProps} />);
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
  });

  it('renders color input with default color', () => {
    render(<EditForm {...defaultProps} />);
    const colorInput = screen.getByDisplayValue('#2563eb') as HTMLInputElement;
    expect(colorInput).toBeInTheDocument();
    expect(colorInput.type).toBe('color');
  });

  it('populates form with initial values', () => {
    const initial: EditValues = {
      title: 'Test Title',
      url: 'https://example.com',
      color: '#ff0000',
    };
    render(<EditForm {...defaultProps} initial={initial} showUrl={true} />);
    expect(screen.getByDisplayValue('Test Title')).toBeInTheDocument();
    expect(screen.getByDisplayValue('https://example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('#ff0000')).toBeInTheDocument();
  });

  it('shows URL input only when showUrl is true', () => {
    const { rerender } = render(<EditForm {...defaultProps} showUrl={false} />);
    expect(screen.queryByLabelText(/url/i)).not.toBeInTheDocument();

    rerender(<EditForm {...defaultProps} showUrl={true} />);
    expect(screen.getByLabelText(/url/i)).toBeInTheDocument();
  });

  it('renders submit and cancel buttons', () => {
    render(<EditForm {...defaultProps} />);
    expect(screen.getByRole('button', { name: /保存/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /キャンセル/i })).toBeInTheDocument();
  });

  it('updates title input value', async () => {
    render(<EditForm {...defaultProps} />);
    const titleInput = screen.getByLabelText(/title/i) as HTMLInputElement;
    await userEvent.setup().type(titleInput, 'New Title');
    expect(titleInput.value).toContain('New Title');
  });

  it('handles form submission with trimmed values', async () => {
    const handleSubmit = vi.fn();
    render(<EditForm {...defaultProps} onSubmit={handleSubmit} showUrl={true} />);
    const titleInput = screen.getByLabelText(/title/i);
    const urlInput = screen.getByLabelText(/url/i);
    const submitButton = screen.getByRole('button', { name: /保存/i });

    await userEvent.setup().type(titleInput, '  New Title  ');
    await userEvent.setup().type(urlInput, '  https://example.com  ');
    await userEvent.setup().click(submitButton);

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'New Title',
        url: 'https://example.com',
      }),
    );
  });

  it('submits current color value', async () => {
    const handleSubmit = vi.fn();
    render(<EditForm {...defaultProps} onSubmit={handleSubmit} />);
    const colorInput = screen.getByDisplayValue('#2563eb') as HTMLInputElement;
    await userEvent.setup().clear(colorInput);
    await userEvent.setup().type(colorInput, '#00ff00');

    const submitButton = screen.getByRole('button', { name: /保存/i });
    await userEvent.setup().click(submitButton);

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        color: '#00ff00',
      }),
    );
  });

  it('calls onColorPreview when color changes', async () => {
    const handleColorPreview = vi.fn();
    render(<EditForm {...defaultProps} onColorPreview={handleColorPreview} />);
    const colorInput = screen.getByDisplayValue('#2563eb') as HTMLInputElement;
    await userEvent.setup().clear(colorInput);
    await userEvent.setup().type(colorInput, '#00ff00');
    expect(handleColorPreview).toHaveBeenCalledWith('#00ff00');
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const handleCancel = vi.fn();
    render(<EditForm {...defaultProps} onCancel={handleCancel} />);
    const cancelButton = screen.getByRole('button', { name: /キャンセル/i });
    await userEvent.setup().click(cancelButton);
    expect(handleCancel).toHaveBeenCalledOnce();
  });

  it('requires title input when titleRequired is true', () => {
    render(<EditForm {...defaultProps} titleRequired={true} />);
    const titleInput = screen.getByLabelText(/title/i);
    expect(titleInput).toBeRequired();
  });

  it('supports custom placeholder', () => {
    render(<EditForm {...defaultProps} titlePlaceholder="Enter a title" />);
    const titleInput = screen.getByPlaceholderText('Enter a title');
    expect(titleInput).toBeInTheDocument();
  });
});
