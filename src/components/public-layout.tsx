import { Outlet } from "react-router-dom";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/state/auth";
import { LayoutDashboard, ShoppingBag, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function PublicLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === "/produtos" || location.pathname === "/";

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-2xl">
        <div className="mx-auto flex h-[60px] w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link to="/produtos" className="group flex shrink-0 items-center gap-2.5">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-primary/30 shadow-md transition-all duration-300 group-hover:rounded-lg group-hover:shadow-lg">
              <ShoppingBag className="size-[15px]" strokeWidth={2.2} />
            </div>
            <span className="text-[15px] font-bold tracking-tight">Vitrine</span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            {user ? (
              <Link
                to="/admin/produtos"
                className="group inline-flex h-9 items-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground shadow-sm transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md"
              >
                <LayoutDashboard className="size-3.5 text-muted-foreground transition-colors group-hover:text-primary" />
                Painel Admin
              </Link>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="group inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 transition-all duration-200 hover:shadow-lg hover:shadow-primary/30 hover:opacity-90 active:scale-[0.98]"
                >
                  Acessar painel admin
                  <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </NavLink>
              </>
            )}
          </div>
        </div>
      </header>

      <main className={cn("flex-1", isHome && "bg-muted/30")}>
        <Outlet />
      </main>

      <footer className="border-t border-border/60 bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <ShoppingBag className="size-3" strokeWidth={2.2} />
              </div>
              <span className="text-sm font-semibold">Vitrine</span>
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Vitrine. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
