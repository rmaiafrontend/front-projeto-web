import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/state/auth";
import {
  Package,
  ShoppingBag,
  User,
  Tag,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ShoppingCart,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  to: string;
  icon: React.ElementType;
  label: string;
};

type NavSection = {
  section: string;
  items: NavItem[];
};

const NAVIGATION: NavSection[] = [
  {
    section: "Catálogo",
    items: [
      { to: "/admin/produtos", icon: Package, label: "Produtos" },
      { to: "/admin/categorias", icon: Tag, label: "Categorias" },
      { to: "/produtos", icon: ShoppingBag, label: "Ir para o catálogo" },
    ],
  },
  {
    section: "Conta",
    items: [
      { to: "/admin/perfil", icon: User, label: "Meu perfil" },
    ],
  },
];

type SidebarContextType = {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
};

const SidebarContext = React.createContext<SidebarContextType>({
  collapsed: false,
  setCollapsed: () => {},
  mobileOpen: false,
  setMobileOpen: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, mobileOpen, setMobileOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return React.useContext(SidebarContext);
}

function SidebarNavItem({ item, collapsed, onNavigate }: {
  item: NavItem;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
          collapsed ? "justify-center px-2.5" : "",
          isActive
            ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon className={cn("size-4 shrink-0 transition-transform duration-150", !isActive && "group-hover:scale-110")} />
          {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
        </>
      )}
    </NavLink>
  );
}

function SidebarContent({ collapsed, onNavigate }: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const initials = user?.nome
    ? user.nome.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? "?";

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className={cn(
        "flex h-[60px] shrink-0 items-center border-b border-border/50 px-4",
        collapsed ? "justify-center px-3" : "gap-3"
      )}>
        <Link to="/produtos" className="group flex items-center gap-2.5" onClick={onNavigate}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/30 transition-all duration-200 group-hover:scale-95 group-hover:rounded-lg">
            <ShoppingCart className="size-[15px]" strokeWidth={2.2} />
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-bold leading-none tracking-tight">Vitrine</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">Painel Admin</p>
            </div>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-5">
        {NAVIGATION.map((section) => (
          <div key={section.section}>
            {!collapsed && (
              <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                {section.section}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <SidebarNavItem
                  key={item.label}
                  item={item}
                  collapsed={collapsed}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User footer */}
      {user && (
        <div className={cn(
          "shrink-0 border-t border-border/50 p-3",
          collapsed ? "flex justify-center" : ""
        )}>
          {collapsed ? (
            <button
              onClick={handleLogout}
              title="Sair"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="size-4" />
            </button>
          ) : (
            <div className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-muted/50">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-primary-foreground shadow-sm"
                style={{ background: "oklch(0.47 0.22 270)" }}
              >
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold leading-none">{user.nome ?? "Admin"}</p>
                <p className="mt-0.5 truncate text-[10px] text-muted-foreground">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                title="Sair"
                className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="size-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function AdminSidebar() {
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebar();

  return (
    <>
      {/* Desktop */}
      <aside className={cn(
        "hidden lg:flex flex-col fixed inset-y-0 left-0 z-40 border-r border-border/50 bg-background transition-all duration-300",
        collapsed ? "w-[60px]" : "w-[220px]"
      )}>
        <SidebarContent collapsed={collapsed} />

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-[72px] flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
        >
          {collapsed ? <ChevronRight className="size-3" /> : <ChevronLeft className="size-3" />}
        </button>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-[260px] border-r border-border/50 bg-background shadow-xl transition-transform duration-300 lg:hidden",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute right-3 top-3.5 flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" />
        </button>
        <SidebarContent collapsed={false} onNavigate={() => setMobileOpen(false)} />
      </aside>
    </>
  );
}

export function MobileMenuButton() {
  const { setMobileOpen } = useSidebar();
  return (
    <button
      onClick={() => setMobileOpen(true)}
      className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
      aria-label="Abrir menu"
    >
      <Menu className="size-5" />
    </button>
  );
}
