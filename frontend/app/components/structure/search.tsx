import {
  type ComponentProps,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { NavLink } from 'react-router';

import { LINKS } from './links';
import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/components/ui/command';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { cn } from '@/lib/utils';

const links = LINKS.flatMap((link) => (link.children ?? []).concat(link));

export type Replace<A, B, K extends keyof B> = Omit<A, K> & Pick<B, K>;

export function Search({
  className,
  onClick,
  onSelect,
  ...props
}: Replace<
  ComponentProps<typeof Button>,
  ComponentProps<typeof CommandItem>,
  'onSelect'
>) {
  const [open, setOpen] = useState(false);
  const click = useCallback<NonNullable<typeof onClick>>(
    (event) => {
      onClick?.(event);
      setOpen(true);
    },
    [onClick, setOpen],
  );
  const select = useCallback<NonNullable<typeof onSelect>>(
    (event) => {
      onSelect?.(event);
      setOpen(false);
    },
    [onSelect, setOpen],
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        size="lg"
        center={false}
        className={cn('relative w-full max-w-md md:justify-center', className)}
        onClick={click}
        {...props}
      >
        <span className="text-foreground hidden md:inline-flex">
          Suche Strecke / ID / Spieler ...
        </span>
        <span className="text-foreground inline-flex md:hidden">Suche...</span>
        <div className="absolute right-0 flex h-full items-center justify-end pr-2">
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </div>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Suche"
        description="Suche auf der Webseite"
      >
        <CommandInput placeholder="Tippe eine Seite oder Suche..." />
        <CommandList>
          <CommandEmpty>Keine Ergebnisse gefunden.</CommandEmpty>
          <CommandGroup heading="Seiten">
            {links.map((link) => (
              <CommandItem asChild key={link.to} onSelect={select}>
                <NavLink to={link.to}>{link.label}</NavLink>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
