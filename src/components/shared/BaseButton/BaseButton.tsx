import type { ButtonHTMLAttributes } from 'react';
import { baseButton, buttonIcon, buttonSub } from './BaseButton.css';

type BaseButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'secondary' | 'icon';
};

export function BaseButton({
  className = '',
  type = 'button',
  variant = 'default',
  ...props
}: BaseButtonProps) {
  const variantClass = variant === 'secondary' ? buttonSub : variant === 'icon' ? buttonIcon : '';
  const classes = [baseButton, variantClass, className].filter(Boolean).join(' ');

  return <button className={classes || undefined} type={type} {...props} />;
}
