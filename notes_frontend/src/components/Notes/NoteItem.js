import React from 'react';

/**
 * Format time from ISO string into a readable short form.
 */
function formatUpdatedAt(iso) {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return '';
  }
}

/**
 * PUBLIC_INTERFACE
 * Note item row.
 */
export default function NoteItem({ note, selected, onClick }) {
  const title = (note.title && note.title.trim()) || (note.content || '').split('\n')[0] || 'Untitled';
  const snippet = (note.content || '').replace(/\n+/g, ' ').slice(0, 120);

  return (
    <div
      className="note-item"
      role="listitem"
      aria-selected={selected ? 'true' : 'false'}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div>
        <p className="note-title">{title}</p>
        <p className="note-snippet">{snippet || 'No content yet...'}</p>
      </div>
      <div className="note-updated" aria-label="Last updated">
        {formatUpdatedAt(note.updatedAt)}
      </div>
    </div>
  );
}
