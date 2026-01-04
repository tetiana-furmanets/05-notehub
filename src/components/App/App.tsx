import React, { useState } from 'react';
import { useDebounce } from 'use-debounce';
import css from './App.module.css';
import NoteList from '../NoteList/NoteList';
import SearchBox from '../SearchBox/SearchBox';
import { Pagination } from '../Pagination/Pagination';
import { Modal } from '../Modal/Modal';
import { NoteForm } from '../NoteForm/NoteForm';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={setSearch} />

        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      <NoteList
        search={debouncedSearch}
        currentPage={currentPage}
        setTotalPages={setTotalPages}
      />

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onClose={() => setIsModalOpen(false)}
            onCreated={() => setCurrentPage(1)} // Повертаємося на першу сторінку після створення
          />
        </Modal>
      )}
    </div>
  );
};

export default App;
