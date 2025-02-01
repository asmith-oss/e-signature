import React from 'react';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack'; // Import from react-pdf

const DocumentViewer = ({ documentURL }) => {
  return (
    <div className="document-viewer">
      <Document file={documentURL}>
        <Page pageNumber={1} />
      </Document>
    </div>
  );
};

export default DocumentViewer;
