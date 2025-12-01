import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';

import { Button } from './button';
import '@/app.css';

test('render default button', async () => {
  const screen = await render(<Button>Default</Button>);
  await expect.element(screen.getByText('Default')).toBeInTheDocument();
});

test('render secondary button', async () => {
  const screen = await render(<Button variant="secondary">Secondary</Button>);
  await expect.element(screen.getByText('Secondary')).toBeInTheDocument();
});

test('render outline button', async () => {
  const screen = await render(<Button variant="outline">Outline</Button>);
  await expect.element(screen.getByText('Outline')).toBeInTheDocument();
});

test('render ghost button', async () => {
  const screen = await render(<Button variant="ghost">Ghost</Button>);
  await expect.element(screen.getByText('Ghost')).toBeInTheDocument();
});

test('render link button', async () => {
  const screen = await render(<Button variant="link">Link</Button>);
  await expect.element(screen.getByText('Link')).toBeInTheDocument();
});

test('render destructive button', async () => {
  const screen = await render(
    <Button variant="destructive">Destructive</Button>,
  );
  await expect.element(screen.getByText('Destructive')).toBeInTheDocument();
});
