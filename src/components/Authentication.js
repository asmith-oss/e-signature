// Authentication.js
import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

// Replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBM__9ceqJnSoEGy63pr1XVmMtfxbFsqzQ",
  authDomain: "e-signature-dc310.firebaseapp.com",
  projectId: "e-signature-dc310",
  storageBucket: "e-signature-dc310.firebasestorage.app",
  messagingSenderId: "902039571675",
  appId: "1:902039571675:web:c986bdbba8d26d93ee10fe",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function Authentication() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  // ... (Your authentication functions: handleSignUp, handleSignIn, handleGoogleSignIn, handleSignOut)

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.email}</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <div>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleSignUp}>Sign Up</button>
          <button onClick={handleSignIn}>Sign In</button>
          <button onClick={handleGoogleSignIn}>Sign In with Google</button>
        </div>
      )}
    </div>
  );
}

export default Authentication;
