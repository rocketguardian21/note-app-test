import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';

interface Note {
  title: string;
  body: string;
  tags: string[];
}

interface NoteFormProps {
  onSubmit: (note: Note) => void;
}

const NoteForm: React.FC<NoteFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleBody = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(event.target.value);
  };

  const handleTags = (newTags: any) => {
    setTags(newTags ? newTags.map((tag: any) => tag.value) : []);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const note = { title, body, tags };
    onSubmit(note);
    setTitle('');
    setBody('');
    setTags([]);
  };

  return (
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
  );
};

export default NoteForm; 