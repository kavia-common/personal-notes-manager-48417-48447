import React from 'react';
import NoteItem from './NoteItem';

/**
 * PUBLIC_INTERFACE
 * Renders a list of notes with selection support.
 */
export default function NoteList({ notes, selectedId, onSelect }) {
  return (
    <div className="note-list" role="list" aria-label="Notes list">
      {notes.map(n => (
        <NoteItem
          key={n.id}
          note={n}
          selected={n.id === selectedId}
          onClick={() => onSelect(n.id)}
        />
      ))}
      {notes.length === 0 && (
        <div className="emptystate" role="note">No notes found.</div>
      )}
    </div>
  );
}
