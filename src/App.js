import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import './App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState([]);

  const handleTitle = (event) => {
    setTitle(event.target.value);
  };();

  const handleBody = (event) => {
    setBody(event.target.value);
  };

  const handleTags = (newTags) => {
    setTags(newTags ? newTags.map(tag => tag.value) : []);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newNote = { 
      title, 
      body, 
      tags,
      id: Date.now() 
    };
    setNotes([...notes, newNote]);
    // Limpiar el formulario
    setTitle('');
    setBody('');
    setTags([]);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1 className="app-title">My Notes</h1>
      </header>

      <form onSubmit={handleSubmit} className="note-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input 
            type="text" 
            className="form-input" 
            id="title" 
            value={title} 
            onChange={handleTitle}
            placeholder="Enter note title" 
          />
        </div>
        <div className="form-group">
          <label htmlFor="body">Body</label>
          <textarea 
            className="form-textarea" 
            id="body" 
            rows={3} 
            value={body} 
            onChange={handleBody}
            placeholder="Enter note content"
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <CreatableSelect
            isMulti
            onChange={handleTags}
            className="form-select"
            options={[
              { value: 'personal', label: 'Personal' },
              { value: 'work', label: 'Work' },
              { value: 'shopping', label: 'Shopping' },
            ]}
            placeholder="Add or select tags"
          />
        </div>
        <button type="submit" className="button">Create Note</button>
      </form>

      <div className="notes-container">
        {notes.map((note) => (
          <div key={note.id} className="note-card">
            <h2 className="note-title">{note.title}</h2>
            <p className="note-content">{note.body}</p>
            <div className="note-tags">
              {note.tags.map((tag, index) => (
                <span key={index} className="note-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
