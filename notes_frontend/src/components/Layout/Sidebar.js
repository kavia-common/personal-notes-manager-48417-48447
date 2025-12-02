import React from 'react';
import SearchBar from '../Common/SearchBar';
import NoteList from '../Notes/NoteList';

/**
 * PUBLIC_INTERFACE
 * Sidebar component showing search, actions, and a list of notes.
 */
export default function Sidebar({
  notes,
  selectedId,
  onSelect,
  onCreate,
  search,
  setSearch,
  isSidebarOpen,
  setIsSidebarOpen,
  isApiMode
}) {
  return (
    <aside className="sidebar" aria-label="Notes sidebar">
      <header>
        <div className="brand" aria-label="App brand">
          Notes
          <span className={`badge ${isApiMode ? 'api' : ''}`} aria-label={isApiMode ? 'API mode' : 'Local mode'}>
            {isApiMode ? 'API' : 'Local'}
          </span>
        </div>
        <button
          className="btn sidebar-toggle"
          aria-label={isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          type="button"
        >
          {isSidebarOpen ? 'Hide' : 'Show'}
        </button>
      </header>

      <div className="sidebar-actions">
        <button className="btn btn-primary btn-block" onClick={onCreate} aria-label="Create new note" type="button">
          + New Note
        </button>
      </div>

      <SearchBar value={search} onChange={setSearch} />

      <NoteList notes={notes} selectedId={selectedId} onSelect={onSelect} />
    </aside>
  );
}
