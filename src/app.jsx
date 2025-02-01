import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import DocumentViewer from './DocumentViewer';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig'; 

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

function App() {
  const [documentData, setDocumentData] = useState(null);
  const [documentId, setDocumentId] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    if (documentId) {
      fetchDocumentData(documentId);
    }
  }, [documentId]);

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const documentsCollection = collection(db, 'documents');
      const querySnapshot = await getDocs(documentsCollection);
      setDocuments(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      setError('Error fetching documents.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDocumentData = async (documentId) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, 'documents', documentId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setDocumentData(docSnap.data());
      } else {
        setError('Document not found.');
      }
    } catch (err) {
      setError('Error fetching document data.');
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentSelect = (event) => {
    setDocumentId(event.target.value);
  };

  return (
    <div className="app-container">
      <h1>Document Viewer App</h1>

      {error && <p className="error-message">{error}</p>}

      <select value={documentId} onChange={handleDocumentSelect}>
        <option value="">Select a document</option>
        {documents.map((doc) => (
          <option key={doc.id} value={doc.id}>
            {doc.documentName}
          </option>
        ))}
      </select>

      {loading && <p>Loading...</p>}

      {documentData && !loading && (
        <DocumentViewer documentURL={documentData.downloadURL} />
      )}
    </div>
  );
}

export default App;
