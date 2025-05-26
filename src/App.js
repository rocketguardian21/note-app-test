import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import CreatableSelect from 'react-select/creatable';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
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
  const [loading, setLoading] = useState(false);
  const toast = React.useRef(null);

  // Cargar notas al iniciar
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'notes'));
      const notesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotes(notesData);
    } catch (error) {
      console.error('Error al cargar las notas:', error);
      showError('Error al cargar las notas');
    }
  };

  const showSuccess = (message) => {
    toast.current?.show({
      severity: 'success',
      summary: 'Éxito',
      detail: message,
      life: 3000
    });
  };

  const showError = (message) => {
    toast.current?.show({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 3000
    });
  };

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const newNote = {
        title,
        body,
        tags,
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'notes'), newNote);
      newNote.id = docRef.id;
      setNotes([...notes, newNote]);
      setTitle('');
      setBody('');
      setTags([]);
      showSuccess('Nota guardada correctamente');
    } catch (error) {
      console.error('Error al guardar la nota:', error);
      showError('Error al guardar la nota');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (noteId) => {
    try {
      await deleteDoc(doc(db, 'notes', noteId));
      setNotes(notes.filter(note => note.id !== noteId));
      showSuccess('Nota eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar la nota:', error);
      showError('Error al eliminar la nota');
    }
  };

  return (
    <div className="App">
      <Toast ref={toast} />
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
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title"
              className="w-100"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="body">Content</label>
            <ReactQuill
              value={body}
              onChange={setBody}
              modules={modules}
              placeholder="Write your note here..."
              className="quill-editor"
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <CreatableSelect
              isMulti
              onChange={(newTags) => setTags(newTags ? newTags.map(tag => tag.value) : [])}
              className="react-select-container"
              classNamePrefix="react-select"
              options={[
                { value: 'personal', label: 'Personal' },
                { value: 'work', label: 'Work' },
                { value: 'shopping', label: 'Shopping' },
                { value: 'ideas', label: 'Ideas' }
              ]}
              placeholder="Add or select tags"
              value={tags.map(tag => ({ value: tag, label: tag }))}
            />
          </div>

          <Button 
            type="submit" 
            label="Create Note" 
            icon="pi pi-plus" 
            className="p-button-primary"
            loading={loading}
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
              <small className="note-date">
                {new Date(note.createdAt).toLocaleString()}
              </small>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default App;
