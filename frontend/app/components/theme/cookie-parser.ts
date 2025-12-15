export enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
}

// See: https://github.com/zloirock/core-js/blob/master/packages/core-js/modules/es.escape.js
// Converted to esm by: https://github.com/remix-run/react-router/blob/32d759958978b9fbae676806dd6c84ade9866746/packages/react-router/lib/server-runtime/cookies.ts#L187
function myEscape(value: string) {
  let str = value.toString();
  let result = '';
  let index = 0;
  let chr, code;
  while (index < str.length) {
    chr = str.charAt(index++);
    if (/[\w*+\-./@]/.exec(chr)) {
      result += chr;
    } else {
      code = chr.charCodeAt(0);
      if (code < 256) {
        result += '%' + hex(code, 2);
      } else {
        result += '%u' + hex(code, 4).toUpperCase();
      }
    }
  }
  return result;
}

// See: https://github.com/zloirock/core-js/blob/master/packages/core-js/modules/es.escape.js
// Converted to esm by: https://github.com/remix-run/react-router/blob/32d759958978b9fbae676806dd6c84ade9866746/packages/react-router/lib/server-runtime/cookies.ts#L208
function hex(code: number, length: number) {
  let result = code.toString(16);
  while (result.length < length) result = '0' + result;
  return result;
}

/**
 * Parse a cookie header to get the value of a specific cookie.
 * @param cookieHeader Cookie header from `document.cookie`.
 * @param name Name of the cookie to find in the header.
 * @returns The cookies raw value.
 */
export function parseHeader(cookieHeader: string, name: string) {
  const cookies = cookieHeader
    .split(';')
    .map((cookie) => cookie.split('=', 2) as [string, string]);
  const cookie = cookies.find(([cookieName]) => cookieName.trim() === name);
  if (cookie) {
    const [_, rawValue] = cookie;
    return rawValue;
  }
}

/**
 * Decode the raw value of a cookie.
 * @param rawValue Base64 encoded value of a cookie, possibly signed with a `.` separator.
 * @returns The value decoded, escaped and Json parsed, or undefined if any step failed.
 */
export function decodeValue(rawValue: string) {
  try {
    let index = rawValue.lastIndexOf('.');
    const value = rawValue.slice(0, index < 0 ? rawValue.length : index);

    return JSON.parse(
      decodeURIComponent(myEscape(atob(decodeURIComponent(value)))),
    );
  } catch {
    return;
  }
}

/**
 * Get the theme from a cookie.
 */
export function getThemeCookie(
  cookieHeader: string,
  cookie: {
    name: string;
    parseHeaderFunc?: typeof parseHeader;
    decodeValueFunc?: typeof decodeValue;
  },
) {
  const parseHeaderFunc = cookie.parseHeaderFunc ?? parseHeader;
  const decodeValueFunc = cookie.decodeValueFunc ?? decodeValue;

  const rawValue = parseHeaderFunc(cookieHeader, cookie.name);
  // decode cookie
  if (!rawValue) return;
  const value = decodeValueFunc(rawValue);

  // check if value is what we expect it to be
  if (
    typeof value === 'object' &&
    value !== null &&
    'theme' in value &&
    typeof value.theme === 'string'
  ) {
    const theme = value.theme as string;
    return theme === Theme.LIGHT ? Theme.LIGHT : Theme.DARK;
  }
}
