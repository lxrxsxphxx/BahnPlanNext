/* oxlint-disable jsx-no-new-array-as-prop*/
import { memo } from 'react';
import { NavLink } from 'react-router';

import { LINKS, useIsHomepage } from './links';

function className(isActive: boolean, add: string) {
  return (
    add +
    ' block rounded-md px-3 py-2 text-sm transition-colors ' +
    (isActive
      ? 'bg-white/20 text-white shadow-inner ring-1 ring-white/20'
      : 'text-white/90 hover:bg-white/10')
  );
}

function parentClassName({ isActive }: { isActive: boolean }) {
  return className(isActive, 'font-bold pr-25 text-left');
}

function childClassName({ isActive }: { isActive: boolean }) {
  return className(isActive, 'font-normal pl-10');
}

// Mit memo speichern, damit nicht neu gerendert wird – LINKS ist nicht dynamisch.
const Links = memo(function Links() {
  return LINKS.filter((l) => !l.hideOnSidebar).flatMap((link) => {
    let elemente = [
      <li key={link.to}>
        <NavLink to={link.to} end className={parentClassName}>
          {link.label}
        </NavLink>
      </li>,
    ];

    // add children to elements
    if (link.children) {
      elemente.push(
        ...link.children.map((child) => (
          <li key={child.to}>
            <NavLink
              to={link.to.concat(child.to)}
              end
              className={childClassName}
            >
              {child.label}
            </NavLink>
          </li>
        )),
      );
    }

    return elemente;
  });
});

export default function Sidebar() {
  const isHomepage = useIsHomepage();

  // sidebar wird nur auf Homepage nicht angezeigt
  if (isHomepage) return;
  return (
    <aside className="min-h-full w-64 shrink-0 overflow-clip bg-black shadow">
      <nav className="sticky top-20 pt-1">
        <ul className="flex w-full flex-col justify-between gap-1 px-3">
          <Links />
        </ul>
      </nav>
    </aside>
  );
}
