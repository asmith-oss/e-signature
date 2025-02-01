// Import necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import firebaseConfig from './firebaseConfig'; // Import your firebaseConfig

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage();

// Get references to HTML elements
const authContainer = document.getElementById('auth-container');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const signInButton = document.getElementById('sign-in-button');
const signUpEmailInput = document.getElementById('signup-email-input');
const signUpPasswordInput = document.getElementById('signup-password-input');
const signUpButton = document.getElementById('sign-up-button');
const fileUpload = document.getElementById('file-upload');
const canvas = document.getElementById('signature-canvas');
const ctx = canvas.getContext('2d');
const errorMessageElement = document.getElementById('error-message'); // Get the error message element
const progressBar = document.getElementById('upload-progress'); // Get the progress bar element
const documentViewer = document.getElementById('document-viewer'); // Get the document viewer element

// --- Authentication Functions ---

// Sign-Up
function signUp(email, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("User signed up:", user);
      displaySuccessMessage("User signed up successfully!");
    })
    .catch((error) => {
      console.error("Error signing up:", error);
      displayErrorMessage(error.message);
    });
}

// Sign-In
function signIn(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("User signed in:", user);
      displaySuccessMessage("User signed in successfully!");
    })
    .catch((error) => {
      console.error("Error signing in:", error);
      displayErrorMessage(error.message);
    });
}

// Sign Out
function signOutUser() {
  signOut(auth)
    .then(() => {
      console.log("User signed out");
      displaySuccessMessage("User signed out successfully!");
    })
    .catch((error) => {
      console.error("Error signing out:", error);
      displayErrorMessage(error.message);
    });
}

// --- File Upload Function ---

function uploadFile(file) {
  const storageRef = ref(storage, `documents/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on('state_changed', 
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      progressBar.value = progress; 
    }, 
    (error) => {
      console.error('Error uploading file:', error);
      displayErrorMessage('Error uploading file. Please try again.');
    }, 
    () => {
      getDownloadURL(uploadTask.snapshot.ref)
        .then((downloadURL) => {
          console.log('File available at', downloadURL);
          storeDocumentData(file.name, downloadURL);
          displaySuccessMessage("Document uploaded successfully!");
        })
        .catch((error) => {
          console.error('Error getting download URL:', error);
          displayErrorMessage('Error getting download URL. Please try again.');
        });
    }
  );
}

// --- Signature Capture ---

let isDrawing = false;
let lastX = 0;
let lastY = 0;

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

function startDrawing(e) {
  isDrawing = true;
  lastX = e.offsetX;
  lastY = e.offsetY;
}

function draw(e) {
  if (!isDrawing) return;

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.stroke();

  lastX = e.offsetX;
  lastY = e.offsetY;
}

function stopDrawing() {
  isDrawing = false;
}

// --- Firestore Functions ---

async function storeDocumentData(documentName, downloadURL) {
  try {
    const user = auth.currentUser; // Get the currently logged-in user
    const ownerId = user ? user.uid : null; // Get the user's UID

    const docRef = await addDoc(collection(db, "documents"), {
      documentName: documentName,
      ownerId: ownerId,
      status: "Pending Signature",
      downloadURL: downloadURL,
      createdAt: new Date()
    });
    console.log("Document written with ID: ", docRef.id);
    displaySuccessMessage("Document data stored successfully!");
  } catch (error) {
    console.error("Error adding document: ", error);
    displayErrorMessage(error.message);
  }
}

// --- Event Listeners ---

// Sign In Button
signInButton.addEventListener('click', (e) => {
  e.preventDefault(); // Prevent form submission
  const email = emailInput.value;
  const password = passwordInput.value;
  signIn(email, password);
});

// Sign Up Button
signUpButton.addEventListener('click', (e) => {
  e.preventDefault(); // Prevent form submission
  const email = signUpEmailInput.value;
  const password = signUpPasswordInput.value;
  signUp(email, password);
});

fileUpload.addEventListener('change', (event) => {
  const file = event.target.files[0];
  uploadFile(file);
});

// Firebase authentication state listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, show app content and hide sign-in/sign-up
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('app-content').style.display = 'block';
  } else {
    // User is signed out, show sign-in/sign-up
    document.getElementById('auth-container').style.display = 'block';
    document.getElementById('app-content').style.display = 'none';
  }
});

// --- Helper Functions for Error and Success Messages ---

function displayErrorMessage(message) {
  errorMessageElement.textContent = message;
  errorMessageElement.style.display = 'block';
}

function displaySuccessMessage(message) {
  errorMessageElement.textContent = message;
  errorMessageElement.style.display = 'block';
}

