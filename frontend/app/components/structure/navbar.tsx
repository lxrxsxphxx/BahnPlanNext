import { memo } from 'react';
import { NavLink } from 'react-router';

import { TrainFront } from 'lucide-react';

import { LINKS, useIsHomepage } from './links';
import { Search } from './search';
import { SidebarTrigger } from './sidebar';
import { SigninButton } from '@/components/auth/signin';
import { SignupButton } from '@/components/auth/signup';
import { ModeToggle } from '@/components/theme/mode-toggle';
import { Button } from '@/components/ui/button';

/**
 * Header für Anmelden- & Registrieren Buttons,
 * oder Nutzerprofil wenn Angemeldet
 */
function AuthenticationHeader() {
  return (
    <>
      <SigninButton />
      <SignupButton />
    </>
  );
}

// Mit memo cachen, damit nicht neu gerendert wird – LINKS ändert sich ja nie.
const Links = memo(function Links() {
  return LINKS.filter((l) => l.hideOnHeader !== true).map((l) => (
    <li key={l.to}>
      <Button variant="ghost" asChild>
        <NavLink to={l.to} end>
          {l.label}
        </NavLink>
      </Button>
    </li>
  ));
});

export function Navbar() {
  const isHomepage = useIsHomepage();

  let middle;
  if (isHomepage) {
    // Header Navigation Links nur auf Homepage
    middle = (
      <>
        <nav className="hidden md:flex 2xl:w-full">
          <ul className="flex items-center 2xl:w-full 2xl:justify-around">
            <Links />
          </ul>
        </nav>
        <div className="hidden flex-1 justify-center sm:flex md:hidden!">
          <Search />
        </div>
      </>
    );
  } else {
    // Sonst wird Suche angezeigt, da Sidebar die Navigation übernimmt
    middle = (
      <div className="xs:flex hidden flex-1 justify-center">
        <Search />
      </div>
    );
  }

  return (
    <div className="h-(--header-height) w-(--header-width)">
      <header className="bg-background fixed flex h-(--header-height) w-(--header-width) items-center justify-between gap-4 px-10 py-2">
        <div className="flex gap-4">
          <SidebarTrigger className="md:hidden" />
          {isHomepage ? (
            <Button variant="link" asChild>
              <NavLink to="/" className="text-xl font-semibold tracking-wide">
                <TrainFront />
                BahnPlan
              </NavLink>
            </Button>
          ) : null}
        </div>

        {middle}

        <div className="flex items-center gap-3">
          <AuthenticationHeader />
          <ModeToggle />
        </div>
      </header>
    </div>
  );
}
