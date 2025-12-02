import React from 'react';
import NoteEditor from '../Notes/NoteEditor';
import EmptyState from '../Common/EmptyState';

/**
 * PUBLIC_INTERFACE
 * Main panel that renders editor for selected note or an empty state.
 */
export default function MainPanel({
  selectedNote,
  onChange,
  onDelete,
  lastSavedAt,
  isSaving
}) {
  return (
    <main className="main" aria-label="Main editor panel">
      <section className="panel" aria-label="Note panel">
        {selectedNote ? (
          <NoteEditor
            note={selectedNote}
            onChange={onChange}
            onDelete={onDelete}
            lastSavedAt={lastSavedAt}
            isSaving={isSaving}
          />
        ) : (
          <EmptyState />
        )}
      </section>
    </main>
  );
}
