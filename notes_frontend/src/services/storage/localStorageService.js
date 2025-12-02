const KEY = 'notes_v1';

function safeParse(json, fallback) {
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v : fallback;
  } catch {
    return fallback;
  }
}

function readAll() {
  const raw = window.localStorage.getItem(KEY);
  const list = safeParse(raw, []);
  return list.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
}

function writeAll(list) {
  window.localStorage.setItem(KEY, JSON.stringify(list));
}

/**
 * PUBLIC_INTERFACE
 * Local storage service: listNotes, getNote, createNote, updateNote, deleteNote, bulkImport
 */
export const localStorageService = {
  async listNotes() {
    return readAll();
  },
  async getNote(id) {
    return readAll().find(n => n.id === id) || null;
  },
  async createNote(note) {
    const list = readAll();
    const exists = list.find(n => n.id === note.id);
    if (exists) {
      // overwrite
      const idx = list.findIndex(n => n.id === note.id);
      list[idx] = note;
      writeAll(list);
      return note;
    }
    const next = [note, ...list];
    writeAll(next);
    return note;
  },
  async updateNote(note) {
    const list = readAll();
    const idx = list.findIndex(n => n.id === note.id);
    if (idx >= 0) {
      list[idx] = note;
    } else {
      list.unshift(note);
    }
    writeAll(list);
    return note;
  },
  async deleteNote(id) {
    const list = readAll();
    const next = list.filter(n => n.id !== id);
    writeAll(next);
    return { ok: true };
  },
  async bulkImport(notes) {
    const list = readAll();
    const byId = new Map(list.map(n => [n.id, n]));
    for (const n of notes) {
      byId.set(n.id, n);
    }
    const next = Array.from(byId.values()).sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
    writeAll(next);
    return next;
  }
};
