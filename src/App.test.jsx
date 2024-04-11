import React from 'react';
import { test } from 'vitest';
import { render } from '@testing-library/react';
import { expect } from 'expect';
import App from './App';

test('Example test', () => {
  const result = 1 + 2;
  expect(result).toBe(3);
});

test('renders Cottage text', () => {
  const { container } = render(<App />);
  expect(container.textContent).toMatch(/Cottage/);
});
