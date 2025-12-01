import { getThemeCookie } from './cookie-parser';

// this script is build using tsdown: pnpm run buildScripts

const currentScript = document.currentScript;
if (!currentScript) {
  throw new Error('Failed to get current script');
}

const cookieName = currentScript.dataset['cookieName'];
// console.log(cookieName);
if (!cookieName) {
  throw new Error('No cookie name provided');
}

const type = currentScript.dataset.type ?? 'data';

const preferedTheme = window.matchMedia('(prefers-color-scheme: light)').matches
  ? 'light'
  : 'dark';
const theme =
  getThemeCookie(document.cookie, { name: cookieName }) ?? preferedTheme;

const cl = document.documentElement.classList;
const dataAttr = document.documentElement.dataset.theme;

console.log(dataAttr);
if (typeof dataAttr === 'string') {
  const themeAlreadyApplied = dataAttr === 'light' || dataAttr === 'dark';
  if (!themeAlreadyApplied) {
    document.documentElement.dataset.theme = theme;
  }
} else {
  const themeAlreadyApplied = cl.contains('light') || cl.contains('dark');
  if (!themeAlreadyApplied) {
    cl.add(theme);
  }
}

const meta = document.querySelector<HTMLMetaElement>('meta[name=color-scheme]');
if (meta) {
  if (theme === 'dark') {
    meta.content = 'dark light';
  } else if (theme === 'light') {
    meta.content = 'light dark';
  }
}
