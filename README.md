# Project Phases & Stages Organizer 🗂️
This project is a simple React-based interface that allows users to upload JSON files representing phases and stages of a project lifecycle. The phases and stages are represented as a directed, acyclic graph (DAG), and a topological sort algorithm is used to create a valid order of execution for the project lifecycle.

# How to Run
* navigate to root directory of this project
* npm install
* npm run dev


# Testing
* npm test will run the tests 
* errorHandler.test.js contains validation and error handling tests
* processFiles.test.js contains tests for the topological sort algorithm and the final output string generation tests


# A summary of my approach.
- User can upload JSON files using a simple React-based interface.
- The phases and stages are then represented as directed graphs using adjacency maps. 
- Since the phases and stages are represented as a DAG (directed, acyclic graph) we can create a valid order of execution for the project lifecycle with a topological sort algorithm. 
- I use the topological sort function to do two things: 
  - Make a linear ordering of the vertices (phases and stages) from left to right.
  - Detect circular dependencies which make a linear ordering impossible, and throw an error if such a cycle is found.
- The ordered phases and stages are combined with their respective numbers in the project lifecycle, which is output as a string for the user to view in the UI.


## Assumptions
- User is meant to upload all files at the same time. A potential future UX optimization would be to allow them to upload files one by one as well.
- I chose to show one error at a time to the user instead of overwhelming them with multiple errors to solve at once. I think this is a good UX approach; an alternative is to display all errors they need to resolve as a list.

## Future Improvements
- Allow users to upload files one by one.
- Implement a drag and drop interface for uploading files.
- Bring up an interface to help the user correct any JSON errors, if any are detected. With syntax highlighting.
- Support for other file types.
- More robust file validation (making sure files are of the right type, not empty, not too large, etc).
- Build a project lifecycle creation wizard as an alternative to uploading files.


