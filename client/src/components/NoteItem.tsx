import type { Note } from "../types/note.types";

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
    <div className="">
      <h2>{title}</h2>
      <p>{description}</p>
      {tags?.length !== 0 && (
        <div>
          {tags?.map((tag) => (
            <span key={tag._id}>{tag.name}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export default NoteItem;
