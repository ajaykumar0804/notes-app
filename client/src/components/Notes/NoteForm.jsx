import React, { useEffect, useState } from 'react';
import { baseURL } from '../../api/constants/constant';

const NoteForm = ({ initialData = {} }) => {
  const [form, setForm] = useState({
    title: initialData.title || '',
    content: initialData.content || '',
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Call the API directly from NoteForm
      const response = await fetch(`${baseURL}/api/notes/add-note`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong while saving the note.');
      }

      // Handle success
      setMessage('Note saved successfully');
      // Optionally, reset the form or navigate
      setForm({ title: '', content: '' });
      window.location = '/'; // Redirect after successful save
    } catch (error) {
      // Handle error
      setError(error.message);
    }
  };
  return (
    <div className="max-w-xl mx-auto my-8 bg-white shadow-2xl p-6 rounded mb-40">
      <h2 className="text-lg text-center font-bold mb-4">ADD NOTE
      </h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border rounded px-4 py-2 mb-4"
        />
        <textarea
          placeholder="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="text-lg p-2 h-auton w-full resize-none bg-white"
        />

        {/* Error or success message */}
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {message && <p className="text-green-500 mt-4">{message}</p>}


        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >

          Add Note

        </button>
      </form>
    </div>
  );
};

export default NoteForm;
