import { test } from 'vitest';
import { expect } from 'expect';
import { validateFiles, validateJson } from './errorHandler';

test('validateJson handles valid JSON', () => {
  const result = validateJson('test.json', '[{"hello": "world"}]');
  const expected = [{ hello: 'world' }];
  expect(result).toEqual(expected);
});

test('validateJson handles invalid JSON by throwing error', () => {
  const invalidJson = '["hello": "world"}]';

  expect(() => validateJson('test.json', invalidJson)).toThrow(
    'Malformed JSON in file: test.json',
  );
});

test('validateFiles handles missing phases.json', () => {
  const fileData = [
    {
      name: 'Foundation',
      prerequisites: [],
    },
  ];

  expect(() => validateFiles(fileData)).toThrow(
    "A file named 'phases.json' is required.",
  );
});

test('validateFiles handles missing stage file', () => {
  const fileData = [
    {
      fileName: 'phases.json',
      contents: [
        {
          name: 'Construction',
          prerequisites: [],
        },
      ],
    },
  ];

  expect(() => validateFiles(fileData)).toThrow(
    "A file named 'construction.json' is required.",
  );
});

test('validateFiles handles duplicate phase names', () => {
  const PHASE_NAME = 'phases.json';
  const fileData = [
    {
      fileName: `${PHASE_NAME}`,
      contents: [
        {
          name: 'Construction',
          prerequisites: ['Permitting'],
        },
        {
          name: 'Construction',
          prerequisites: [],
        },
      ],
    },
    {
      fileName: 'construction.json',
      contents: [
        {
          name: 'Construction',
          prerequisites: ['Electrical'],
        },
      ],
    },
  ];
  expect(() => validateFiles(fileData)).toThrow(
    `Duplicate phase or stage names are not allowed. Check file: ${PHASE_NAME}`,
  );
});

test('validateFiles handles duplicate stage names', () => {
  const STAGE_NAME = 'construction.json';
  const fileData = [
    {
      fileName: 'phases.json',
      contents: [
        {
          name: 'Construction',
          prerequisites: [],
        },
      ],
    },
    {
      fileName: `${STAGE_NAME}`,
      contents: [
        {
          name: 'Electrical',
          prerequisites: ['Foundation'],
        },
        {
          name: 'Electrical',
          prerequisites: [],
        },
      ],
    },
  ];
  expect(() => validateFiles(fileData)).toThrow(
    `Duplicate phase or stage names are not allowed. Check file: ${STAGE_NAME}`,
  );
});

test('validateFiles handles missing prerequisites', () => {
  const fileData = [
    {
      fileName: 'phases.json',
      contents: [
        {
          name: 'Construction',
          prerequisites: [],
        },
      ],
    },
    {
      fileName: 'construction.json',
      contents: [
        {
          name: 'Foundation',
        },
      ],
    },
  ];
  expect(() => validateFiles(fileData)).toThrow(
    `Prerequisites must be defined and must be an array of strings. Check file: construction.json`,
  );
});

test('validateFiles handles invalid prerequisites', () => {
  const STAGE_NAME = 'construction.json';
  const fileData = [
    {
      fileName: 'phases.json',
      contents: [
        {
          name: 'Construction',
          prerequisites: [],
        },
      ],
    },
    {
      fileName: `${STAGE_NAME}`,
      contents: [
        {
          name: 'Foundation',
          prerequisites: [8, false],
        },
      ],
    },
  ];
  expect(() => validateFiles(fileData)).toThrow(
    `Prerequisites must be defined and must be an array of strings. Check file: ${STAGE_NAME}`,
  );
});

test('validateFiles handles when a listed prerequisite is not included as a high-level stage/phase', () => {
  const STAGE_NAME = 'construction.json';
  const fileData = [
    {
      fileName: 'phases.json',
      contents: [
        {
          name: 'Construction',
          prerequisites: [],
        },
      ],
    },
    {
      fileName: `${STAGE_NAME}`,
      contents: [
        {
          name: 'Foundation',
          prerequisites: ['Electrical'],
        },
      ],
    },
  ];
  expect(() => validateFiles(fileData)).toThrow(
    `A listed prerequisite is not included as a high-level stage/phase. Check file: ${STAGE_NAME}`,
  );
});
