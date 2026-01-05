import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';

import css from './App.module.css';

import SearchBox from '../SearchBox/SearchBox';
import NoteList from '../NoteList/NoteList';
import { Pagination } from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import { NoteForm } from '../NoteForm/NoteForm';

import { fetchNotes } from '../../services/noteService';
import type { Note, FetchNotesResponse } from '../../services/noteService';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading, isError } = useQuery<FetchNotesResponse, Error>({
    queryKey: ['notes', currentPage, debouncedSearch],
    queryFn: () => fetchNotes(currentPage, 12, debouncedSearch),
    staleTime: 500, 
  });

  const notes: Note[] = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearch} />

        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}

        <button
          className={css.button}
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading notes</p>}

      {!isLoading && !isError && <NoteList notes={notes} />}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onClose={() => setIsModalOpen(false)}
            onCreated={() => setCurrentPage(1)}
          />
        </Modal>
      )}
    </div>
  );
};

export default App;
