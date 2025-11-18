import { type ReactElement, useMemo } from 'react';

const text = `Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus
ex sapien vitae pellentesque sem placerat. In id cursus mi pretium
tellus duis convallis. Tempus leo eu aenean sed diam urna tempor.
Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis
massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper
vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra
inceptos himenaeos.`;

/**
 * Duplizierung von Platzhalter Paragraphen.
 * @param count Anzahl der Platzhalter Paragraphen.
 * @returns Array von Platzhalter Paragrap Texten.
 */
export function placeholder(count: number): string[] {
  return Array.from<string>({ length: count }).fill(text);
}

/**
 * Hook um Platzhalter Paragraphen für JSX zu generieren.
 * @param count Anzahl der Platzhalter Paragraphen.
 * @returns Array von React JSX.
 */
export function usePlaceholder(count: number) {
  const elements = useMemo(
    () => Array.from<ReactElement>({ length: count }).fill(<p>{text}</p>),
    [count],
  );
  return elements;
}
