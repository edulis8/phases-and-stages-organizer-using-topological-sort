import { test } from 'vitest';
import { expect } from 'expect';
import { processFiles } from './processFiles';

const files = [
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
];

test('processFiles handles empty array', () => {
  const result = processFiles([]);
  // Replace this with your expected result for an empty array
  const expected = [];
  expect(result).toEqual(expected);
});

test('processFiles handles happy path', () => {
  const result = processFiles(files);

  const expected =
    '1 Feasibility\n1.1 Qualification\n1.2 Site Assessment\n1.3 Proposal Review\n2 Design\n2.1 Architectural\n2.2 Interior & Finishes\n2.3 Finalization & Estimates\n3 Permitting\n3.1 Documentation\n3.2 Submission\n3.3 City Comments\n4 Construction\n4.1 Foundation\n4.2 Electrical\n4.3 Structure\n4.4 Finishes';

  expect(result).toEqual(expected);
});
