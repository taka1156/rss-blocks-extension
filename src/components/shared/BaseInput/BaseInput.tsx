import type { InputHTMLAttributes } from 'react';

export function BaseInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} />;
}
