import { v4 as uuidv4 } from 'uuid';

export const addNote = (notes, noteData) => {
  const newNote = {
    id: uuidv4(),
    ...noteData,
    createdAt: new Date().toISOString(),
    downloads: 0,
    rating: 0,
    reviews: [],
    purchasedBy: []
  };
  return { success: true, updatedNotes: [...notes, newNote], payload: newNote };
};

export const updateNote = (notes, id, updatedData) => {
  const noteIndex = notes.findIndex(note => note.id === id);
  if (noteIndex === -1) {
    return { success: false, error: "الملخص غير موجود" };
  }
  const updatedNotes = [...notes];
  updatedNotes[noteIndex] = { ...updatedNotes[noteIndex], ...updatedData, updatedAt: new Date().toISOString() };
  return { success: true, updatedNotes, payload: updatedNotes[noteIndex] };
};

export const deleteNote = (notes, id) => {
  const updatedNotes = notes.filter(note => note.id !== id);
  if (updatedNotes.length === notes.length) {
    return { success: false, error: "الملخص غير موجود" };
  }
  return { success: true, updatedNotes };
};

export const addReviewToNote = (notes, noteId, review) => {
  const noteIndex = notes.findIndex(note => note.id === noteId);
  if (noteIndex === -1) {
    return { success: false, error: "الملخص غير موجود" };
  }
  
  const updatedNotes = [...notes];
  const noteToUpdate = { ...updatedNotes[noteIndex] };
  
  if (!noteToUpdate.reviews) {
    noteToUpdate.reviews = [];
  }
  
  noteToUpdate.reviews.push(review);
  
  const totalRating = noteToUpdate.reviews.reduce((sum, r) => sum + r.rating, 0);
  noteToUpdate.rating = parseFloat((totalRating / noteToUpdate.reviews.length).toFixed(1));
  
  updatedNotes[noteIndex] = noteToUpdate;
  
  return { success: true, updatedNotes, payload: noteToUpdate };
};

export const deleteUserNotes = (notes, userId) => {
  const updatedNotes = notes.filter(note => note.authorId !== userId);
  if (updatedNotes.length === notes.length) {
    // No notes found for this user, or no notes to delete.
    // This can be considered a success if the goal is to ensure no notes for this user exist.
    return { success: true, updatedNotes }; 
  }
  return { success: true, updatedNotes };
};