import { Theme } from 'remix-themes';
import { assert, describe, expect, test, vi } from 'vitest';

import { decodeValue, getThemeCookie, parseHeader } from './cookie-parser';

// these values
const value = { theme: 'light' };
const cookieName = '__remix-themes';
const rawValue = 'eyJ0aGVtZSI6ImxpZ2h0In0%3D';
const rawSignedValue =
  'eyJ0aGVtZSI6ImxpZ2h0In0%3D.p4tB7fAAzlQIGhY2wlazqGtxRGLStF0CnvBlJ8mM6Y0';
const rawHeader =
  '__next_hmr_refresh_hash__=89; sidebar_state=true; __remix-themes=eyJ0aGVtZSI6ImxpZ2h0In0%3D';
const rawSignedHeader =
  '__next_hmr_refresh_hash__=89; sidebar_state=true; __remix-themes=eyJ0aGVtZSI6ImxpZ2h0In0%3D.p4tB7fAAzlQIGhY2wlazqGtxRGLStF0CnvBlJ8mM6Y0';

describe('parseHeader', () => {
  test('no secret', () => {
    assert.strictEqual(parseHeader(rawHeader, cookieName), rawValue);
  });

  test('with secret', () => {
    assert.strictEqual(
      parseHeader(rawSignedHeader, cookieName),
      rawSignedValue,
    );
  });
});

describe('decodeValue', () => {
  test('no secret', () => {
    assert.deepEqual(decodeValue(rawValue), value);
  });

  test('with secret', () => {
    assert.deepEqual(decodeValue(rawSignedValue), value);
  });
});

test('getThemeCookie', () => {
  const parseMock = vi.fn();
  const decodeMock = vi.fn();

  const cookie = {
    name: cookieName,
    parseHeaderFunc: parseMock,
    decodeValueFunc: decodeMock,
  };

  parseMock.mockReturnValue(rawValue);
  decodeMock.mockReturnValue(value);
  assert.deepEqual(getThemeCookie(rawHeader, cookie), Theme.LIGHT);
  expect(parseMock).toBeCalledWith(rawHeader, cookieName);
  expect(decodeMock).toBeCalledWith(rawValue);

  parseMock.mockClear();
  decodeMock.mockClear();
  parseMock.mockReturnValue('test');
  decodeMock.mockReturnValue({ test: 'value' });
  assert.isUndefined(getThemeCookie('header parsing is mocked anyway', cookie));
  expect(parseMock).toBeCalledWith(
    'header parsing is mocked anyway',
    cookieName,
  );
  expect(decodeMock).toBeCalledWith('test');
});
