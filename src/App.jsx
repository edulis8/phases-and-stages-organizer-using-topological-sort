import { useState } from 'react';
import { processFiles } from './utils/processFiles';
import './App.css';

// Create a file upload component that allows users to upload multiple JSON files.
// Parse the uploaded JSON files and store the data in the application's state.
// Implement a function to organize the phases and stages based on the prerequisites. This function should handle circular dependencies and undefined prerequisites.
// Implement error handling for malformed JSON files, duplicated names within a phase/stage file, and missing files.
// Display the organized phases and stages in the user interface in the specified format.
const REQUIRED_FILE = 'phases.json';

// NEXT TODO: p89987hJson file that is malformed (missing } or ', extra ,
function App() {
  const [files, setFiles] = useState([]);
  const [projectLifecycle, setProjectLifecycle] = useState([]);
  const [errors, setErrors] = useState([]);

  function validateFiles(fileData) {
    const fileNames = fileData.map((file) => file.fileName);
    if (!fileNames.includes(REQUIRED_FILE)) {
      throw new Error("A file named 'phases.json' is required.");
    }

    const phasesFile = fileData.find((file) => file.fileName === REQUIRED_FILE);
    const phaseNames = phasesFile.contents.map((phase) =>
      phase.name.toLowerCase(),
    );

    phaseNames.forEach((phaseName) => {
      if (!fileNames.includes(`${phaseName}.json`)) {
        throw new Error(`A file named '${phaseName}.json' is required.`);
      }
    });

    fileData.forEach((file) => {
      const names = file.contents.map((item) => item.name);
      const hasDuplicates = new Set(names).size !== names.length;

      if (hasDuplicates) {
        throw new Error(
          `Duplicate phase or stage names are not allowed. Check file: ${file.fileName}`,
        );
      }
      if (
        !file.contents.every(
          (item) =>
            Array.isArray(item.prerequisites) &&
            item.prerequisites.every((prereq) => typeof prereq === 'string'),
        )
      ) {
        throw new Error(
          `Prerequisites must be defined and must be an array of strings. Check file: ${file.fileName}`,
        );
      }

      file.contents.forEach((item) => {
        item.prerequisites.forEach((prereq) => {
          if (!names.includes(prereq)) {
            throw new Error(
              `A listed prerequisite is not included as a high-level stage/phase. Check file: ${file.fileName}`,
            );
          }
        });
      });
    });
  }

  function handleFileUpload(event) {
    setErrors([]);
    setProjectLifecycle([]);
    const uploadedFiles = [...event.target.files];
    console.log(event.target.files);

    const filePromises = uploadedFiles.map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            let contents;

            try {
              contents = JSON.parse(e.target.result);
            } catch (error) {
              reject(
                new Error(
                  `Malformed JSON in file: ${file.name}, error: ${error.message}`,
                ),
              );
            }

            console.log('reader onload', file.name);
            const [fileName] = file.name.split('.');
            resolve({
              fileName: file.name,
              displayName: fileName.charAt(0).toUpperCase() + fileName.slice(1),
              contents,
            });
          };
          reader.onerror = (error) => reject(error);
          reader.readAsText(file);
        }),
    );

    Promise.all(filePromises)
      .then((fileData) => {
        setFiles(fileData);
        console.log('hi', fileData);
        validateFiles(fileData);
        setProjectLifecycle(processFiles(fileData));
      })
      .catch((err) => {
        console.error('Promise.all err---', err);
        setErrors([err.message]);
      });
  }

  return (
    <main>
      <h1>Cottage 🏠</h1>
      <FileUpload onFileUpload={handleFileUpload} files={files} />
      <section className="errors">
        {errors.length
          ? errors.map((errMsg) => (
              <pre key={errMsg} className="error">
                {errMsg}
              </pre>
            ))
          : null}
      </section>
      <section hidden={!projectLifecycle.length} className="project-lifecycle">
        <pre>{projectLifecycle}</pre>
      </section>
    </main>
  );
}

export default App;

function FileUpload({ files, onFileUpload }) {
  return (
    <main>
      <section className="file-upload">
        <input
          type="file"
          multiple
          onChange={(event) => {
            onFileUpload(event);
            event.target.value = null; // Reset the value in case user corrected an error and re-uploaded the same files
          }}
        />
        {files.length > 0 && <p>{files.length} files uploaded</p>}
      </section>
    </main>
  );
}
