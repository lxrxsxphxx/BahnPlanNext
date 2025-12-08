import {
  type CSSProperties,
  type MouseEventHandler,
  memo,
  useCallback,
  useMemo,
} from 'react';
import { NavLink } from 'react-router';

import { ChevronRight, PanelLeftIcon, TrainFront } from 'lucide-react';

import { LINKS, useIsHomepage } from './links';
import { Search } from './search';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

/**
 * Animierte SidebarInset Komponente, animiert Breite (--sidebar-width)
 * des Seiteninhalts wenn Sidebar geöffnet oder geschlossen wird.
 */
export function SidebarAnimatedInset({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const isHomepage = useIsHomepage();
  const { state, isMobile } = useSidebar();

  const style = useMemo(
    () =>
      ({
        ...props.style,
        '--header-width':
          state === 'expanded' && !isMobile && !isHomepage
            ? 'calc(100vw - var(--sidebar-width))'
            : '100vw',
      }) as CSSProperties,
    [props.style, state, isMobile, isHomepage],
  );

  return (
    <div
      data-slot="sidebar-inset"
      className={cn(
        'bg-background relative flex h-full w-(--header-width) flex-1 flex-col transition-[left,right,width] duration-200 ease-linear',
        className,
      )}
      {...props}
      style={style}
    />
  );
}

/**
 * Angepasste SidebarInset Komponente von Shadcn,
 * um nur die Mobile Sidebar zu Toggeln
 */
export function SidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { openMobile, setOpenMobile } = useSidebar();
  const toggleSidebar = useCallback<MouseEventHandler<HTMLButtonElement>>(
    (event) => {
      onClick?.(event);
      setOpenMobile(!openMobile);
    },
    [onClick, openMobile, setOpenMobile],
  );

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn('size-7', className)}
      onClick={toggleSidebar}
      {...props}
    >
      <PanelLeftIcon />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

// Mit memo speichern, damit nicht neu gerendert wird – LINKS ist nicht dynamisch.
const Links = memo(function Links({
  onCloseSidebar,
}: {
  onCloseSidebar: () => void;
}) {
  return LINKS.filter((l) => !l.hideOnSidebar).flatMap((link) => {
    const item = (
      <SidebarMenuButton asChild navlink onClick={onCloseSidebar}>
        <NavLink to={link.to} end>
          {link.label}
        </NavLink>
      </SidebarMenuButton>
    );

    if (link.children) {
      return (
        <Collapsible key={link.to} defaultOpen className="group/collapsible">
          <SidebarMenuItem>
            {item}
            <CollapsibleTrigger asChild>
              <SidebarMenuAction className="px-3">
                <ChevronRight className="transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuAction>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {link.children.map((child) => {
                  const to = link.to + child.to;
                  return (
                    <SidebarMenuSubItem key={to}>
                      <SidebarMenuSubButton
                        asChild
                        navlink
                        onClick={onCloseSidebar}
                      >
                        <NavLink to={to} end>
                          {child.label}
                        </NavLink>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  );
                })}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      );
    }

    return <SidebarMenuItem key={link.to}>{item}</SidebarMenuItem>;
  });
});

export function AppSidebar() {
  const isHomepage = useIsHomepage();
  const isMobile = useIsMobile();

  const { setOpenMobile } = useSidebar();

  const closeSidebar = useCallback(() => setOpenMobile(false), [setOpenMobile]);

  // auf Homepage wird durch Header Navigation ersetzt, außer für Mobile
  if (isHomepage && !isMobile) return;

  return (
    <Sidebar>
      <SidebarHeader className="pt-5">
        <SidebarMenuButton asChild onClick={closeSidebar} tooltip="Startseite">
          <NavLink to="/" className="text-xl font-semibold">
            <TrainFront />
            BahnPlan
          </NavLink>
        </SidebarMenuButton>
        <Search className="sm:hidden" />
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <Links onCloseSidebar={closeSidebar} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
