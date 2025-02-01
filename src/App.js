import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import React from 'react';
import Authentication from './Authentication'; // Import your authentication component

// Replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBM__9ceqJnSoEGy63pr1XVmMtfxbFsqzQ",
  authDomain: "e-signature-dc310.firebaseapp.com",
  projectId: "e-signature-dc310",
  storageBucket: "e-signature-dc310.firebasestorage.app",
  messagingSenderId: "902039571675",
  appId: "1:902039571675:web:c986bdbba8d26d93ee10fe",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 

// Now you can use Firebase services like Firestore

function App() {
  return (
    <div>
      <Authentication />
      {/* ... rest of your app's content ... */}
    </div>
  );
}

export default App;
