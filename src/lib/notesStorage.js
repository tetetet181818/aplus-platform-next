export const loadNotesFromStorage = (initialNotes) => {
  try {
    const savedNotes = localStorage.getItem("universityNotes");
    if (savedNotes) {
      return JSON.parse(savedNotes);
    } else {
      localStorage.setItem("universityNotes", JSON.stringify(initialNotes));
      return initialNotes;
    }
  } catch (error) {
    console.error("Error loading notes from storage:", error);
    return initialNotes;
  }
};

export const saveNotesToStorage = (notes) => {
  try {
    localStorage.setItem("universityNotes", JSON.stringify(notes));
  } catch (error) {
    console.error("Error saving notes to storage:", error);
  }
};

export const addNoteLogic = (currentNotes, noteData) => {
  const newNote = {
    ...noteData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    downloads: 0,
    rating: 0,
    reviews: [],
    purchasedBy: [],
  };
  const updatedNotes = [...currentNotes, newNote];
  return { success: true, updatedNotes, payload: newNote };
};

export const updateNoteLogic = (currentNotes, id, updatedData) => {
  const updatedNotes = currentNotes.map((note) =>
    note.id === id
      ? { ...note, ...updatedData, updatedAt: new Date().toISOString() }
      : note
  );
  if (
    updatedNotes.some(
      (note) =>
        note.id === id &&
        JSON.stringify(note) !==
          JSON.stringify(currentNotes.find((n) => n.id === id))
    )
  ) {
    return { success: true, updatedNotes };
  }
  return { success: false, error: "Note not found or no changes made" };
};

export const deleteNoteLogic = (currentNotes, id) => {
  const updatedNotes = currentNotes.filter((note) => note.id !== id);
  if (updatedNotes.length < currentNotes.length) {
    return { success: true, updatedNotes };
  }
  return { success: false, error: "Note not found" };
};

export const addReviewToNoteLogic = (currentNotes, noteId, review) => {
  const noteIndex = currentNotes.findIndex((note) => note.id === noteId);
  if (noteIndex === -1) {
    return { success: false, error: "الملخص غير موجود" };
  }

  const updatedNotes = [...currentNotes];
  const noteToUpdate = { ...updatedNotes[noteIndex] };

  noteToUpdate.reviews = [...(noteToUpdate.reviews || []), review];

  const totalRating = noteToUpdate.reviews.reduce(
    (sum, r) => sum + r.rating,
    0
  );
  noteToUpdate.rating =
    noteToUpdate.reviews.length > 0
      ? parseFloat((totalRating / noteToUpdate.reviews.length).toFixed(1))
      : 0;

  updatedNotes[noteIndex] = noteToUpdate;
  return { success: true, updatedNotes };
};
