import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Controlled search input.
 */
export default function SearchBar({ value, onChange }) {
  return (
    <div className="searchbar">
      <input
        type="search"
        className="input"
        placeholder="Search notes..."
        aria-label="Search notes"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
