import { useState } from "react";
import { Archive, Pin } from "lucide-react";
import type { Note, Tag } from "../../types/note.types";
import { Modal } from "../common/Modal";
import ColorMenu from "../notes/ColorMenu";
import TagsMenu from "../notes/TagsMenu";
import Tooltip from "../common/Tooltip";

interface NoteModalProps {
  isShow: boolean;
  tags: Tag[];
  onClose: () => void;
}

function NoteModal({ isShow = false, tags = [], onClose }: NoteModalProps) {
  const [isPinned, setIsPinned] = useState<boolean>(false);
  const [isArchived, setIsArchived] = useState<boolean>(false);

  const [newNote, setNewNote] = useState<Note>({
    title: "",
    description: "",
    color: "",
    isPinned,
    tags: [],
    isArchived,
  });

  const togglePinned = () => {
    setIsPinned((prev) => !prev);
  };

  return (
    <Modal show={isShow} onHide={onClose}>
      <Modal.Body>
        <div className="space-y-1 p-6">
          <div>
            <input
              type="text"
              name="title"
              placeholder="Title"
              className="border-0 text-gray-900 text-2xl rounded-lg outline-0 block w-full py-3"
            />
          </div>
          <div>
            <textarea
              // value={""}
              // onChange={() => {}}
              placeholder="Description"
              rows={4}
              className="border-0 max-h-92 text-gray-900 text-xl rounded-lg outline-0 block w-full py-3"
            />
          </div>
        </div>
        <div className="flex gap-2 items-center justify-between mt-4 p-6 border-t border-t-slate-200">
          <div className="flex gap-3 items-center">
            <div className="flex-none">
              <ColorMenu
                currentColor="#ffffff"
                onSelect={(e) => console.log("Selected Color: ", e)}
              />
            </div>
            <div className="flex-none">
              <TagsMenu
                tags={tags}
                selectedTags={[
                  {
                    _id: "68efc9040095cbd85b5cc50a",
                    name: "Development",
                  },
                  {
                    _id: "68f1dc16dd9dda265322f58c",
                    name: "Devtools",
                  },
                ]}
                onChange={(e) => console.log("Selected Tags: ", e)}
              />
            </div>
          </div>

          <div className="flex-none">
            <button
              onClick={togglePinned}
              className={`w-12 h-12 relative border border-slate-300 group flex items-center justify-center rounded-full cursor-pointer transition-all
                ${isArchived ? " text-blue-600" : " text-slate-500"}`}
            >
              <Archive size={24} fill={isArchived ? "currentColor" : "none"} />
              <Tooltip
                content={isArchived ? "Unarchive" : "Archive"}
                position="top"
              />
            </button>
          </div>
          <div className="flex-none">
            <button
              onClick={togglePinned}
              className={`w-12 h-12 relative border border-slate-300 group flex items-center justify-center rounded-full cursor-pointer transition-all
                ${isPinned ? " text-blue-600" : " text-slate-500"}`}
            >
              <Pin size={24} fill={isPinned ? "currentColor" : "none"} />
              <Tooltip
                content={isPinned ? "Unpin Note" : "Pin Note"}
                position="top"
              />
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default NoteModal;
