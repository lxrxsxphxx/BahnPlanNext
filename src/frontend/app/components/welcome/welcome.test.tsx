import { assert, expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';

import { Welcome } from './welcome';

test('normaler beispiel test', () => {
  assert.equal(10 + 2, 12);
});

test('render welcome component', async () => {
  const screen = await render(<Welcome />);
  await expect.element(screen.getByText("What's next?")).toBeInTheDocument();
});
