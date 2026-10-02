import { useState } from 'react';

/**
 * EditForm を使うコンポーネント（FeedCard, GroupCard）の
 * 共通の色プレビュー状態を管理するフック
 */
export function useColorPreview(defaultColor: string) {
  const [previewColor, setPreviewColor] = useState<string | undefined>(undefined);

  const finalColor = previewColor ?? defaultColor;

  const resetPreview = () => {
    setPreviewColor(undefined);
  };

  return {
    previewColor,
    setPreviewColor,
    finalColor,
    resetPreview,
  };
}
