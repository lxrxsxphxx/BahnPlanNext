import { createCookieSessionStorage } from 'react-router';

import { createThemeSessionResolver } from 'remix-themes';

import { unsafeCookie } from '@/components/theme/theme-cookie';

const sessionStorage = createCookieSessionStorage({
  cookie: unsafeCookie,
});

export const themeSessionResolver = createThemeSessionResolver(sessionStorage);
