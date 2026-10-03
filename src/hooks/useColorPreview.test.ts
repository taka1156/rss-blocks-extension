import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useColorPreview } from './useColorPreview';

describe('useColorPreview', () => {
  it('uses the default color initially', () => {
    const { result } = renderHook(() => useColorPreview('#111'));
    expect(result.current.previewColor).toBeUndefined();
    expect(result.current.finalColor).toBe('#111');
  });

  it('prefers the preview color and resets back', () => {
    const { result } = renderHook(() => useColorPreview('#111'));
    act(() => result.current.setPreviewColor('#222'));
    expect(result.current.finalColor).toBe('#222');
    act(() => result.current.resetPreview());
    expect(result.current.finalColor).toBe('#111');
  });

  it('keeps an empty-string preview', () => {
    const { result } = renderHook(() => useColorPreview('#111'));
    act(() => result.current.setPreviewColor(''));
    expect(result.current.finalColor).toBe('');
  });
});
