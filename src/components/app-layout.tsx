import { Outlet, useLocation } from "react-router-dom";
import { AdminSidebar, SidebarProvider, useSidebar, MobileMenuButton } from "@/components/sidebar";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

const ROUTE_TITLES: Record<string, { title: string; description: string }> = {
  "/admin/produtos":   { title: "Produtos",   description: "Gerencie o catálogo de produtos" },
  "/admin/categorias": { title: "Categorias", description: "Organize as categorias" },
  "/admin/perfil":     { title: "Meu Perfil", description: "Configurações da sua conta" },
  "/pedidos":          { title: "Pedidos",    description: "Acompanhe e gerencie os pedidos" },
};

function AdminHeader() {
  const { collapsed } = useSidebar();
  const location = useLocation();

  const pathKey = Object.keys(ROUTE_TITLES).find(
    (k) => location.pathname === k || location.pathname.startsWith(k + "/")
  );
  const meta = pathKey ? ROUTE_TITLES[pathKey] : null;

  return (
    <header className={cn(
      "fixed right-0 top-0 z-30 flex h-[60px] items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-xl px-4 sm:px-6 transition-all duration-300",
      collapsed ? "lg:left-[60px]" : "lg:left-[220px]",
      "left-0"
    )}>
      <div className="flex items-center gap-3">
        <MobileMenuButton />
        {meta && (
          <div className="hidden sm:block">
            <h1 className="text-sm font-semibold leading-none">{meta.title}</h1>
            <p className="mt-0.5 text-xs text-muted-foreground">{meta.description}</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          className="relative flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Notificações"
        >
          <Bell className="size-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>
      </div>
    </header>
  );
}

function AdminContent() {
  const { collapsed } = useSidebar();
  return (
    <div className={cn(
      "flex min-h-dvh flex-col bg-muted/20 transition-all duration-300",
      collapsed ? "lg:pl-[60px]" : "lg:pl-[220px]"
    )}>
      <AdminHeader />
      <main className="flex-1 pt-[60px]">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export function AppLayout() {
  return (
    <SidebarProvider>
      <div className="relative">
        <AdminSidebar />
        <AdminContent />
      </div>
    </SidebarProvider>
  );
}
