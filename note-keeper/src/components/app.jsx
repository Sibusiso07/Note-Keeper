import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";

function App() {
  const [notes, setNotes] = useState([]);

  // Fetching the available data from the DB
  const getNotes = async () => {
    try {
      const response = await fetch("http://localhost:3001/", {
        method: "GET"
      });
      const jsonData = await response.json();
      setNotes(jsonData);
    } catch (err) {
      console.log(err);
    }
  }

  // Displaying the Notes received from the DB.
  useEffect(() => {
    getNotes();
  }, []);

  const addNote = async newNote => {
    // Adding the note into the front end
    setNotes(prevNotes => {
      return [...prevNotes, newNote];
    });
    // Adding the note into the DB
    try {
      const response = await fetch("http://localhost:3001/Notes", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(newNote)
      });
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }

  const deleteNote = async id => {
    try {
      // DEleting the Note from the DB
      const response = await fetch(`http://localhost:3001/Notes/${id}`, {
        method: "DELETE",
      });
      console.log(response);
      // Deleting the Note from the Fron-End
      setNotes((prevNotes) => {
        return prevNotes.filter((noteItem, index) => index !== id);
      });
    } catch (err) {
      console.log(err);
    }
  };
  

  return (
    <div>
      <Header />
      <CreateArea onAdd={addNote} />
      {notes.map((noteItem, index) => {
        return (
          <Note
            key={index}
            id={index}
            title={noteItem.title}
            content={noteItem.content}
            onDelete={deleteNote}
          />
        );
      })}
      <Footer />
    </div>
  );
}

export default App;
