import { useState, useRef } from 'react';
import { processFiles } from './utils/processFiles';
import { validateFiles, validateJson } from './utils/errorHandler';
import './App.css';

function App() {
  const [files, setFiles] = useState([]);
  const [projectLifecycle, setProjectLifecycle] = useState([]);
  const [errors, setErrors] = useState([]);

  function handleFileUpload(event) {
    setErrors([]);
    setProjectLifecycle([]);
    const uploadedFiles = [...event.target.files];

    const filePromises = uploadedFiles.map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            let contents;
            try {
              contents = validateJson(file.name, e.target.result);
            } catch (error) {
              reject(error);
            }
            let displayName = file.name.replace(/\.[^/.]+$/, '');
            displayName =
              displayName.charAt(0).toUpperCase() + displayName.slice(1);

            resolve({
              fileName: file.name,
              displayName,
              contents,
            });
          };
          reader.onerror = (error) => reject(error);
          reader.readAsText(file);
        }),
    );

    Promise.all(filePromises)
      .then((fileData) => {
        validateFiles(fileData);
        setFiles(fileData);
        setProjectLifecycle(processFiles(fileData));
      })
      .catch((err) => {
        setErrors([err.message]);
      });
  }

  return (
    <main>
      <h1>Organizer for Phases and Stages of a Project</h1>
      <FileUpload onFileUpload={handleFileUpload} files={files} />
      <section className="errors" aria-live="polite">
        {errors.length
          ? errors.map((errMsg) => (
              <pre key={errMsg} className="error">
                {errMsg}
              </pre>
            ))
          : null}
      </section>
      <section
        hidden={!projectLifecycle.length}
        className="project-lifecycle"
        aria-live="polite"
      >
        <pre>{projectLifecycle}</pre>
      </section>
    </main>
  );
}

export default App;

function FileUpload({ files, onFileUpload }) {
  const fileInputRef = useRef();

  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      fileInputRef.current.click();
    }
  }

  return (
    <main>
      <section>
        <h3>Upload your phases and stages files</h3>
        <button
          type="button"
          className="custom-file-upload"
          onKeyDown={handleKeyDown}
        >
          <label htmlFor="file-upload">Choose Files</label>
        </button>
        {/* The input element below is hidden via CSS and replaced with the custom-file-upload button above to hide its default 'No file chosen' message which will always be displayed because of the event.target.value reset */}
        <input
          id="file-upload"
          type="file"
          multiple
          ref={fileInputRef}
          onChange={(event) => {
            onFileUpload(event);
            // Reset the value in case user wants to re-upload the same files.
            event.target.value = null;
          }}
        />
        {files.length > 0 ? (
          <p>{files.length} files uploaded</p>
        ) : (
          <p>No files chosen</p>
        )}
      </section>
    </main>
  );
}
