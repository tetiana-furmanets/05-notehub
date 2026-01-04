import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { fetchNotes, deleteNote } from '../../services/noteService';
import type { FetchNotesResponse } from '../../services/noteService';

import { LoadingIndicator } from '../LoadingIndicator/LoadingIndicator';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';

import css from './NoteList.module.css';

interface NoteListProps {
  search?: string;
  currentPage: number;
  setTotalPages: (total: number) => void;
}

const EMPTY_DATA: FetchNotesResponse = {
  notes: [],
  total: 0,
  page: 1,
  perPage: 12,
};

const NoteList = ({
  search = '',
  currentPage,
  setTotalPages,
}: NoteListProps) => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', currentPage, search],
    queryFn: () => fetchNotes(currentPage, 12, search),
    initialData: EMPTY_DATA,
  });

  useEffect(() => {
    setTotalPages(Math.ceil(data.total / data.perPage));
  }, [data.total, data.perPage, setTotalPages]);

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (isError) {
    return <ErrorMessage message="Something went wrong" />;
  }

  if (data.notes.length === 0) {
    return <p>No notes found</p>;
  }

  return (
    <ul className={css.list}>
      {data.notes.map(note => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>

          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              onClick={() => deleteMutation.mutate(note.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;
