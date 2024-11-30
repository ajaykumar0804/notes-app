import React, { useEffect, useState } from 'react';
import { FaThumbtack, FaTrashAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa'; // Importing necessary icons
import { baseURL } from '../../api/constants/constant';
import { useNavigate } from 'react-router-dom';

const NoteList = () => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState('');
  const [editingNote, setEditingNote] = useState(null); // Store the note being edited
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch notes from the API
    const fetchNotes = async () => {
      try {
        const res = await fetch(`${baseURL}/api/notes/get-all-notes`, {
          method: 'GET',
          credentials: 'include',
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch notes.');
        }

        // Sort pinned notes to the top
        const sortedNotes = data.notes.sort((a, b) => b.isPinned - a.isPinned);
        setNotes(sortedNotes);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchNotes();
  }, []);

  const handlePinNote = async (noteId, isPinned) => {
    try {
      const res = await fetch(`${baseURL}/api/notes/update-note-pinned/${noteId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPinned: !isPinned }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to pin/unpin note.');
      }

      // Update the local state to reflect the changes
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === noteId ? { ...note, isPinned: !isPinned } : note
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const res = await fetch(`${baseURL}/api/notes/delete-note/${noteId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete note.');
      }

      // Remove the deleted note from the state
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
  };

  const handleSaveNote = async () => {
    const { _id, title, content } = editingNote;

    try {
      const res = await fetch(`${baseURL}/api/notes/edit-note/${_id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editingNote.title,
          content: editingNote.content,
          isPinned: editingNote.isPinned,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save note.');
      }

      // Update the note in the state
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === _id ? { ...note, title, content } : note
        )
      );
      setEditingNote(null); // Reset editing state
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingNote(null); // Cancel editing and reset the state
  };
  

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-20">
      {notes.map((note) => (
        <div
          key={note._id}
          className="relative bg-white p-4 rounded-lg shadow-2xl bottom-20"
          style={{
            order: note.isPinned ? -1 : undefined, // Move pinned notes to the top
          }}
        >
          <div className="absolute top-2 right-2">
            {/* Hide pin icon while editing */}
            {!editingNote || editingNote._id !== note._id ? (
              <FaThumbtack
                className={`cursor-pointer w-10 h-5 ${
                  note.isPinned ? 'text-red-500' : 'text-gray-600'
                }`}
                onClick={() => handlePinNote(note._id, note.isPinned)}
              />
            ) : null}
          </div>
          <div className="absolute bottom-2 right-2">
            <FaTrashAlt
              className="text-slate-500 w-10 h-5 cursor-pointer"
              onClick={() => handleDeleteNote(note._id)}
            />
          </div>

          {editingNote && editingNote._id === note._id ? (
            <div>
              {/* Editable fields */}
              <input
                type="text"
                className="w-full mb-2 p-2 border rounded-md"
                value={editingNote.title}
                onChange={(e) =>
                  setEditingNote({
                    ...editingNote,
                    title: e.target.value,
                  })
                }
              />
              <textarea
                className="text-lg p-2 h-auto w-full resize-none overflow-hidden bg-white focus:outline-none"
                style={{ whiteSpace: "pre-wrap" }}
                value={editingNote.content}
                onChange={(e) =>
                  setEditingNote({
                    ...editingNote,
                    content: e.target.value,
                  })
                }
              />
              <div className="flex justify-between">
                <button
                  className="bg-blue-500 text-white py-1 px-4 rounded-lg"
                  onClick={handleSaveNote}
                >
                  Save
                </button>
                <FaTimes
                  className="cursor-pointer text-slate-500 w-10 h-5  absolute top-2 right-2"
                  onClick={handleCancelEdit}
                />
              </div>
            </div>
          ) : (
            <div className="overflow-hidden h-32 hover:h-auto transition-all">
              {/* Display non-editable content */}
              <h3 className="text-xl font-semibold">{note.title}</h3> 
              <p className="text-gray-600">{note.content}</p>
              <div className="absolute bottom-0 right-0">
                <FaEdit
                  className="text-slate-500 w-20 h-5 absolute right-8 bottom-2 cursor-pointer"
                  onClick={() => handleEditNote(note)}
                />
              </div>
            </div>
          )}
        </div>
      ))}
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default NoteList;
