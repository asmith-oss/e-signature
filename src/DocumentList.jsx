import React, { useState, useEffect } from 'react';
import DocumentViewer from './DocumentViewer'; // Import DocumentViewer

function DocumentList() {
  // ... your existing DocumentList code ...

  return (
    <div>
      <h2>My Documents</h2>
      <ul id="documents-list">
        {documents.map(document => (
          <li key={document.id}>
            <a href={document.downloadURL} target="_blank" rel="noopener noreferrer">
              {document.documentName}
            </a>
            <button onClick={() => handleDocumentSelect(document.id)}>View</button>
          </li>
        ))}
      </ul>
      {documentData && <DocumentViewer documentURL={documentData.downloadURL} />}
    </div>
  );
}

export default DocumentList;
