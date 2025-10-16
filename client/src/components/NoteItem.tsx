import type { Note } from "../types/note.types";
import { dateFormatter, trimText } from "../utils";

function NoteItem({
  _id,
  title,
  description,
  userId,
  orderIndex,
  color,
  isPinned,
  tags,
  isArchived,
  isTrash,
  createdAt,
  updatedAt,
}: Note) {
  return (
    <div className="basis-1 lg:basis-1/2 xl:basis-1/3 2xl:basis-1/4 p-2 flex">
      <div className="p-8 bg-lime-400 rounded-2xl overflow-hidden flex flex-col justify-between cursor-pointer w-full">
        <div>
          <h2 className="text-3xl mb-4">{trimText(title, 80)}</h2>
          <p>{trimText(description, 150)}</p>
        </div>
        <div className="mt-6">
          {tags?.length !== 0 && (
            <div className="flex gap-1 flex-wrap">
              {tags?.map((tag) => (
                <span
                  key={tag._id}
                  className="bg-white/70 text-black text-xs font-medium me-2 py-2 px-4 rounded-full"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
          <div className="mt-4">
            <span className="text-xs text-slate-700">
              {dateFormatter(createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoteItem;
