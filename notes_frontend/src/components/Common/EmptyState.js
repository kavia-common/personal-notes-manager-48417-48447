import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Empty state when no note is selected.
 */
export default function EmptyState() {
  return (
    <div className="emptystate" role="note" aria-label="No note selected">
      Select a note from the left or create a new one.
    </div>
  );
}
