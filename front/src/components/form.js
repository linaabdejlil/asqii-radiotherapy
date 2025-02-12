import React, { useEffect, useRef, useState } from 'react';
import { FormEditor } from '@bpmn-io/form-js';
import './Form.css';
import Nav from "./nav";
import Chatbot from "./chatbot/chatbot"

import { Layout, theme } from "antd";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const { Content } = Layout;

const Form = ({ schema, onSchemaChange }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const editorRef = useRef(null);
  const [error, setError] = useState(null);
  const [uploadedSchema, setUploadedSchema] = useState(null);

  useEffect(() => {
    const formEditor = new FormEditor({
      container: editorRef.current,
    });

    formEditor.importSchema(schema)
      .then(() => {
        console.log('Form schema imported successfully');
        setError(null);
      })
      .catch(err => {
        console.error('Failed to import schema', err);
        setError('Failed to import schema');
      });

    return () => {
      formEditor.destroy();
    };
  }, [schema]);

  

  const handleDownloadPdf = () => {
    html2canvas(editorRef.current, {
      scale: 2, // Improve image quality
      useCORS: true, // Allow cross-origin images
      scrollX: 0,
      x: 300, // Coordonnée x pour commencer la capture
      y: 10, // Coordonnée y pour commencer la capture
      width: 1200, // Largeur de la zone à capturer
      scrollY: -window.scrollY // Ensure no scroll offsets
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 210; // A4 width in mm
      const imgHeight = canvas.height * imgWidth / canvas.width; // Calculate height in mm
      const pageHeight = 295; // A4 height in mm
      let heightLeft = imgHeight;
      let position = 0;
  
      // Add the first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
  
      // Add additional pages if necessary
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
  
      pdf.save('form-schema.pdf');
    }).catch(err => {
      console.error('Failed to generate PDF', err);
      setError('Failed to generate PDF');
    });
  };
  
  return (
    <Layout style={{ height: "82vh", width: "100vw" }}>
      <Nav></Nav>

      <div style={{ marginTop: 50 }}>
        <Content
          style={{
            margin: "24px 16px",
            padding: 5,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            height: "100%",
            top: "-10px",
          }}
        >
          <Chatbot />

          <div className="fjs-form-editor">
            <div className="form-controls">
            <button class="pdf" onClick={handleDownloadPdf}>
   <svg class="saveicon" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
   <path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" stroke-linejoin="round" stroke-linecap="round"></path>
</svg>
   Télécharger formulaire 
  

</button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="fjs-form-container" ref={editorRef} />

            {uploadedSchema && (
              <div className="uploaded-schema-preview">
                <h3>Uploaded Schema Preview:</h3>
                <pre>{JSON.stringify(uploadedSchema, null, 2)}</pre>
              </div>
            )}
          </div>
        </Content>
      </div>
    </Layout>
  );
};

export default Form;
