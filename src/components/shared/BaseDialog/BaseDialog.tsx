import { type ReactNode, useEffect, useRef } from 'react';
import { BaseButton } from '@/components/shared/BaseButton/BaseButton';
import { dialog, dialogBody, dialogHeader, dialogTitle } from './BaseDialog.css';

type BaseDialogProps = {
  id: string;
  title: string;
  titleId: string;
  closeButtonId: string;
  bodyClassName?: string;
  open?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
};

export function BaseDialog({
  id,
  title,
  titleId,
  closeButtonId,
  bodyClassName = '',
  open = false,
  onClose,
  onOpenChange,
  children,
}: BaseDialogProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const bodyClasses = [dialogBody, bodyClassName].filter(Boolean).join(' ');

  useEffect(() => {
    const element = dialogRef.current;
    if (!element) return;

    if (open && !element.open) {
      element.showModal();
    }
    if (!open && element.open) {
      element.close();
    }
  }, [open]);

  useEffect(() => {
    const element = dialogRef.current;
    if (!element) return;

    const handleClose = () => {
      onOpenChange?.(false);
    };

    element.addEventListener('close', handleClose);
    return () => element.removeEventListener('close', handleClose);
  }, [onOpenChange]);

  const handleClose = () => {
    onClose?.();
    onOpenChange?.(false);
  };

  return (
    <dialog
      ref={dialogRef}
      id={id}
      className={dialog}
      aria-labelledby={titleId}
      onClose={() => onOpenChange?.(false)}
    >
      <div className={dialogHeader}>
        <h2 id={titleId} className={dialogTitle}>
          {title}
        </h2>
        <BaseButton
          id={closeButtonId}
          type="button"
          variant="icon"
          aria-label="閉じる"
          onClick={handleClose}
        >
          ×
        </BaseButton>
      </div>
      <div className={bodyClasses}>{children}</div>
    </dialog>
  );
}
