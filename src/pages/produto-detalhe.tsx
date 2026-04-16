import React from "react";
import { Link, useParams } from "react-router-dom";
import { obterProduto, type Produto } from "@/lib/api";
import { buttonVariants } from "@/components/ui/button";
import {
  ChevronLeft,
  Package,
  Tag,
  ShoppingBag,
  Share2,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  Minus,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

function getCategoryName(cat: Produto["categoria_id"]): string | null {
  if (!cat || typeof cat === "string") return null;
  return cat.nome;
}

const GUARANTEES = [
  { icon: Truck, label: "Frete grátis", desc: "Pedidos acima de R$ 199" },
  { icon: RotateCcw, label: "Troca fácil", desc: "Até 30 dias corridos" },
  { icon: ShieldCheck, label: "Compra segura", desc: "Dados 100% protegidos" },
];

function LoadingSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 h-4 w-40 animate-pulse rounded-full bg-muted" />
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="space-y-4">
          <div className="aspect-square w-full animate-pulse rounded-3xl bg-muted" />
          <div className="grid grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        </div>
        <div className="space-y-5">
          <div className="h-5 w-24 animate-pulse rounded-full bg-muted" />
          <div className="space-y-2">
            <div className="h-8 w-4/5 animate-pulse rounded-full bg-muted" />
            <div className="h-8 w-2/3 animate-pulse rounded-full bg-muted" />
          </div>
          <div className="h-10 w-36 animate-pulse rounded-full bg-muted" />
          <div className="h-px bg-border" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 animate-pulse rounded-full bg-muted" style={{ width: `${70 - i * 10}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProdutoDetalhePage() {
  const { id } = useParams();
  const [produto, setProduto] = React.useState<Produto | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [qty, setQty] = React.useState(1);
  const [favorited, setFavorited] = React.useState(false);

  React.useEffect(() => {
    if (!id) return;
    let alive = true;
    setLoading(true);
    obterProduto(id)
      .then((p) => { if (alive) setProduto(p); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [id]);

  if (loading) return <LoadingSkeleton />;

  if (!produto) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link to="/produtos" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1.5 -ml-2")}>
          <ChevronLeft className="size-4" />
          Voltar
        </Link>
        <div className="mt-16 flex flex-col items-center py-24 text-center">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-border bg-muted">
            <Package className="size-8 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-bold">Produto não encontrado</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs">
            Este produto pode ter sido removido ou o link está incorreto.
          </p>
          <Link to="/produtos" className={cn(buttonVariants({ variant: "outline" }), "mt-6 gap-1.5")}>
            <ArrowUpRight className="size-4" />
            Explorar catálogo
          </Link>
        </div>
      </div>
    );
  }

  const category = getCategoryName(produto.categoria_id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-10 flex items-center gap-2 text-sm">
        <Link
          to="/produtos"
          className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-3.5" />
          Catálogo
        </Link>
        {category && (
          <>
            <span className="text-border">/</span>
            <span className="text-muted-foreground">{category}</span>
          </>
        )}
        <span className="text-border">/</span>
        <span className="truncate max-w-[180px] font-medium text-foreground">{produto.nome}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">

        {/* ── Left: image panel ─────────────────────── */}
        <div className="space-y-4">
          {/* Main image */}
          <div
            className="group relative aspect-square overflow-hidden rounded-3xl border border-primary/20"
            style={!produto.urlImagem ? { background: "oklch(0.47 0.22 270)" } : {}}
          >
            {produto.urlImagem ? (
              <img
                src={produto.urlImagem}
                alt={produto.nome}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <>
                <div className="absolute -top-16 -left-16 h-64 w-64 rounded-full opacity-40 transition-transform duration-700 group-hover:scale-110"
                  style={{ background: "oklch(0.75 0.18 290)", filter: "blur(60px)" }} />
                <div className="absolute -bottom-10 -right-10 h-48 w-48 rounded-full opacity-25 transition-transform duration-700 group-hover:scale-110"
                  style={{ background: "oklch(0.60 0.24 250)", filter: "blur(50px)" }} />
                <div className="absolute inset-0 opacity-[0.07]" style={{
                  backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package className="size-24 text-white/15 transition-transform duration-700 group-hover:scale-105" strokeWidth={0.6} />
                </div>
              </>
            )}

            {/* Floating action buttons */}
            <div className="absolute right-4 top-4 flex flex-col gap-2">
              <button
                onClick={() => setFavorited((v) => !v)}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-2xl shadow-sm transition-all duration-200 hover:scale-105",
                  favorited
                    ? "bg-rose-500 text-white shadow-rose-500/30"
                    : "bg-white/15 text-white ring-1 ring-white/20 backdrop-blur-sm hover:bg-white/25"
                )}
              >
                <Heart className={cn("size-4", favorited && "fill-current")} />
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white/25">
                <Share2 className="size-4" />
              </button>
            </div>

            {/* Stock badge */}
            <div className="absolute bottom-4 left-4">
              <span className="flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />

                Em estoque
              </span>
            </div>
          </div>

          {/* Thumbnail strip */}
          <div className="grid grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "aspect-square cursor-pointer overflow-hidden rounded-xl border bg-muted transition-all duration-150 hover:border-foreground/40",
                  i === 0 ? "border-foreground ring-2 ring-foreground/20" : "border-border"
                )}
              />
            ))}
          </div>
        </div>

        {/* ── Right: product info ───────────────────── */}
        <div className="flex flex-col gap-7">

          {/* Category + tags */}
          <div className="flex flex-wrap items-center gap-2">
            {category && (
              <span className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
                {category}
              </span>
            )}
            {Array.isArray(produto.tags) && produto.tags.slice(0, 3).map((tag) => (
              <span key={tag._id} className="flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground">
                <Tag className="size-2.5" />
                {tag.nome}
              </span>
            ))}
          </div>

          {/* Name */}
          <div className="space-y-3">
            <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
              {produto.nome}
            </h1>
            {produto.descricao && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {produto.descricao}
              </p>
            )}
          </div>

          {/* Price block */}
          <div className="rounded-2xl border border-border bg-muted/30 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              Preço
            </p>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold tracking-tight tabular-nums">
                R$ {Number(produto.preco).toFixed(2).replace(".", ",")}
              </span>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              ou em até 12x sem juros no cartão
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Quantity */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Quantidade
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center overflow-hidden rounded-xl border border-border bg-background">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  className="flex h-11 w-11 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30"
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-12 select-none text-center text-sm font-semibold tabular-nums">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="flex h-11 w-11 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Plus className="size-4" />
                </button>
              </div>
              <span className="text-xs text-muted-foreground">unidade(s)</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex gap-3">
            <button className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98]">
              <ShoppingBag className="size-4" />
              Adicionar ao carrinho
            </button>
            <button
              onClick={() => setFavorited((v) => !v)}
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-all duration-200 active:scale-[0.98]",
                favorited
                  ? "border-rose-200 bg-rose-50 text-rose-500 dark:border-rose-900 dark:bg-rose-950"
                  : "border-border bg-background text-muted-foreground hover:border-foreground/20 hover:text-foreground"
              )}
              aria-label="Favoritar"
            >
              <Heart className={cn("size-4", favorited && "fill-current")} />
            </button>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-3">
            {GUARANTEES.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 rounded-xl border border-border bg-muted/30 p-3 text-center"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-background ring-1 ring-border">
                  <Icon className="size-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold leading-tight">{label}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
