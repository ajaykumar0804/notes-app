import React from 'react';
import NotesList from '../../components/Notes/NotesList';
import NoteForm from '../../components/Notes/NoteForm';
import Footer from '../../components/footer/Footer';
import Header from '../../components/header/Header';

const HomePage = ({ isAuthenticated, setIsAuthenticated }) => {
  return (
    <div>
      <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <div className="p-4">
        {isAuthenticated ? (
          <>
            <NoteForm />
            <NotesList />
          </>
        ) : (
          <>
          <NoteForm/>
          <p className="text-center text-gray-600 mt-10">
            Please sign in to view or manage your notes.
          </p>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
