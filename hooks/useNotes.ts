import { useState, useCallback, useEffect } from 'react';
import { loadNotes, deleteNote } from '@/utils/storage';
import { Note } from '@/utils/types';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

  const loadAllNotes = useCallback(async () => {
    const savedNotes = await loadNotes();
    setNotes(savedNotes);
    setFilteredNotes(savedNotes);
  }, []);

  const handleDeleteNote = async (id: string) => {
    await deleteNote(id);
    loadAllNotes();
  };

  const handleReloadNotes = async () => {
    setNotes([]);
    setFilteredNotes([]);
    setTimeout(loadAllNotes, 300);
  };

  useEffect(() => {
    loadAllNotes();
  }, [loadAllNotes]);

  return {
    notes,
    filteredNotes,
    setFilteredNotes,
    handleDeleteNote,
    handleReloadNotes,
  };
}