export const searchNotesLogic = (notes, query, filters) => {
  const { university, college, subject, year, sortBy } = filters;
  let filtered = notes.filter(note => 
    note && note.authorId && note.authorId.trim() !== "" && note.author && note.author.trim() !== ""
  );

  if (query) {
    const lowerQuery = query.toLowerCase();
    filtered = filtered.filter(note =>
      note.title.toLowerCase().includes(lowerQuery) ||
      note.description.toLowerCase().includes(lowerQuery) ||
      note.subject.toLowerCase().includes(lowerQuery) ||
      note.university.toLowerCase().includes(lowerQuery) ||
      note.college.toLowerCase().includes(lowerQuery)
    );
  }

  if (university) {
    filtered = filtered.filter(note => note.university === university);
  }
  if (college) {
    filtered = filtered.filter(note => note.college === college);
  }
  if (subject) {
    filtered = filtered.filter(note => note.subject === subject);
  }
  if (year) {
    filtered = filtered.filter(note => note.year.toString() === year);
  }
  
  if (sortBy) {
    switch (sortBy) {
      case "downloads_desc":
        filtered.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
        break;
      case "rating_desc":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "price_asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "date_desc":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        // Default sort or no sort
        break;
    }
  }

  return filtered;
};

export const getTopSellingNotesByUniversityLogic = (notes, limitPerUni = 3, totalLimit = 12) => {
  const validNotes = notes.filter(note => 
    note && note.authorId && note.authorId.trim() !== "" && note.author && note.author.trim() !== ""
  );
  
  const notesByUniversity = validNotes.reduce((acc, note) => {
    if (!acc[note.university]) {
      acc[note.university] = [];
    }
    acc[note.university].push(note);
    return acc;
  }, {});

  let topNotes = [];
  for (const uni in notesByUniversity) {
    notesByUniversity[uni].sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
    topNotes.push(...notesByUniversity[uni].slice(0, limitPerUni));
  }

  topNotes.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
  return topNotes.slice(0, totalLimit);
};