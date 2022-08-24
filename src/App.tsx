import React, { useState, useEffect } from 'react';
import './App.css';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExport from './aws-exports';
import { Amplify, API } from 'aws-amplify';
import { listNotes } from './graphql/queries';
import { createNote as createNoteMutation, deleteNote as deleteNoteMutation } from './graphql/mutations';

Amplify.configure(awsExport);

const initialFormState = { name: '', description: '' };

function App() {
  const [ notes, setNotes ] = useState<any>([]);
  const [ formData, setFormData ] = useState(initialFormState);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const apiDate: any = await API.graphql({ query: listNotes });
    setNotes(apiDate.data.listNotes.items);
    console.log(apiDate);
  }

  async function createNote() {
    if(!formData.name || !formData.description ) return;
    await API.graphql({ query: createNoteMutation, variables: { input: formData} });
    setNotes([ ...notes, formData ]);
    setFormData(initialFormState);
  }

  async function deleteNote({ id } : {id: any}) {
    const newNotesArray = notes.filter((note: { id: any; }) => note.id !== id);
    setNotes(newNotesArray);
    await API.graphql({ query: deleteNoteMutation, variables: { input: { id } }});
  }

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user?.username}</h1>
          <h1>My Notes App</h1>
          <input
            onChange={ e => setFormData({ ...formData, 'name': e.target.value })}
            placeholder="Note name"
            value={formData.name}
          />
          <input
            onChange={ e => setFormData({ ...formData, 'description': e.target.value })}
            placeholder="Note description"
            value={formData.description}
          />
          <button onClick={createNote}>Create Note</button>

          <div style={{ marginBottom: 30 }}>
            {
              notes.map((note: { id: any; name?: any; description?: any; }) => (
                <div key={note.id || note.name}>
                  <h2>{note.name}</h2>
                  <p>{note.description}</p>
                  <button onClick={() => deleteNote(note)}>Delete note</button>
                </div>
              ))
            }
          </div>

          <button onClick={signOut}>Sign Out</button>
        </main>
      )}  
    </Authenticator>
  );
}

export default App;