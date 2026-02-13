import { useState } from "react";

type InfoTypes = "note" | "trash" | "tag" | null;

export const useDelete = () => {
  const [deleteInfo, setDeleteInfo] = useState<{
    isOpen: boolean;
    id: string | null;
    action: InfoTypes;
  }>({
    isOpen: false,
    id: null,
    action: null,
  });

  const onDelete = (info: { id: string | null; action: InfoTypes }) => {
    const { id, action } = info;
    setDeleteInfo({
      isOpen: true,
      id,
      action,
    });
  };

  const resetDeleteInfo = () => {
    setDeleteInfo({
      isOpen: true,
      id: null,
      action: null,
    });
  };

  return {
    deleteInfo,
    onDelete,
    resetDeleteInfo,
  };
};
