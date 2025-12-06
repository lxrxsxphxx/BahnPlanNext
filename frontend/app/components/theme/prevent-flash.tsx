import { useTheme } from 'remix-themes';

// scripts build using tsdown: pnpm run buildScripts
import script from './theme-check.iife?raw';
import { unsafeCookie } from './theme-cookie';

type PreventFlashOnWrongThemeProps = {
  ssrTheme: boolean;
  nonce?: string;
};

export function PreventFlashOnWrongTheme({
  ssrTheme,
  nonce,
}: PreventFlashOnWrongThemeProps) {
  const [theme] = useTheme();

  return (
    <>
      {/*
        On the server, "theme" might be `null`, so clientThemeCode ensures that
        this is correct before hydration.
      */}
      <meta
        name="color-scheme"
        content={theme === 'light' ? 'light dark' : 'dark light'}
      />
      {/*
        If we know what the theme is from the server then we don't need
        to do fancy tricks prior to hydration to make things match.
      */}
      {ssrTheme ? null : (
        <script
          // NOTE: we cannot use type="module" because that automatically makes
          // the script "defer". That doesn't work for us because we need
          // this script to run synchronously before the rest of the document
          // is finished loading.
          /* oxlint-disable-next-line jsx-no-new-object-as-prop */
          dangerouslySetInnerHTML={{ __html: script }}
          data-cookie-name={unsafeCookie.name}
          nonce={nonce}
          suppressHydrationWarning
        />
      )}
    </>
  );
}
