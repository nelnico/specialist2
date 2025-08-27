"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/common/theme-toggle";
import MobileLink from "./mobile-link";
import { siteConfig } from "@/lib/data/site-config";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

/**
 * -------------------------------------------------------
 * 1) Shared navigation types
 * -------------------------------------------------------
 */
export type NavLink = {
  type: "link";
  title: string;
  href: string;
  description?: string;
};

export type NavGroup = {
  title?: string;
  items: NavLink[];
};

export type NavFeatured = {
  title: string;
  href: string;
  subtitle: string;
  // optional: render an icon/component inside the featured tile
  renderIcon?: () => React.ReactNode;
};

export type NavMega = {
  type: "mega";
  trigger: string; // the label shown on the desktop NavigationMenuTrigger
  featured?: NavFeatured; // big tile on the left (optional)
  groups: NavGroup[]; // columns/sections inside the mega panel
};

export type NavItem = NavLink | NavMega;

export type NavConfig = {
  items: NavItem[];
};

/**
 * -------------------------------------------------------
 * 2) Single source of truth (replace your duplicated arrays)
 * -------------------------------------------------------
 */
const componentsList = [
  {
    type: "link",
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    type: "link",
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    type: "link",
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    type: "link",
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    type: "link",
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    type: "link",
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
] as const satisfies readonly NavLink[];

const NAV: NavConfig = {
  items: [
    {
      type: "mega",
      trigger: siteConfig.shortName,
      featured: {
        title: siteConfig.name,
        href: "/",
        subtitle: siteConfig.description,
        renderIcon: () => <div className="h-6 w-6 rounded bg-primary" />,
      },
      groups: [
        {
          items: [
            {
              type: "link",
              title: "About Us",
              href: "/about",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            },
            {
              type: "link",
              title: "Contact Us",
              href: "/contact",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            },
            {
              type: "link",
              title: "Typography",
              href: "/docs/primitives/typography",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            },
          ],
        },
      ],
    },
    {
      type: "mega",
      trigger: "Components",
      groups: [
        {
          items: componentsList as unknown as NavLink[],
        },
      ],
    },
    { type: "link", title: "Join Us", href: "/join" },
  ],
} as const satisfies NavConfig;

/**
 * -------------------------------------------------------
 * 3) Header using the shared NAV config for both mobile & desktop
 * -------------------------------------------------------
 */
export function Header() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background">
      <div className="w-full max-w-none flex h-14 items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Mobile menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <MobileLink
              href="/"
              className="flex items-center"
              onOpenChange={setIsOpen}
            >
              <div className="h-6 w-6 rounded bg-primary mr-2" />
              <span className="font-bold">{siteConfig.name}</span>
            </MobileLink>

            <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-4">
                {NAV.items.map((item, idx) => (
                  <div key={idx} className="space-y-3">
                    {item.type === "link" ? (
                      <MobileLink
                        href={item.href}
                        onOpenChange={setIsOpen}
                        className="font-medium"
                      >
                        {item.title}
                      </MobileLink>
                    ) : (
                      <>
                        <h4 className="font-medium text-sm text-muted-foreground">
                          {item.trigger}
                        </h4>
                        <div className="flex flex-col space-y-2 pl-2">
                          {item.groups.map((group, gIdx) => (
                            <div key={gIdx} className="flex flex-col space-y-2">
                              {group.title && (
                                <div className="text-xs text-muted-foreground font-medium">
                                  {group.title}
                                </div>
                              )}
                              {group.items.map((link) => (
                                <MobileLink
                                  key={link.title}
                                  href={link.href}
                                  onOpenChange={setIsOpen}
                                >
                                  {link.title}
                                </MobileLink>
                              ))}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo (single element handles both breakpoints) */}
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <div className="h-6 w-6 rounded bg-primary" />
          {/* hide on xs for tight spacing, show from md with normal weight; on mobile keep bold */}
          <span className="font-bold md:font-normal">
            <span className="md:hidden">{siteConfig.name}</span>
            <span className="hidden md:inline-block font-bold">
              {siteConfig.name}
            </span>
          </span>
        </Link>

        {/* Desktop Navigation (driven by NAV) */}
        <div className="hidden md:flex md:flex-1">
          <NavigationMenu>
            <NavigationMenuList>
              {NAV.items.map((item, idx) => (
                <NavigationMenuItem key={idx}>
                  {item.type === "link" ? (
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                      href={item.href}
                    >
                      {item.title}
                    </NavigationMenuLink>
                  ) : (
                    <>
                      <NavigationMenuTrigger>
                        {item.trigger}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                          {item.featured && (
                            <li className="row-span-3">
                              <NavigationMenuLink asChild>
                                <Link
                                  className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                  href={item.featured.href}
                                >
                                  {item.featured.renderIcon?.() ?? (
                                    <div className="h-6 w-6 rounded bg-primary" />
                                  )}
                                  <div className="mb-2 mt-4 text-lg font-medium">
                                    {item.featured.title}
                                  </div>
                                  <p className="text-sm leading-tight text-muted-foreground">
                                    {item.featured.subtitle}
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          )}

                          {/* groups/columns */}
                          {item.groups.map((group, gIdx) => (
                            <React.Fragment key={gIdx}>
                              {group.items.map((link) => (
                                <ListItem
                                  key={link.title}
                                  href={link.href}
                                  title={link.title}
                                >
                                  {link.description}
                                </ListItem>
                              ))}
                            </React.Fragment>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right Side - User Menu and Theme Toggle */}
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center space-x-2">
            <SignedOut>
              <SignInButton>
                <div>Sign In</div>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}

/**
 * -------------------------------------------------------
 * 4) Re-usable ListItem (unchanged, just typed)
 * -------------------------------------------------------
 */
const ListItem = React.forwardRef<
  React.ComponentRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title?: string }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          {title && (
            <div className="text-sm font-medium leading-none">{title}</div>
          )}
          {children && (
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          )}
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
