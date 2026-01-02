import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { CircleCheck, CircleX, Trash2 } from "lucide-react";
import { isEqual } from "lodash";
import type { TagItem } from "../../types/note.types";
import { Modal } from "../common/Modal";
import type { UseMutationResult } from "@tanstack/react-query";
import CircleSpinner from "../common/CircleSpinner";
import ConfirmModal from "./ConfirmModal";

interface TagsManageModalProps {
  isShow: boolean;
  tags: TagItem[];
  onHide: () => void;
  createTagMutation: UseMutationResult<any, unknown, { name: string }>;
  updateTagMutation: UseMutationResult<
    any,
    unknown,
    { id: string; payload: any }
  >;
  deleteTagMutation: UseMutationResult<any, unknown, { id: string }>;
}

function TagsManageModal({
  isShow,
  tags = [],
  onHide,
  createTagMutation,
  updateTagMutation,
  deleteTagMutation,
}: TagsManageModalProps) {
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const newTagRef = useRef<HTMLInputElement | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTagValue, setNewTagValue] = useState("");
  const [editingValue, setEditingValue] = useState<string>("");
  const [originalValue, setOriginalValue] = useState<string>("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isOpenConfirm, setIsOpenConfirm] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({
    isOpen: false,
    id: null,
  });

  /** Focus input when editing starts */
  useEffect(() => {
    if (editingId && inputRefs.current[editingId]) {
      inputRefs.current[editingId]?.focus();
    }
  }, [editingId]);

  /** Start edit mode */
  const handleEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditingValue(currentName);
    setOriginalValue(currentName);
  };

  /** Handle name input change */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditingValue(e.target.value);
  };

  /** Cancel editing */
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingValue("");
    setOriginalValue("");
  };

  /** Save edited tag only if changed */
  const handleSaveEdit = (id: string) => {
    if (
      !isEqual(editingValue.trim(), originalValue.trim()) &&
      !!editingValue.trim()
    ) {
      setUpdatingId(id);
      updateTagMutation.mutate(
        {
          id,
          payload: { name: editingValue.trim() },
        },
        {
          onSettled: () => {
            setUpdatingId(null);
          },
        }
      );
    }
    setEditingId(null);
    setEditingValue("");
    setOriginalValue("");
  };

  /** Delete a tag */
  const handleDelete = (id: string | null) => {
    if (id) {
      deleteTagMutation.mutate(
        { id },
        {
          onSettled: () => {
            setIsOpenConfirm({
              isOpen: false,
              id: null,
            });
          },
        }
      );
    }
  };

  /** Create new tag */
  const handleCreateTag = () => {
    const name = newTagValue.trim();
    if (!name) return;
    createTagMutation.mutate(
      { name },
      {
        onSuccess: () => {
          setNewTagValue("");
        },
      }
    );
    setNewTagValue("");
  };

  const handleCancelCreate = () => {
    setNewTagValue("");
  };

  return (
    <>
      <Modal show={isShow} onHide={onHide} className="max-w-xs">
        <Modal.Header onClose={onHide} closeButton>
          <span className="text-lg text-slate-600 font-medium">
            Manage Tags
          </span>
        </Modal.Header>

        <Modal.Body className="relative border-t border-t-slate-300">
          <div className="flex flex-col justify-between h-full max-h-[500px]">
            <div
              className="py-4 h-[calc(100%-48px)] overflow-y-auto flex flex-col transition duration-300
              [&::-webkit-scrollbar]:w-1
              [&::-webkit-scrollbar-track]:bg-white
              [&::-webkit-scrollbar-thumb]:bg-white
              hover:[&::-webkit-scrollbar-track]:bg-gray-100
              hover:[&::-webkit-scrollbar-thumb]:bg-gray-400"
            >
              {tags?.length !== 0 ? (
                tags.map((t) => (
                  <div
                    key={t._id}
                    className="flex justify-between items-center gap-4 py-2 ps-6 pe-3 group"
                  >
                    {editingId === t._id ? (
                      <div className="flex-1">
                        <input
                          ref={(el) => {
                            inputRefs.current[t._id] = el;
                          }}
                          type="text"
                          placeholder="Edit Tag"
                          className="ring-0 outline-0 w-full text-gray-600 text-sm font-normal"
                          value={editingValue}
                          onChange={handleChange}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveEdit(t._id);
                          }}
                          // onBlur={handleCancelEdit}
                        />
                      </div>
                    ) : (
                      <div
                        onClick={() => handleEdit(t._id, t.name)}
                        className="flex-1 text-sm font-normal whitespace-nowrap overflow-hidden text-ellipsis text-gray-600 cursor-pointer"
                      >
                        {t.name}
                      </div>
                    )}

                    <div className="opacity-0 group-hover:opacity-100 transition duration-300 flex items-center gap-1">
                      {editingId === t._id ? (
                        <>
                          <button
                            onClick={handleCancelEdit}
                            className="cursor-pointer text-gray-600"
                          >
                            <CircleX
                              size={26}
                              stroke="white"
                              fill="currentColor"
                            />
                          </button>
                          <button
                            onClick={() => handleSaveEdit(t._id)}
                            className="cursor-pointer text-gray-600"
                            disabled={
                              updateTagMutation.isPending &&
                              updatingId === t._id
                            }
                          >
                            {updateTagMutation.isPending &&
                            updatingId === t._id ? (
                              <CircleSpinner size={26} />
                            ) : (
                              <CircleCheck
                                size={26}
                                stroke="white"
                                fill="currentColor"
                              />
                            )}
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() =>
                            setIsOpenConfirm({
                              isOpen: true,
                              id: t._id,
                            })
                          }
                          className="cursor-pointer text-gray-600"
                          disabled={
                            deleteTagMutation.isPending &&
                            isOpenConfirm?.id === t._id
                          }
                        >
                          {deleteTagMutation.isPending &&
                          isOpenConfirm?.id === t._id ? (
                            <CircleSpinner size={18} />
                          ) : (
                            <Trash2 size={20} />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-sm text-center py-6">
                  No tags yet
                </div>
              )}
            </div>

            {/* Create new tag */}
            <div className="h-12 ps-6 pe-3 flex flex-none gap-3 justify-between items-center border-t border-t-slate-300">
              <div className="flex-1">
                <input
                  ref={newTagRef}
                  type="text"
                  value={newTagValue}
                  placeholder="Create Tag"
                  className="ring-0 outline-0 w-full text-gray-600"
                  onChange={(e) => setNewTagValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreateTag();
                  }}
                />
              </div>
              <div className="flex items-center justify-end gap-2">
                {newTagValue && (
                  <button
                    onClick={handleCancelCreate}
                    className="text-gray-600 cursor-pointer"
                  >
                    <CircleX size={26} stroke="white" fill="currentColor" />
                  </button>
                )}
                <button
                  className="text-gray-600 cursor-pointer disabled:opacity-80 disabled:cursor-default"
                  onClick={handleCreateTag}
                  disabled={createTagMutation.isPending || !newTagValue?.trim()}
                >
                  {createTagMutation.isPending ? (
                    <CircleSpinner size={22} />
                  ) : (
                    <CircleCheck size={26} stroke="white" fill="currentColor" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Confirm */}

      <ConfirmModal
        isShow={isOpenConfirm?.isOpen}
        isLoading={deleteTagMutation.isPending}
        title="Delete confirm?"
        description="Are you sure you want to delete this tag?"
        onClose={() =>
          setIsOpenConfirm({
            isOpen: false,
            id: null,
          })
        }
        onConfirm={() => {
          handleDelete(isOpenConfirm?.id);
        }}
      />
    </>
  );
}

export default TagsManageModal;
