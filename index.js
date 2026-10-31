const btnEl = document.getElementById("btn");
const appEl = document.getElementById("app");
const storageKey = "focus-notes";
const defaultNotes = [
  { id: 1, text: "Plan tomorrow's tasks" },
  { id: 2, text: "Buy groceries" },
];

function loadNotes() {
  try {
    const savedNotes = localStorage.getItem(storageKey);
    if (savedNotes === null) {
      return [...defaultNotes];
    }

    const parsedNotes = JSON.parse(savedNotes);
    if (
      !Array.isArray(parsedNotes) ||
      !parsedNotes.every(
        (note) => Number.isInteger(note.id) && typeof note.text === "string",
      )
    ) {
      throw new Error("Saved notes have an invalid format.");
    }

    return parsedNotes;
  } catch (error) {
    console.error("Could not load saved notes:", error);
    return [...defaultNotes];
  }
}

const notes = loadNotes();
let nextNoteId =
  notes.reduce((highestId, note) => Math.max(highestId, note.id), 0) + 1;

function saveNotes() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(notes));
  } catch (error) {
    console.error("Could not save notes locally:", error);
  }
}

function updateNote(id, value) {
  const note = notes.find((savedNote) => savedNote.id === id);
  if (!note) {
    console.error(`Could not find note with id ${id}.`);
    return;
  }

  note.text = value;
  saveNotes();
}

function deleteNote(id, element) {
  const index = notes.findIndex((note) => note.id === id);
  if (index === -1) {
    console.error(`Could not find note with id ${id}.`);
    return;
  }

  notes.splice(index, 1);
  element.remove();
  saveNotes();
}

function createNoteElement(note) {
  const element = document.createElement("textarea");
  element.id = `note-${note.id}`;
  element.classList.add("note");
  element.value = note.text;
  element.placeholder = "Write your note...";
  element.dataset.id = note.id;

  element.addEventListener("input", (event) => {
    updateNote(note.id, event.currentTarget.value);
  });

  element.addEventListener("dblclick", () => {
    deleteNote(note.id, element);
  });

  return element;
}

function renderNotes() {
  notes.forEach((note) => {
    appEl.insertBefore(createNoteElement(note), btnEl);
  });
}

function addNote() {
  const note = { id: nextNoteId, text: "" };
  nextNoteId += 1;
  notes.push(note);
  appEl.insertBefore(createNoteElement(note), btnEl).focus();
  saveNotes();
}

btnEl.addEventListener("click", addNote);
renderNotes();
