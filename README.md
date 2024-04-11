# How to Run (Dev Mode):

* navigate to root directory of this project
* npm install
* npm run dev

# Testing



#

# A summary of your approach.
    - (del me) If you considered alternate solutions, why did you not choose them?

This problem can be solved by using a topological sort algorithm, which is used to linearize a directed acyclic graph (DAG). In this case, the phases and stages can be represented as a DAG, where the nodes are the phases/stages and the edges are the prerequisites.

Here's a step-by-step plan:

Iterate over the files array and create a map where the key is the file name and the value is the file contents.
For each file, create a graph where the nodes are the stages and the edges are the prerequisites.
Perform a topological sort on each graph to get the correct order of stages.
Create a graph for the phases and perform a topological sort to get the correct order of phases.
Combine the ordered phases and stages to get the final output.



- What assumptions did you make while working on this problem?


- Time spent (this will not be used to judge your submission, but purely for us to track candidate experience).


- If you time-boxed your implementation, anything you would extend upon if you had more time.



ASSUMPTION
- user is meant to upload all files at the same time. A future UX optimization would be to allow them to upload one by one, with the phases.json file being first.
- I chose to show one error at a tiime to the user instead of overwhelming them with multiple errors to solve at once. I think this is a good UX approach; an alternative is to display all errors they need to resolve as a list. I'd want to gather user feedback or consult with the product manager on this to make sure my approach is the right way to go.