import { assert, expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { MemoryRouter } from 'react-router';

import { Welcome } from './welcome';



test('render welcome component', async () => {
  const screen = await render(
    <MemoryRouter>
      <Welcome />
    </MemoryRouter>
  );
});
