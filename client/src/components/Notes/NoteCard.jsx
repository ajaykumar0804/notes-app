import React from 'react';

const NoteCard = ({ note, onDelete, onPin }) => (
  <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition duration-300">
    <h3 className="font-bold text-lg">{note.title}</h3>
    <p className="text-gray-700">{note.content}</p>
    <div className="flex justify-between mt-4">
      <button
        onClick={() => onPin(note._id, !note.isPinned)}
        className={`px-4 py-2 rounded ${note.isPinned ? 'bg-yellow-500' : 'bg-gray-300'}`}
      >
        {note.isPinned ? 'Unpin' : 'Pin'}
      </button>
      <button
        onClick={() => onDelete(note._id)}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Delete
      </button>
    </div>
  </div>
);

export default NoteCard;
