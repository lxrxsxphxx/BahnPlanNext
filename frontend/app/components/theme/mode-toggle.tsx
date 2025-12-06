import { useCallback } from 'react';

// import { useFetcher } from 'react-router';

import { Moon, Sun } from 'lucide-react';
import { Theme, useTheme } from 'remix-themes';

// import { themeCookie } from './theme-cookie';
import { Button } from '@/components/ui/button';

export function ModeToggle() {
  const [_, setTheme] = useTheme();
  // const fetcher = useFetcher();

  const switchTheme = useCallback(() => {
    setTheme((prev) => (prev === Theme.DARK ? Theme.LIGHT : Theme.DARK));
    // fetcher
    //   .submit(
    //     { theme: 'light' },
    //     { method: 'POST', action: '/theme', encType: 'application/json' },
    //   )
    //   .then(async () => {
    //     console.log(await themeCookie.parse(document.cookie));
    //   });
  }, [setTheme]);

  return (
    <Button variant="outline" size="icon" onClick={switchTheme}>
      <Sun className="text-foreground h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="text-foreground absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
    </Button>
  );
}
