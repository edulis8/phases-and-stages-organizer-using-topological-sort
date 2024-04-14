import { test } from 'vitest';
import { expect } from 'expect';
import { processFiles, topologicalSort } from './processFiles.js';

const testFiles = [
  {
    fileName: 'phases.json',
    displayName: 'Phases',
    contents: [
      {
        name: 'Design',
        prerequisites: ['Feasibility'],
      },
      {
        name: 'Construction',
        prerequisites: ['Permitting'],
      },
      {
        name: 'Permitting',
        prerequisites: ['Design'],
      },
      {
        name: 'Feasibility',
        prerequisites: [],
      },
    ],
  },
  {
    fileName: 'construction.json',
    displayName: 'Construction',
    contents: [
      {
        name: 'Foundation',
        prerequisites: [],
      },
      {
        name: 'Electrical',
        prerequisites: ['Foundation'],
      },
      {
        name: 'Structure',
        prerequisites: ['Foundation'],
      },
      {
        name: 'Finishes',
        prerequisites: ['Electrical'],
      },
    ],
  },
  {
    fileName: 'design.json',
    displayName: 'Design',
    contents: [
      {
        name: 'Architectural',
        prerequisites: [],
      },
      {
        name: 'Interior & Finishes',
        prerequisites: [],
      },
      {
        name: 'Finalization & Estimates',
        prerequisites: ['Architectural', 'Interior & Finishes'],
      },
    ],
  },
  {
    fileName: 'feasibility.json',
    displayName: 'Feasibility',
    contents: [
      {
        name: 'Qualification',
        prerequisites: [],
      },
      {
        name: 'Site Assessment',
        prerequisites: ['Qualification'],
      },
      {
        name: 'Proposal Review',
        prerequisites: ['Site Assessment'],
      },
    ],
  },
  {
    fileName: 'permitting.json',
    displayName: 'Permitting',
    contents: [
      {
        name: 'Documentation',
        prerequisites: [],
      },
      {
        name: 'Submission',
        prerequisites: ['Documentation'],
      },
      {
        name: 'City Comments',
        prerequisites: ['Submission'],
      },
    ],
  },
];

test('topologicalSort handles dependency graph with no cycles', () => {
  const adjacencyMap = new Map();
  adjacencyMap.set('A', ['B', 'C']); // A depends on B and C
  adjacencyMap.set('B', ['C', 'D']); // B depends on C and D
  adjacencyMap.set('C', ['D']); // C depends on D
  adjacencyMap.set('D', []); // D has no dependencies

  const result = topologicalSort('test.json', adjacencyMap);
  const expected = ['D', 'C', 'B', 'A'];

  expect(result).toEqual(expected);
});

test('topologicalSort handles dependency graph with cycles', () => {
  const adjacencyMap = new Map();
  adjacencyMap.set('A', ['B', 'C']); // A depends on B and C
  adjacencyMap.set('B', ['C', 'D']); // B depends on C and D
  adjacencyMap.set('C', ['D']); // C depends on D
  adjacencyMap.set('D', ['C']); // D depends on C!!!

  expect(() => topologicalSort('test.json', adjacencyMap)).toThrow(
    'Circular dependency found in test.json',
  );
});

test('processFiles handles empty array', () => {
  const result = processFiles([]);
  const expected = [];
  expect(result).toEqual(expected);
});

test('processFiles handles small array', () => {
  const minimalTestFiles = [
    {
      fileName: 'phases.json',
      displayName: 'Phases',
      contents: [
        {
          name: 'Example',
          prerequisites: [],
        },
      ],
    },
    {
      fileName: 'example.json',
      displayName: 'Example',
      contents: [
        {
          name: 'World',
          prerequisites: ['Hello'],
        },
        {
          name: 'Hello',
          prerequisites: [],
        },
      ],
    },
  ];
  const result = processFiles(minimalTestFiles);
  const expected = '1 Example\n1.1 Hello\n1.2 World';
  expect(result).toEqual(expected);
});

test('processFiles returns valid project lifecycle as a string', () => {
  const result = processFiles(testFiles);
  const expected =
    '1 Feasibility\n1.1 Qualification\n1.2 Site Assessment\n1.3 Proposal Review\n2 Design\n2.1 Architectural\n2.2 Interior & Finishes\n2.3 Finalization & Estimates\n3 Permitting\n3.1 Documentation\n3.2 Submission\n3.3 City Comments\n4 Construction\n4.1 Foundation\n4.2 Electrical\n4.3 Structure\n4.4 Finishes';
  expect(result).toEqual(expected);
});

test('processFiles handles an invalid project lifecycle with a circular dependency', () => {
  const testFilesCopy = JSON.parse(JSON.stringify(testFiles));
  testFilesCopy[0].contents[3].prerequisites.push('Design'); // Feasibility now depends on Design, creating a circular dependency
  expect(() => processFiles(testFilesCopy)).toThrow(
    'Circular dependency found in phases.json',
  );
});
