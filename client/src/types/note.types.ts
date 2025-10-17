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
