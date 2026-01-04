import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { Note, NoteTag } from '../types/note';

const instance = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(config => {
  const token = import.meta.env.VITE_NOTEHUB_TOKEN;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export interface FetchNotesResponse {
  notes: Note[];
  total: number;
  page: number;
  perPage: number;
}

export const fetchNotes = async (
  page = 1,
  perPage = 12,
  search = ''
): Promise<FetchNotesResponse> => {
  const response = await instance.get('/notes', {
    params: { page, perPage, search },
  });

  return response.data;
};

interface CreateNoteParams {
  title: string;
  content: string;
  tag: NoteTag;
}

export const createNote = async (
  note: CreateNoteParams
): Promise<Note> => {
  const response: AxiosResponse<Note> =
    await instance.post('/notes', note);

  return response.data;
};

export const deleteNote = async (id: string): Promise<void> => {
  await instance.delete(`/notes/${id}`);
};
