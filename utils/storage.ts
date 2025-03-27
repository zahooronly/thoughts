import AsyncStorage from "@react-native-async-storage/async-storage";
import { Note } from "./types";

const NOTES_KEY = "@notes";

export const saveNote = async ({ title, content }: { title: string; content: string }) => {
  const newNote: Note = {
    id: Date.now().toString(),
    title,
    content,
    createdAt: new Date().toISOString(),
  };
  
  const existingNotes = await loadNotes();
  const updatedNotes = [newNote, ...existingNotes];
  await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(updatedNotes));
};

export const loadNotes = async (): Promise<Note[]> => {
  const notesJson = await AsyncStorage.getItem(NOTES_KEY);
  return notesJson ? JSON.parse(notesJson) : [];
};

export const deleteNote = async (id: string) => {
  const existingNotes = await loadNotes();
  const updatedNotes = existingNotes.filter(note => note.id !== id);
  await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(updatedNotes));
};