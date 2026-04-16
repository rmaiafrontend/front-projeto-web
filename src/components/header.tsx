import { Link, NavLink } from "react-router-dom";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/state/auth";
import { ShoppingBag, User, Search, LogOut, ChevronDown } from "lucide-react";
import React from "react";

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "relative text-sm font-medium tracking-wide transition-colors duration-200 py-1",
          isActive
            ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-foreground after:rounded-full"
            : "text-muted-foreground hover:text-foreground",
        ].join(" ")
      }
    >
      {label}
    </NavLink>
  );
}

export function Header() {
  const { user, logout } = useAuth();
  const [searchOpen, setSearchOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">

        {/* Logo */}
        <Link
          to="/produtos"
          className="flex shrink-0 items-center gap-2.5 group"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background transition-all group-hover:scale-95">
            <ShoppingBag className="size-4" strokeWidth={2.5} />
          </div>
          <span className="hidden text-base font-bold tracking-tight sm:inline">
            E-commerce
          </span>
        </Link>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-7">
          <NavItem to="/produtos" label="Produtos" />
          {user ? (
            <>
              <NavItem to="/pedidos" label="Pedidos" />
              <NavItem to="/perfil" label="Perfil" />
            </>
          ) : null}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-0.5">
          <button
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Buscar"
            onClick={() => setSearchOpen((v) => !v)}
          >
            <Search className="size-4" />
          </button>

          {user ? (
            <>
              <div className="ml-1 hidden items-center gap-0.5 sm:flex">
                <div className="h-4 w-px bg-border mx-2" />
                <button className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                  <User className="size-3.5 shrink-0" />
                  <span className="max-w-[120px] truncate">{user.email}</span>
                  <ChevronDown className="size-3 shrink-0 opacity-50" />
                </button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="gap-1.5 text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="size-3.5" />
                  <span className="hidden lg:inline">Sair</span>
                </Button>
              </div>

              {/* Mobile: only logout button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="sm:hidden"
                aria-label="Sair"
              >
                <LogOut className="size-4" />
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2 ml-2">
              <Link
                to="/login"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Entrar
              </Link>
              <Link
                to="/register"
                className={buttonVariants({ size: "sm" })}
              >
                Criar conta
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Search bar slide-down */}
      {searchOpen && (
        <div className="border-t border-border/50 bg-background/95 px-4 py-3 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                autoFocus
                type="search"
                placeholder="Buscar produtos..."
                className="h-10 w-full rounded-lg border border-input bg-muted/40 pl-9 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:bg-background focus:ring-2 focus:ring-ring/20"
                onKeyDown={(e) => e.key === "Escape" && setSearchOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
