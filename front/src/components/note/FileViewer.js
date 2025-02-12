// FileViewer.js
import React from "react";
import { useLocation } from "react-router-dom";

function FileViewer() {
  const location = useLocation();
  const file = location.state?.file;

  if (!file) {
    return <div>No file to display</div>;
  }

  const fileURL = URL.createObjectURL(file);

  return (
    <div>
      {file.type.startsWith("image/") && (
        <img src={fileURL} alt="Preview" style={{ maxWidth: "100%" }} />
      )}

      {file.type === "application/pdf" && (
        <embed src={fileURL} type="application/pdf" width="100%" height="500px" />
      )}

      {file.type.startsWith("text/") && (
        <iframe src={fileURL} style={{ width: "100%", height: "500px" }} />
      )}

      {!file.type.startsWith("image/") &&
        file.type !== "application/pdf" &&
        !file.type.startsWith("text/") && (
          <div>
            <p>Unsupported file type: {file.name}</p>
            <a href={fileURL} download={file.name}>
              Download {file.name}
            </a>
          </div>
        )}
    </div>
  );
}

export default FileViewer;
