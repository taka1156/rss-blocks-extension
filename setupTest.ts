import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

// jsdom does not implement showModal/close; toggle `open` so content is accessible.
beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };
});

afterEach(() => {
  cleanup();
});
