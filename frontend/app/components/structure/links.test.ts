import { assert, test } from 'vitest';

import { LINKS } from './links';

test('alle links in passendem format', () => {
  for (const link of LINKS.flatMap((link) =>
    /* oxlint-disable-next-line no-conditional-in-test */
    (link.children ?? []).concat(link),
  )) {
    assert.ok(link.to.startsWith('/'), 'jeder link muss mit / beginnen');
  }
});
