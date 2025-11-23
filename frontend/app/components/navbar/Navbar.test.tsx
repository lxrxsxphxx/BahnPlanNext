import { expect, test, vi, afterEach } from 'vitest';
import { render } from 'vitest-browser-react';

vi.mock('react-router', async () => {
  const React = (await vi.importActual('react')) as any;
  return {
    NavLink: ({ to, children, className, end }: any) => {
      const activePath = (globalThis as any).__TEST_CURRENT_PATH__ || '/';
      const isActive = activePath === to;
      const cls = typeof className === 'function' ? className({ isActive }) : className;
      return React.createElement('a', { href: to, 'data-to': to, className: cls }, children);
    },
  } as any;
});

import Navbar from './Navbar';

test('renders horizontal navbar (front page) and shows frontpage links', async () => {
  const screen = await render(<Navbar isFrontPage={true} />);
  await expect.element(screen.getByText('BahnPlan')).toBeInTheDocument();

  await expect.element(screen.getByText('Ausschreibungen')).toBeInTheDocument();

  await expect.element(screen.getByText('Anmelden')).toBeInTheDocument();
  await expect.element(screen.getByText('Registrieren')).toBeInTheDocument();
});

test('renders sidebar (non-front page) and shows full link list and search input', async () => {
  const screen = await render(<Navbar isFrontPage={false} />);
  await expect.element(screen.getByText('BahnPlan')).toBeInTheDocument();

  await expect.element(screen.getByText('Umlauf / Fahrpläne')).toBeInTheDocument();

  const input = screen.getByPlaceholder('Suche: Strecke / ID / Spieler ...');
  await expect.element(input).toBeInTheDocument();
});

test('applies active styles to the correct NavLink', async () => {
  (globalThis as any).__TEST_CURRENT_PATH__ = '/ausschreibungen';

  const screen = await render(<Navbar isFrontPage={true} />);
  const activeLink = screen.getByText('Ausschreibungen');
    await expect.element(activeLink).toBeInTheDocument();
    await expect.element(activeLink).toHaveClass('bg-white/20');
});

afterEach(() => {
  delete (globalThis as any).__TEST_CURRENT_PATH__;
});
