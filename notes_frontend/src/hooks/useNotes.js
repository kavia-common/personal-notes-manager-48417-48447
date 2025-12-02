import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getEnv } from '../utils/env';
import { localStorageService } from '../services/storage/localStorageService';
import { apiServiceFactory } from '../services/storage/apiService';
import { uuidv4 } from '../utils/uuid';

/**
 * PUBLIC_INTERFACE
 * Hook to manage notes: CRUD, selection, search/filter, debounce autosave, and persistence.
 */
export function useNotes() {
  const env = getEnv();
  const isApiMode = !!env.apiBase;
  const storage = useMemo(() => {
    return isApiMode ? apiServiceFactory(env.apiBase) : localStorageService;
  }, [isApiMode, env.apiBase]);

  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [errorBanner, setErrorBanner] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const saveTimer = useRef(null);
  const pendingUpdate = useRef(null);

  const loadNotes = useCallback(async () => {
    try {
      const list = await storage.listNotes();
      setNotes(list);
      if (list.length && !selectedId) {
        setSelectedId(list[0].id);
      }
    } catch (e) {
      setErrorBanner({ type: 'error', message: 'Failed to load notes.' });
    }
  }, [storage, selectedId]);

  useEffect(() => {
    loadNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApiMode]);

  const selectNote = useCallback((id) => setSelectedId(id), []);
  const selectedNote = useMemo(
    () => notes.find(n => n.id === selectedId) || null,
    [notes, selectedId]
  );

  const filteredNotes = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(n =>
      (n.title || '').toLowerCase().includes(q) ||
      (n.content || '').toLowerCase().includes(q)
    );
  }, [notes, search]);

  const createNote = useCallback(async () => {
    const now = new Date().toISOString();
    const note = {
      id: uuidv4(),
      title: '',
      content: '',
      createdAt: now,
      updatedAt: now
    };
    try {
      const created = await storage.createNote(note);
      setNotes(prev => [created, ...prev]);
      setSelectedId(created.id);
    } catch (e) {
      setErrorBanner({ type: 'error', message: 'Failed to create note.' });
    }
  }, [storage]);

  const scheduleSave = useCallback((candidate) => {
    pendingUpdate.current = candidate;
    setIsSaving(true);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      const toSave = pendingUpdate.current;
      if (!toSave) return;
      try {
        const saved = await storage.updateNote({ ...toSave, updatedAt: new Date().toISOString() });
        setNotes(prev => {
          const idx = prev.findIndex(n => n.id === saved.id);
          const next = [...prev];
          if (idx >= 0) next[idx] = saved;
          return next.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
        });
        setLastSavedAt(Date.now());
      } catch (e) {
        setErrorBanner({ type: 'error', message: 'Failed to save note.' });
      } finally {
        setIsSaving(false);
        pendingUpdate.current = null;
      }
    }, 500);
  }, [storage]);

  const updateSelectedNote = useCallback((updated) => {
    setNotes(prev => {
      const idx = prev.findIndex(n => n.id === updated.id);
      const next = [...prev];
      if (idx >= 0) next[idx] = updated;
      return next;
    });
    scheduleSave(updated);
  }, [scheduleSave]);

  const deleteSelectedNote = useCallback(async () => {
    if (!selectedId) return;
    try {
      await storage.deleteNote(selectedId);
      setNotes(prev => prev.filter(n => n.id !== selectedId));
      setSelectedId(prev => {
        const remaining = notes.filter(n => n.id !== prev);
        return remaining.length ? remaining[0].id : null;
      });
    } catch (e) {
      setErrorBanner({ type: 'error', message: 'Failed to delete note.' });
    }
  }, [selectedId, storage, notes]);

  const dismissError = useCallback(() => setErrorBanner(null), []);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 900px)');
    const handler = () => setIsSidebarOpen(!media.matches);
    handler();
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  return {
    isApiMode,
    notes,
    filteredNotes,
    selectedId,
    selectedNote,
    search,
    setSearch,
    createNote,
    selectNote,
    updateSelectedNote,
    deleteSelectedNote,
    isSaving,
    lastSavedAt,
    errorBanner,
    dismissError,
    isSidebarOpen,
    setIsSidebarOpen,
  };
}
