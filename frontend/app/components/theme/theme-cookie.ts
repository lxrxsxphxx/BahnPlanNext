import { useMemo } from 'react';
import { createCookie } from 'react-router';

import { Theme } from 'remix-themes';

import { getThemeCookie } from './cookie-parser';

export const unsafeCookie = createCookie('__bahnplan-themes', {
  // domain: 'remix.run',
  path: '/',
  sameSite: 'lax',
  secrets: ['s3cr3t'],
});

export function useThemeData(data?: Theme | null) {
  return useMemo(() => {
    if (data) return data;

    // get actual theme value in browser, if theme was not available during ssr
    if (typeof document !== 'undefined') {
      // decode cookie and get theme value
      const theme = getThemeCookie(document.cookie, {
        name: unsafeCookie.name,
      });
      return theme ? theme : null;
    }

    return null;
  }, [data]);
}
