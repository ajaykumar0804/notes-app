import React, { useEffect, useState } from 'react';
import Navbar from '../components/Layout/Navbar';
import NoteForm from '../components/Notes/NoteForm';
import { baseURL } from '../api/constants/constant';
import { useParams } from 'react-router-dom';

const EditNote = () => {
  const { noteId } = useParams();
  const [note, setNote] = useState(null);

  useEffect(() => {
    fetchNote();
  }, []);

  const fetchNote = async () => {
    const res = await fetch(`${baseURL}/api/notes/${noteId}`, { credentials: 'include' });
    const data = await res.json();
    setNote(data.note);
  };

  const handleSubmit = async (form) => {
    await fetch(`${baseURL}/api/notes/${noteId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    window.location = '/';
  };

  return (
    <div>
      <Navbar />
      <div className="p-6">
        {note && <NoteForm onSubmit={handleSubmit} initialData={note} />}
      </div>
    </div>
  );
};

export default EditNote;
