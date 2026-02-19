export interface Tag {
  _id: string;
  name: string;
}

export interface Note {
  _id: string;
  title: string;
  description: string;
  userId: string;
  orderIndex: number;
  color: string;
  isPinned: boolean;
  tags: Tag[];
  isArchived: boolean;
  isTrash: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotesResponse {
  total: number;
  limit: number;
  page: number;
  result: Note[];
  hasNext: boolean;
  hasPrev: boolean;
}

export interface TagItem extends Tag {
  noteCount: number;
}

export interface NewNoteState {
  title: string;
  description: string;
  color: string;
  isPinned: boolean;
  tags: Tag[];
  isArchived: boolean;
}

export type NoteType = "active" | "archive" | "trash";
export interface NoteFilterState {
  limit: number;
  search: string;
  tagId: string | null;
  sortBy: string;
  sortOrder: "asc" | "desc";
  noteType: NoteType;
}

export type DeleteInfoTypes = "note" | "trash" | "tag" | null;

export type DeleteInfoStateTypes = {
  isOpen: boolean;
  id: string | null;
  action: DeleteInfoTypes;
};

export type OnDeleteTypes = { id: string | null; action: DeleteInfoTypes };

export type ToggleArchiveType = {
  id: string;
  type: "archive" | "unarchive";
};
