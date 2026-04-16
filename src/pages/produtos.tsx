import React from "react";
import { Link } from "react-router-dom";
import { listarProdutos, listarCategorias, type Produto, type Categoria } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Package,
  Search,
  ArrowUpRight,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Variações sutis do tom índigo para diferenciar os cards sem sair da identidade
const ORB_PAIRS: [string, string][] = [
  ["oklch(0.75 0.18 290)", "oklch(0.60 0.24 250)"],
  ["oklch(0.70 0.20 280)", "oklch(0.55 0.22 260)"],
  ["oklch(0.72 0.16 300)", "oklch(0.58 0.20 255)"],
  ["oklch(0.68 0.22 275)", "oklch(0.62 0.18 265)"],
];

function getOrbPair(id: string): [string, string] {
  return ORB_PAIRS[id.charCodeAt(id.length - 1) % ORB_PAIRS.length];
}

function getCategoryName(cat: Produto["categoria_id"]): string | null {
  if (!cat || typeof cat === "string") return null;
  return cat.nome;
}

function ProductCard({ produto }: { produto: Produto }) {
  const [orb1, orb2] = getOrbPair(produto._id);
  const category = getCategoryName(produto.categoria_id);

  return (
    <Link
      to={`/produtos/${produto._id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-card-hover"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden" style={!produto.urlImagem ? { background: "oklch(0.47 0.22 270)" } : {}}>
        {produto.urlImagem ? (
          /* Imagem real */
          <img
            src={produto.urlImagem}
            alt={produto.nome}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          /* Fallback índigo */
          <>
            <div className="absolute -top-6 -left-6 h-28 w-28 rounded-full opacity-40 transition-transform duration-700 group-hover:scale-110"
              style={{ background: orb1, filter: "blur(28px)" }} />
            <div className="absolute -bottom-4 -right-4 h-20 w-20 rounded-full opacity-30 transition-transform duration-700 group-hover:scale-110"
              style={{ background: orb2, filter: "blur(22px)" }} />
            <div className="absolute inset-0 opacity-[0.08]" style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="size-12 text-white/20 transition-transform duration-500 group-hover:scale-110" strokeWidth={0.8} />
            </div>
          </>
        )}

        {/* Hover pill */}
        <div className="absolute inset-0 flex items-end justify-end p-3 opacity-0 transition-all duration-300 group-hover:opacity-100">
          <span className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground shadow-lg shadow-primary/30">
            Ver produto
            <ArrowUpRight className="size-3" />
          </span>
        </div>

        {/* Category */}
        {category && (
          <div className="absolute left-3 top-3">
            <span className="rounded-full bg-black/30 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm ring-1 ring-white/20">
              {category}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex-1">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
            {produto.nome}
          </h3>
          {produto.descricao && (
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
              {produto.descricao}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border/50 pt-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Preço</p>
            <p className="text-base font-bold tabular-nums text-foreground">
              R$ {Number(produto.preco).toFixed(2).replace(".", ",")}
            </p>
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-muted/50 text-muted-foreground transition-all duration-200 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
            <ArrowUpRight className="size-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function ProductSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <div className="aspect-[4/3] animate-pulse bg-muted" />
      <div className="space-y-3 p-4">
        <div className="space-y-1.5">
          <div className="h-3.5 w-3/4 animate-pulse rounded-full bg-muted" />
          <div className="h-3 w-1/2 animate-pulse rounded-full bg-muted" />
        </div>
        <div className="flex items-center justify-between border-t border-border/50 pt-2">
          <div className="space-y-1">
            <div className="h-2.5 w-8 animate-pulse rounded-full bg-muted" />
            <div className="h-4 w-20 animate-pulse rounded-full bg-muted" />
          </div>
          <div className="h-7 w-7 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ search, categoriaAtiva, onClear }: {
  search: string;
  categoriaAtiva: string;
  onClear: () => void;
}) {
  const hasFilter = search || categoriaAtiva;
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-32 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
        <Package className="size-7 text-primary" strokeWidth={1.5} />
      </div>
      <h3 className="text-base font-semibold">
        {hasFilter ? "Nenhum produto encontrado" : "Catálogo vazio"}
      </h3>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        {hasFilter
          ? "Tente ajustar os filtros ou buscar por outro termo."
          : "Os produtos aparecerão aqui assim que forem cadastrados."}
      </p>
      {hasFilter && (
        <Button variant="outline" size="sm" onClick={onClear} className="mt-4 gap-1.5">
          <X className="size-3.5" />
          Limpar filtros
        </Button>
      )}
    </div>
  );
}

export function ProdutosPage() {
  const [allData, setAllData] = React.useState<Produto[]>([]);
  const [page, setPage] = React.useState(1);
  const limit = 12;
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [searchInput, setSearchInput] = React.useState("");
  const [categorias, setCategorias] = React.useState<Categoria[]>([]);
  const [categoriaAtiva, setCategoriaAtiva] = React.useState("");

  // Carrega todos os produtos uma única vez
  React.useEffect(() => {
    let alive = true;
    setLoading(true);
    listarProdutos({ limit: 500 })
      .then((resp) => {
        if (!alive) return;
        const list = Array.isArray(resp) ? resp : resp.data ?? [];
        setAllData(list as Produto[]);
      })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  React.useEffect(() => {
    listarCategorias({ limit: 100 })
      .then((resp) => {
        const list = Array.isArray(resp) ? resp : Array.isArray(resp.data) ? resp.data : [];
        setCategorias(list);
      })
      .catch(() => {});
  }, []);

  React.useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 200);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Filtragem local: categoria + busca
  const filtered = React.useMemo(() => {
    let result = allData;
    if (categoriaAtiva) {
      result = result.filter((p) => {
        if (!p.categoria_id) return false;
        const id = typeof p.categoria_id === "string" ? p.categoria_id : p.categoria_id._id;
        return id === categoriaAtiva;
      });
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) =>
        p.nome.toLowerCase().includes(q) ||
        (p.descricao ?? "").toLowerCase().includes(q)
      );
    }
    return result;
  }, [allData, categoriaAtiva, search]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / limit));
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  function selectCategory(id: string) {
    setCategoriaAtiva(id);
    setPage(1);
  }

  function clearFilters() {
    setCategoriaAtiva("");
    setSearchInput("");
    setSearch("");
    setPage(1);
  }

  const hasActiveFilters = !!categoriaAtiva || !!search;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

      {/* Hero */}
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Catálogo
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
          Nossos Produtos
        </h1>
        {!loading && total > 0 && (
          <p className="mt-2 text-sm text-muted-foreground">
            {total} {total === 1 ? "produto disponível" : "produtos disponíveis"}
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <input
              type="search"
              placeholder="Buscar produto..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="h-10 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
            />
          </div>

          {!loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-xs text-primary/80 hover:text-primary transition-colors font-medium"
                >
                  <X className="size-3.5" />
                  Limpar filtros
                </button>
              )}
              {pages > 1 && (
                <>
                  <span className="text-border">|</span>
                  <span className="tabular-nums text-xs">Pág. {page}/{pages}</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Category chips */}
        {categorias.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-1">
              <SlidersHorizontal className="size-3.5" />
              <span className="hidden sm:inline font-medium">Filtrar:</span>
            </div>
            <button
              onClick={() => selectCategory("")}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-150",
                !categoriaAtiva
                  ? "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                  : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-primary"
              )}
            >
              Todas
            </button>
            {categorias.map((cat) => (
              <button
                key={cat._id}
                onClick={() => selectCategory(cat._id)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-150",
                  categoriaAtiva === cat._id
                    ? "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                    : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-primary"
                )}
              >
                {cat.nome}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {loading ? (
          [...Array(8)].map((_, i) => <ProductSkeleton key={i} />)
        ) : paginated.length === 0 ? (
          <EmptyState search={search} categoriaAtiva={categoriaAtiva} onClear={clearFilters} />
        ) : (
          paginated.map((p) => <ProductCard key={p._id} produto={p} />)
        )}
      </div>

      {/* Pagination */}
      {!loading && pages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-all hover:border-primary/30 hover:text-primary disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft className="size-4" />
          </button>

          <div className="flex items-center gap-1">
            {[...Array(pages)].map((_, i) => {
              const n = i + 1;
              const active = n === page;
              const visible = n === 1 || n === pages || (n >= page - 1 && n <= page + 1);
              if (!visible) {
                if (n === page - 2 || n === page + 2)
                  return <span key={i} className="px-1 text-sm text-muted-foreground">…</span>;
                return null;
              }
              return (
                <button
                  key={i}
                  onClick={() => setPage(n)}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium transition-all",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                      : "border border-border text-muted-foreground hover:border-primary/30 hover:text-primary"
                  )}
                >
                  {n}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page >= pages}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-all hover:border-primary/30 hover:text-primary disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
