import * as React from 'react';
import { render, cleanup } from 'react-testing-library';
import { App } from '../App';

describe('App', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render', async () => {
    const { container } = render(<App />);

    expect(container).toBeDefined();
  });
});
