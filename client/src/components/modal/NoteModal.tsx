import { useEffect, useState, type ChangeEvent } from "react";
import { Archive, Pin, X } from "lucide-react";
import type { NewNoteState, Tag } from "../../types/note.types";
import { Modal } from "../common/Modal";
import ColorMenu from "../notes/ColorMenu";
import TagsMenu from "../notes/TagsMenu";
import Tooltip from "../common/Tooltip";
import type { UseMutationResult } from "@tanstack/react-query";
import CircleSpinner from "../common/CircleSpinner";

interface NoteModalProps {
  isShow: boolean;
  tags: Tag[];
  onHide: () => void;
  createNoteMutation: UseMutationResult<
    any, // TData → success return type
    unknown, // TError → error type
    any, // TVariables → argument type passed to mutate() : eg: Note
    unknown // TContext → optional rollback context
  >;
}

function NoteModal({
  isShow = false,
  tags = [],
  onHide,
  createNoteMutation,
}: NoteModalProps) {
  const initialState = {
    title: "",
    description: "",
    color: "",
    isPinned: false,
    tags: [],
    isArchived: false,
  };

  const [newNote, setNewNote] = useState<NewNoteState>(initialState);

  useEffect(() => {
    setNewNote(initialState);
  }, [isShow]);

  const isLoading = createNoteMutation.isPending;
  const valideNote =
    newNote?.title?.trim()?.length !== 0 &&
    newNote?.description?.trim()?.length !== 0;

  const onSubmitNote = () => {
    if (valideNote) {
      const tagIds = newNote?.tags?.map((n) => n?._id) || [];
      createNoteMutation.mutate({ ...newNote, tags: tagIds });
    }
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
    <Modal show={isShow} onHide={onHide}>
      <Modal.Body
        className="rounded-lg relative"
        style={{ backgroundColor: newNote?.color }}
      >
        {/* {isLoading && (
          <div className="w-full h-full absolute z-10 flex justify-center items-center bg-white/50 rounded-lg">
            <CircleSpinner size={36} className="text-blue-600" />
          </div>
        )} */}

        <div className="space-y-1 p-6">
          <div>
            <input
              type="text"
              name="title"
              value={newNote?.title}
              placeholder="Title"
              className="border-0 text-gray-900 text-2xl rounded-lg outline-0 block w-full py-3"
              onChange={onChangeHandler}
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
            />
          </div>

          {newNote?.tags?.length !== 0 && (
            <div className="flex gap-2 flex-wrap mt-4 select-none">
              {newNote?.tags?.map((tag) => (
                <div
                  key={tag._id}
                  className="bg-black/30 p-1 flex items-center justify-between gap-2 text-white text-sm rounded-full"
                >
                  <span className="ps-2">{tag.name}</span>
                  <div
                    onClick={() => onRemoveLabel(tag?._id)}
                    className="rounded-full w-6 h-6 flex cursor-pointer bg-black/30"
                  >
                    <X size={16} className="m-auto" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Note Modal Footer */}
        <div className="bg-white rounded-b-lg">
          <div className="flex gap-2 items-center justify-between px-6 py-4 border-t border-t-slate-800/10">
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
                  className={`w-12 h-12 relative border border-slate-300 group flex items-center justify-center rounded-full cursor-pointer transition-all
                ${newNote?.isArchived ? " text-blue-600" : " text-slate-500"}`}
                >
                  <Archive size={24} />
                  {!isLoading && (
                    <Tooltip
                      content={newNote?.isArchived ? "Unarchive" : "Archive"}
                      position="top"
                    />
                  )}
                </button>
              </div>
              <div className="flex-none">
                <button
                  onClick={togglePinned}
                  disabled={isLoading}
                  className={`w-12 h-12 relative border border-slate-300 group flex items-center justify-center rounded-full cursor-pointer transition-all
                ${newNote?.isPinned ? " text-blue-600" : " text-slate-500"}`}
                >
                  <Pin size={24} />
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
                onClick={onSubmitNote}
                disabled={isLoading || !valideNote}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-70 disabled:cursor-default transition duration-300 text-white h-12 px-4 rounded-md cursor-pointer text-sm"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <CircleSpinner size={20} className="text-white" />
                    <span>Creating...</span>
                  </div>
                ) : (
                  <span>Create Note</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default NoteModal;
