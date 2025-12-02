import React, { useEffect, useRef, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * A simple note editor for title and content with delete confirmation and save status.
 */
export default function NoteEditor({ note, onChange, onDelete, lastSavedAt, isSaving }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    // Focus title on first open
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, [note?.id]);

  return (
    <>
      <div className="toolbar" aria-label="Editor toolbar">
        <h2 className="editor-title">Edit Note</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="status" aria-live="polite">
            {isSaving ? 'Saving…' : lastSavedAt ? `Saved ${new Date(lastSavedAt).toLocaleTimeString()}` : 'Not saved yet'}
          </div>
          <button
            className="btn btn-danger"
            onClick={() => setShowConfirm(true)}
            aria-haspopup="dialog"
            aria-controls="confirm-delete"
            aria-label="Delete note"
            type="button"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="editor-fields">
        <input
          ref={titleRef}
          className="input title-input"
          placeholder="Title"
          value={note.title || ''}
          onChange={(e) => onChange({ ...note, title: e.target.value })}
          aria-label="Note title"
        />
        <textarea
          className="input textarea"
          placeholder="Write your note here..."
          value={note.content || ''}
          onChange={(e) => onChange({ ...note, content: e.target.value })}
          aria-label="Note content"
        />
      </div>

      {showConfirm && (
        <div className="dialog" role="dialog" aria-modal="true" id="confirm-delete">
          <div className="dialog-card">
            <h3 className="dialog-title">Delete this note?</h3>
            <p className="dialog-desc">This action cannot be undone.</p>
            <div className="dialog-actions">
              <button className="btn" onClick={() => setShowConfirm(false)} type="button">Cancel</button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  setShowConfirm(false);
                  onDelete();
                }}
                autoFocus
                type="button"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
