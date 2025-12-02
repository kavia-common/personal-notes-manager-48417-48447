function join(base, path) {
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

async function handle(res) {
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(txt || `HTTP ${res.status}`);
  }
  if (res.status === 204) return null;
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return res.text();
}

/**
 * PUBLIC_INTERFACE
 * Factory returning an API-backed storage service with the required interface.
 */
export function apiServiceFactory(baseUrl) {
  return {
    async listNotes() {
      const data = await handle(await fetch(join(baseUrl, '/notes'), { method: 'GET' }));
      return Array.isArray(data) ? data.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || '')) : [];
    },
    async getNote(id) {
      return handle(await fetch(join(baseUrl, `/notes/${encodeURIComponent(id)}`), { method: 'GET' }));
    },
    async createNote(note) {
      return handle(
        await fetch(join(baseUrl, '/notes'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(note)
        })
      );
    },
    async updateNote(note) {
      return handle(
        await fetch(join(baseUrl, `/notes/${encodeURIComponent(note.id)}`), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(note)
        })
      );
    },
    async deleteNote(id) {
      await handle(await fetch(join(baseUrl, `/notes/${encodeURIComponent(id)}`), { method: 'DELETE' }));
      return { ok: true };
    },
    async bulkImport(notes) {
      // Not specified in API; fall back to POST /notes for each
      const results = [];
      for (const n of notes) {
        const saved = await this.createNote(n);
        results.push(saved);
      }
      return results;
    }
  };
}
