import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BaseDialog } from './BaseDialog';

describe('BaseDialog', () => {
  beforeEach(() => {
    // Mock HTMLDialogElement methods if needed
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders dialog with title', () => {
    render(
      <BaseDialog
        id="test-dialog"
        title="Test Dialog"
        titleId="test-title"
        closeButtonId="test-close"
        open={true}
      >
        Content
      </BaseDialog>,
    );
    expect(screen.getByText('Test Dialog')).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(
      <BaseDialog
        id="test-dialog"
        title="Dialog"
        titleId="test-title"
        closeButtonId="test-close"
        open={true}
      >
        <div>Test Content</div>
      </BaseDialog>,
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders close button', () => {
    render(
      <BaseDialog
        id="test-dialog"
        title="Dialog"
        titleId="test-title"
        closeButtonId="test-close"
        open={true}
      >
        Content
      </BaseDialog>,
    );
    const closeButton = screen.getByRole('button', { name: /×/i });
    expect(closeButton).toBeInTheDocument();
  });

  it('calls onOpenChange when close button is clicked', async () => {
    const handleOpenChange = vi.fn();
    render(
      <BaseDialog
        id="test-dialog"
        title="Dialog"
        titleId="test-title"
        closeButtonId="test-close"
        open={true}
        onOpenChange={handleOpenChange}
      >
        Content
      </BaseDialog>,
    );
    const closeButton = screen.getByRole('button', { name: /×/i });
    await userEvent.setup().click(closeButton);
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it('calls onClose when close button is clicked', async () => {
    const handleClose = vi.fn();
    const handleOpenChange = vi.fn();
    render(
      <BaseDialog
        id="test-dialog"
        title="Dialog"
        titleId="test-title"
        closeButtonId="test-close"
        open={true}
        onClose={handleClose}
        onOpenChange={handleOpenChange}
      >
        Content
      </BaseDialog>,
    );
    const closeButton = screen.getByRole('button', { name: /×/i });
    await userEvent.setup().click(closeButton);
    expect(handleClose).toHaveBeenCalledOnce();
  });

  it('applies custom bodyClassName', () => {
    const { container } = render(
      <BaseDialog
        id="test-dialog"
        title="Dialog"
        titleId="test-title"
        closeButtonId="test-close"
        bodyClassName="custom-body-class"
        open={true}
      >
        Content
      </BaseDialog>,
    );
    const dialogBody = container.querySelector('.custom-body-class');
    expect(dialogBody).toBeInTheDocument();
  });

  it('has correct aria attributes', () => {
    const { container } = render(
      <BaseDialog
        id="test-dialog"
        title="Test Title"
        titleId="test-title-id"
        closeButtonId="test-close"
        open={true}
      >
        Content
      </BaseDialog>,
    );
    const dialog = container.querySelector('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby', 'test-title-id');
    expect(dialog).toHaveAttribute('id', 'test-dialog');
  });

  it('renders with open=false initially', () => {
    const { container } = render(
      <BaseDialog
        id="test-dialog"
        title="Dialog"
        titleId="test-title"
        closeButtonId="test-close"
        open={false}
      >
        Content
      </BaseDialog>,
    );
    const dialog = container.querySelector('dialog');
    expect(dialog).toBeInTheDocument();
  });
});
