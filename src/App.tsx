import React from 'react';
import './App.css';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExport from './aws-exports';
import Amplify from 'aws-amplify';
Amplify.configure(awsExport);

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user?.username}</h1>
          <button onClick={signOut}>Sign Out</button>
        </main>
      )}  
    </Authenticator>
  );
}

export default App;