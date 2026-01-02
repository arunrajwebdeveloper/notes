import { useEffect, useState, type ChangeEvent } from "react";
import { Archive, Pin, Redo2, Trash2 } from "lucide-react";
import { isEqual } from "lodash";
import type { NewNoteState, Note, Tag } from "../../types/note.types";
import { Modal } from "../common/Modal";
import ColorMenu from "../notes/ColorMenu";
import TagsMenu from "../notes/TagsMenu";
import Tooltip from "../common/Tooltip";
import type { UseMutationResult } from "@tanstack/react-query";
import CircleSpinner from "../common/CircleSpinner";
import TagChip from "../notes/TagChip";

interface NoteModalProps {
  isShow: boolean;
  mode: "create" | "edit";
  tags: Tag[];
  onHide: () => void;
  createNoteMutation: UseMutationResult<
    any, // TData → success return type
    unknown, // TError → error type
    any, // TVariables → argument type passed to mutate() : eg: Note
    unknown // TContext → optional rollback context
  >;
  updateNoteMutation: UseMutationResult<
    any,
    unknown,
    { id: string; payload: any }
  >;
  selectedNote?: Note | null;
}

function NoteModal({
  isShow,
  mode,
  tags,
  selectedNote,
  createNoteMutation,
  updateNoteMutation,
  onHide,
}: NoteModalProps) {
  const initialState = {
    title: "",
    description: "",
    color: "#ffffff",
    isPinned: false,
    tags: [],
    isArchived: false,
  };

  const [originalNote, setOriginalNote] = useState<NewNoteState | null>(null);
  const [newNote, setNewNote] = useState<NewNoteState>(initialState);
  const [isChanged, setIsChanged] = useState(false);

  const isValid = newNote.title.trim() && newNote.description.trim();

  const tagIds = newNote?.tags?.map((n) => n?._id);
  const payload = { ...newNote, tags: tagIds };

  useEffect(() => {
    if (mode === "edit" && selectedNote) {
      setOriginalNote(selectedNote);
      setNewNote(selectedNote);
    } else {
      setNewNote(initialState);
    }
  }, [isShow, mode, selectedNote]);

  useEffect(() => {
    if (!originalNote) return;
    setIsChanged(!isEqual(newNote, originalNote));
  }, [newNote, originalNote]);

  const submitNewNote = () => {
    if (isValid) {
      createNoteMutation.mutate(payload);
      setNewNote(initialState);
    }
  };

  const submitUpdatedNote = () => {
    if (isChanged && isValid) {
      updateNoteMutation.mutate({
        id: selectedNote?._id as string,
        payload: { ...payload, isArchived: false },
      });
      setNewNote(initialState);
    }
  };

  const isLoading =
    createNoteMutation.isPending || updateNoteMutation.isPending;

  const handleSubmit = () => {
    if (mode === "edit") {
      submitUpdatedNote();
    } else {
      submitNewNote();
    }
  };

  const onHideModal = () => {
    handleSubmit();
    onHide();
  };

  const togglePinned = () => {
    setNewNote((prev) => ({ ...prev, isPinned: !prev?.isPinned }));
  };

  const toggleArchived = () => {
    setNewNote((prev) => ({ ...prev, isArchived: !prev?.isArchived }));
  };

  const onChangeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewNote((prev) => ({ ...prev, [name]: value }));
  };

  const onSelectColor = (value: string) => {
    setNewNote((prev) => ({ ...prev, color: value }));
  };

  const onSelectTags = (tags: Tag[]) => {
    setNewNote((prev) => ({ ...prev, tags }));
  };

  const onRemoveLabel = (tagId: string) => {
    setNewNote((prev) => ({
      ...prev,
      tags: prev?.tags?.filter((t) => t?._id !== tagId),
    }));
  };

  return (
    <Modal show={isShow} onHide={onHideModal}>
      <Modal.Body
        className="rounded-lg relative"
        style={{ backgroundColor: newNote?.color }}
      >
        {/* 
          <div className="w-full h-full absolute z-10 flex justify-center items-center bg-white/50 rounded-lg">
            <CircleSpinner size={36} className="text-blue-600" />
          </div>
        */}

        <div className="space-y-1 p-6">
          <div>
            <input
              type="text"
              name="title"
              value={newNote?.title}
              placeholder="Title"
              className="border-0 text-gray-900 text-2xl rounded-lg outline-0 block w-full py-3"
              onChange={onChangeHandler}
              disabled={isLoading || selectedNote?.isTrash}
            />
          </div>
          <div>
            <textarea
              value={newNote?.description}
              placeholder="Description"
              name="description"
              rows={8}
              className="border-0 max-h-92 text-gray-900 text-xl rounded-lg outline-0 block w-full py-3"
              onChange={onChangeHandler}
              disabled={isLoading || selectedNote?.isTrash}
            />
          </div>

          {newNote?.tags?.length !== 0 && (
            <div className="flex gap-2 flex-wrap mt-4 select-none">
              {newNote?.tags?.map(({ _id, name }) => (
                <TagChip
                  key={_id}
                  name={name}
                  isLoading={isLoading}
                  onRemoveLabel={() => onRemoveLabel(_id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Note Modal Footer */}

        <div className="rounded-b-lg">
          <div className="flex gap-2 items-center justify-between px-6 py-4 border-t border-t-slate-800/10">
            {selectedNote?.isTrash && (
              <div className="flex-none flex items-center  gap-2">
                <div className="flex-none">
                  <button
                    onClick={() => {}}
                    disabled={false}
                    className={`w-12 h-12 relative group flex items-center gap-1 justify-center rounded-full cursor-pointer transition duration-300
                   text-slate-900 `}
                  >
                    <Redo2 size={20} />
                    <Tooltip content="Restore" position="top" />
                  </button>
                </div>
                <div className="flex-none">
                  <button
                    onClick={() => {}}
                    disabled={false}
                    className={`w-12 h-12 relative group flex items-center gap-1 justify-center rounded-full cursor-pointer transition duration-300
                   text-slate-900 `}
                  >
                    <Trash2 size={20} />
                    <Tooltip content="Delete Forever" position="top" />
                  </button>
                </div>
              </div>
            )}

            {!selectedNote?.isTrash && (
              <>
                <div className="flex gap-3 items-center">
                  <div className="flex-none">
                    <ColorMenu
                      currentColor={newNote?.color}
                      onSelect={onSelectColor}
                      isLoading={isLoading}
                    />
                  </div>
                  <div className="flex-none">
                    <TagsMenu
                      tags={tags}
                      selectedTags={newNote?.tags}
                      onChange={onSelectTags}
                      isLoading={isLoading}
                    />
                  </div>
                  <div className="flex-none">
                    <button
                      onClick={toggleArchived}
                      disabled={isLoading}
                      className={`w-12 h-12 relative group flex items-center justify-center rounded-full cursor-pointer transition duration-300
                ${
                  newNote?.isArchived
                    ? " bg-blue-600 text-white"
                    : " text-slate-900"
                }`}
                    >
                      <Archive size={20} />
                      {!isLoading && (
                        <Tooltip
                          content={
                            newNote?.isArchived ? "Unarchive" : "Archive"
                          }
                          position="top"
                        />
                      )}
                    </button>
                  </div>
                  <div className="flex-none">
                    <button
                      onClick={togglePinned}
                      disabled={isLoading}
                      className={`w-12 h-12 relative  group flex items-center justify-center rounded-full cursor-pointer transition duration-300
                ${
                  newNote?.isPinned
                    ? " bg-blue-600 text-white"
                    : " text-slate-900"
                }`}
                    >
                      <Pin size={20} />
                      {!isLoading && (
                        <Tooltip
                          content={newNote?.isPinned ? "Unpin" : "Pin"}
                          position="top"
                        />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-end">
                  <button
                    onClick={handleSubmit}
                    disabled={
                      isLoading || !isValid || (mode === "edit" && !isChanged)
                    }
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-70 disabled:cursor-default transition duration-300 text-white h-12 px-4 rounded-md cursor-pointer text-sm"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <CircleSpinner size={20} className="text-white" />
                        <span>
                          {mode === "edit" ? "Updating..." : "Creating..."}
                        </span>
                      </div>
                    ) : (
                      <span>
                        {mode === "edit" ? "Update Note" : "Create Note"}
                      </span>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default NoteModal;
