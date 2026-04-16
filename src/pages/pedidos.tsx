import React from "react";
import { listarPedidos } from "@/lib/api";
import { useAuth } from "@/state/auth";
import { Badge } from "@/components/ui/badge";
import { Package, ChevronRight, ShoppingBag, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";

type Pedido = Record<string, unknown>;

function getStatusVariant(status: string): "success" | "warning" | "destructive" | "secondary" | "accent" {
  const s = status.toLowerCase();
  if (s.includes("entregue") || s.includes("concluído") || s.includes("concluido")) return "success";
  if (s.includes("cancel")) return "destructive";
  if (s.includes("pend") || s.includes("aguard")) return "warning";
  if (s.includes("enviad") || s.includes("transport")) return "accent";
  return "secondary";
}

function OrderCard({ pedido }: { pedido: Pedido }) {
  const status = String(pedido.status ?? "Pendente");
  const itens = Array.isArray(pedido.itens) ? pedido.itens : [];
  const id = String(pedido._id);
  const shortId = id.length > 8 ? `#${id.slice(-8).toUpperCase()}` : `#${id.toUpperCase()}`;

  const createdAt = pedido.createdAt
    ? new Date(String(pedido.createdAt)).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all hover:shadow-card-hover sm:flex-row sm:items-center">
      {/* Left accent */}
      <div className="flex h-1 w-full bg-gradient-to-r from-foreground/40 to-transparent sm:h-full sm:w-1 sm:flex-col" />

      {/* Order icon */}
      <div className="hidden sm:flex h-full items-center px-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
          <Package className="size-5 text-muted-foreground" />
        </div>
      </div>

      {/* Main info */}
      <div className="flex flex-1 flex-col gap-1 p-4 sm:py-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold tracking-tight">{shortId}</p>
            {createdAt && (
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3" />
                {createdAt}
              </p>
            )}
          </div>
          <Badge variant={getStatusVariant(status)} className="shrink-0">
            {status}
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground">
          {itens.length > 0
            ? `${itens.length} ${itens.length === 1 ? "item" : "itens"}`
            : "Nenhum item"}
        </p>
      </div>

      {/* Right arrow */}
      <div className="flex items-center px-4 text-muted-foreground transition-transform group-hover:translate-x-0.5">
        <ChevronRight className="size-4" />
      </div>
    </div>
  );
}

function OrderSkeleton() {
  return (
    <div className="flex overflow-hidden rounded-xl border border-border bg-card">
      <div className="h-auto w-1 animate-pulse bg-muted" />
      <div className="hidden h-auto items-center px-5 sm:flex">
        <div className="h-11 w-11 animate-pulse rounded-xl bg-muted" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between">
          <div className="h-4 w-28 animate-pulse rounded bg-muted" />
          <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
        </div>
        <div className="h-3 w-16 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

export function PedidosPage() {
  const { token } = useAuth();
  const [pedidos, setPedidos] = React.useState<Pedido[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!token) return;
    let alive = true;
    setLoading(true);
    listarPedidos(token)
      .then((data) => {
        if (!alive) return;
        setPedidos(data as Pedido[]);
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [token]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-10">
        <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Histórico
        </p>
        <h1 className="text-3xl font-bold tracking-tight">Meus Pedidos</h1>
        {!loading && (
          <p className="mt-2 text-sm text-muted-foreground">
            {pedidos.length} {pedidos.length === 1 ? "pedido encontrado" : "pedidos encontrados"}
          </p>
        )}
        <div className="mt-6 h-px bg-gradient-to-r from-border via-border/30 to-transparent" />
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <OrderSkeleton key={i} />)}
        </div>
      ) : pedidos.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="size-7 text-muted-foreground" />
          </div>
          <h3 className="mb-1 text-base font-medium">Nenhum pedido ainda</h3>
          <p className="mb-6 text-sm text-muted-foreground">
            Que tal fazer a sua primeira compra?
          </p>
          <Link to="/produtos" className={buttonVariants({ size: "sm" })}>
            Explorar produtos
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {pedidos.map((p) => (
            <OrderCard key={String(p._id)} pedido={p} />
          ))}
        </div>
      )}
    </div>
  );
}
