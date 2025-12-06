import { Theme, getThemeCookie } from './cookie-parser';

const currentScript = document.currentScript;
if (!currentScript) {
  throw new Error('Failed to get current script');
}

const preferedTheme = window.matchMedia('(prefers-color-scheme: light)').matches
  ? Theme.LIGHT
  : Theme.DARK;

// preferedTheme fallback
let theme = preferedTheme;

const cookieName = currentScript.dataset.cookieName;
// console.log(cookieName);
if (cookieName) {
  // overwrite fallback if data-cookie-name was not set
  theme =
    getThemeCookie(document.cookie, { name: cookieName }) ?? preferedTheme;
}

const dataAttr = document.documentElement.dataset.theme;

if (typeof dataAttr === 'string') {
  const themeAlreadyApplied = dataAttr === 'light' || dataAttr === 'dark';
  if (!themeAlreadyApplied) {
    document.documentElement.dataset.theme = theme;
  }
} else {
  document.documentElement.dataset.theme = theme;
}

const meta = document.querySelector<HTMLMetaElement>('meta[name=color-scheme]');
if (meta) {
  if (theme === 'dark') {
    meta.content = 'dark light';
  } else if (theme === 'light') {
    meta.content = 'light dark';
  }
}
