import React from 'react';
import './App.css';
import './index.css';
import Sidebar from './components/Layout/Sidebar';
import MainPanel from './components/Layout/MainPanel';
import { useNotes } from './hooks/useNotes';

// PUBLIC_INTERFACE
function App() {
  /**
   * Note taking app main shell.
   * Renders a responsive layout with a sidebar and an editor panel,
   * using the useNotes hook for state, persistence, and API/localStorage abstraction.
   */
  const notesApi = useNotes();

  return (
    <div className="app-root" role="application" aria-label="Personal Notes Manager">
      <div className="app-gradient-bg" aria-hidden="true" />
      {notesApi.errorBanner && (
        <div className={`toast ${notesApi.errorBanner.type}`} role="status" aria-live="polite">
          <div className="toast-message">{notesApi.errorBanner.message}</div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={notesApi.dismissError}
            aria-label="Dismiss notification"
            type="button"
          >
            Dismiss
          </button>
        </div>
      )}
      <div className={`layout ${notesApi.isSidebarOpen ? '' : 'sidebar-collapsed'}`}>
        <Sidebar
          notes={notesApi.filteredNotes}
          selectedId={notesApi.selectedId}
          onSelect={notesApi.selectNote}
          onCreate={notesApi.createNote}
          search={notesApi.search}
          setSearch={notesApi.setSearch}
          isSidebarOpen={notesApi.isSidebarOpen}
          setIsSidebarOpen={notesApi.setIsSidebarOpen}
          isApiMode={notesApi.isApiMode}
        />
        <MainPanel
          selectedNote={notesApi.selectedNote}
          onChange={notesApi.updateSelectedNote}
          onDelete={notesApi.deleteSelectedNote}
          lastSavedAt={notesApi.lastSavedAt}
          isSaving={notesApi.isSaving}
        />
      </div>
    </div>
  );
}

export default App;
