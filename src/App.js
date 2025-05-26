import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import CreatableSelect from 'react-select/creatable';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import 'react-quill/dist/quill.snow.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState([]);

  // Configuración de módulos para ReactQuill
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link'],
      ['clean']
    ],
  };

  const handleTitle = (event) => {
    setTitle(event.target.value);
  };

  const handleBody = (content) => {
    setBody(content);
  };

  const handleTags = (newTags) => {
    setTags(newTags ? newTags.map(tag => tag.value) : []);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newNote = {
      id: Date.now(),
      title,
      body,
      tags,
      createdAt: new Date().toLocaleString()
    };
    setNotes([...notes, newNote]);
    setTitle('');
    setBody('');
    setTags([]);
  };

  const handleDelete = (noteId) => {
    setNotes(notes.filter(note => note.id !== noteId));
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1 className="app-title">My Notes</h1>
      </header>

      <Card className="note-form-card">
        <form onSubmit={handleSubmit} className="note-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <InputText
              id="title"
              value={title}
              onChange={handleTitle}
              placeholder="Enter note title"
              className="w-100"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="body">Content</label>
            <ReactQuill
              value={body}
              onChange={handleBody}
              modules={modules}
              placeholder="Write your note here..."
              className="quill-editor"
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <CreatableSelect
              isMulti
              onChange={handleTags}
              className="react-select-container"
              classNamePrefix="react-select"
              options={[
                { value: 'personal', label: 'Personal' },
                { value: 'work', label: 'Work' },
                { value: 'shopping', label: 'Shopping' },
                { value: 'ideas', label: 'Ideas' }
              ]}
              placeholder="Add or select tags"
            />
          </div>

          <Button 
            type="submit" 
            label="Create Note" 
            icon="pi pi-plus" 
            className="p-button-primary"
          />
        </form>
      </Card>

      <div className="notes-container">
        {notes.map((note) => (
          <Card key={note.id} className="note-card">
            <div className="note-header">
              <h2 className="note-title">{note.title}</h2>
              <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger p-button-text"
                onClick={() => handleDelete(note.id)}
                tooltip="Delete note"
              />
            </div>
            <div 
              className="note-content"
              dangerouslySetInnerHTML={{ __html: note.body }}
            />
            <div className="note-footer">
              <div className="note-tags">
                {note.tags.map((tag, index) => (
                  <span key={index} className="note-tag">
                    <i className="pi pi-tag"></i> {tag}
                  </span>
                ))}
              </div>
              <small className="note-date">{note.createdAt}</small>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default App;
