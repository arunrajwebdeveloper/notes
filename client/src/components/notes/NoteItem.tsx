import { Archive, ArchiveRestore, Pin, Redo2, Trash2 } from "lucide-react";
import type { Note } from "../../types/note.types";
import { trimText } from "../../utils";
import { highlightText } from "../../utils/highlightText";
import { formatSmartTime } from "../../utils/dateFormatter";
import TagChip from "./TagChip";
// import ColorMenu from "./ColorMenu";
// import TagsMenu from "./TagsMenu";
import Tooltip from "../common/Tooltip";
import CircleSpinner from "../common/CircleSpinner";

function NoteItem({
  note,
  onEdit,
  searchTest,
  isDeleting,
  onDeleteNote,
}: {
  note: Note;
  onEdit: (note: Note) => void;
  searchTest: string;
  isDeleting: boolean;
  onDeleteNote: (id: string) => void;
}) {
  const currentSearch = searchTest;
  const {
    _id,
    title,
    description,
    color,
    isPinned,
    isArchived,
    isTrash,
    tags,
    updatedAt,
  } = note;

  return (
    <div className="basis-1 sm:basis-1/2 xl:basis-1/3 2xl:basis-1/4 p-2 xl:p-3 flex note-item">
      <div
        style={{
          backgroundColor: color,
          border: color === "#ffffff" ? "1px solid #eee" : "0",
        }}
        className="relative rounded-2xl flex flex-col justify-between cursor-default w-full"
      >
        <div className="p-8 flex-1" onClick={() => onEdit(note)}>
          {isPinned && (
            <button
              disabled
              className="absolute z-10 top-4 right-4 text-gray-700"
            >
              <Pin size={22} fill="currentColor" className="rotate-45" />
            </button>
          )}

          <div>
            <h2 className="text-2xl xl:text-3xl mb-6 break-all">
              {highlightText(trimText(title || "", 80), currentSearch)}
            </h2>
            <p className="m-0 text-black text-sm xl:text-base break-all">
              {highlightText(trimText(description || "", 150), currentSearch)}
            </p>
          </div>
        </div>
        <div className="px-8 pb-2">
          {tags?.length !== 0 && (
            <div className="flex gap-1 flex-wrap">
              {tags?.map(({ _id, name }) => (
                <TagChip key={_id} name={name} onRemoveLabel={() => {}} />
              ))}
            </div>
          )}
          <div className="mt-4 mb-2">
            <span className="text-xs text-slate-700 select-none">
              {`Updated at ${formatSmartTime(updatedAt)}`}
            </span>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 items-center justify-between note-actions">
            <div></div>
            {/* {!isTrash && (
              <div className="flex gap-3 items-center">
                <div className="flex-none">
                  <ColorMenu
                    currentColor={color}
                    onSelect={() => {}}
                    isLoading={false}
                  />
                </div>
                <div className="flex-none">
                  <TagsMenu
                    tags={tags}
                    selectedTags={[]}
                    onChange={() => {}}
                    isLoading={false}
                  />
                </div>
              </div>
            )} */}
            <div className="flex gap-3 items-center">
              {!isTrash && (
                <div className="flex-none">
                  <button
                    onClick={() => {}}
                    disabled={false}
                    className={`w-12 h-12 relative group flex items-center justify-center rounded-full cursor-pointer transition duration-300
                   text-slate-900 `}
                  >
                    {isArchived ? (
                      <ArchiveRestore size={20} />
                    ) : (
                      <Archive size={20} />
                    )}
                    <Tooltip
                      content={isArchived ? "Unarchive" : "Archive"}
                      position="top"
                    />
                  </button>
                </div>
              )}

              {isTrash && (
                <>
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
                </>
              )}
              {!isTrash && (
                <div className="flex-none">
                  <button
                    onClick={() => onDeleteNote(_id)}
                    disabled={isDeleting}
                    className={`w-12 h-12 relative group flex items-center gap-1 justify-center rounded-full cursor-pointer transition duration-300
                   text-slate-900`}
                  >
                    {isDeleting ? (
                      <CircleSpinner size={20} className="text-slate-400" />
                    ) : (
                      <>
                        <Trash2 size={20} />
                        <Tooltip content="Trash" position="top" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoteItem;
