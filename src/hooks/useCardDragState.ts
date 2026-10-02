import { useState } from 'react';

/**
 * カード型コンポーネント（FeedCard, GroupCard）の
 * 共通のドラッグ&ドロップ状態を管理するフック
 */
export function useCardDragState() {
  const [dragReady, setDragReady] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isOver, setIsOver] = useState(false);

  const resetDrag = () => {
    setDragReady(false);
    setIsDragging(false);
  };

  const handleDragStart = () => {
    if (!dragReady) return false;
    setIsDragging(true);
    return true;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragReady(false);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const toggleOver = (over: boolean) => {
    setIsOver(over);
  };

  return {
    dragReady,
    setDragReady,
    isDragging,
    setIsDragging,
    isOver,
    setIsOver: toggleOver,
    resetDrag,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
  };
}
