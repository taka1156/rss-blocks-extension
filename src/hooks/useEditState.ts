import { useState } from 'react';

/**
 * EditForm を使うコンポーネントの編集状態を管理するフック
 */
export function useEditState() {
  const [editing, setEditing] = useState(false);

  const openEdit = () => {
    setEditing(true);
  };

  const closeEdit = () => {
    setEditing(false);
  };

  const toggleEdit = () => {
    setEditing((prev) => !prev);
  };

  return {
    editing,
    setEditing,
    openEdit,
    closeEdit,
    toggleEdit,
  };
}
