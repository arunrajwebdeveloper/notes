import { useState } from "react";
import type { DeleteInfoStateTypes, OnDeleteTypes } from "../types/note.types";

export const useDelete = () => {
  const [deleteInfo, setDeleteInfo] = useState<DeleteInfoStateTypes>({
    isOpen: false,
    id: null,
    action: null,
  });

  const onDelete = (info: OnDeleteTypes) => {
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
