import React from "react";
import { useAuth } from "@/state/auth";
import { listarCategorias, criarCategoria, atualizarCategoria, deletarCategoria, type Categoria } from "@/lib/api";
import { Plus, Pencil, Trash2, X, Tag, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function AdminCategoriasPage() {
  const { token } = useAuth();
  const [categorias, setCategorias] = React.useState<Categoria[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Categoria | null>(null);
  const [nome, setNome] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  function fetchCategorias() {
    setLoading(true);
    listarCategorias({ limit: 100 })
      .then((r) => { const l = Array.isArray(r) ? r : Array.isArray(r.data) ? r.data : []; setCategorias(l); })
      .finally(() => setLoading(false));
  }

  React.useEffect(() => { fetchCategorias(); }, []);

  function openCreate() { setEditing(null); setNome(""); setModalOpen(true); }
  function openEdit(cat: Categoria) { setEditing(cat); setNome(cat.nome); setModalOpen(true); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !nome.trim()) return;
    setSaving(true);
    try {
      if (editing) { await atualizarCategoria(editing._id, { nome: nome.trim() }, token); toast.success("Categoria atualizada"); }
      else { await criarCategoria({ nome: nome.trim() }, token); toast.success("Categoria criada"); }
      setModalOpen(false);
      fetchCategorias();
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!token || !window.confirm("Excluir esta categoria?")) return;
    await deletarCategoria(id, token);
    toast.success("Categoria excluída");
    fetchCategorias();
  }

  return (
    <div className="space-y-6 animate-in-up">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Catálogo</p>
          <h1 className="mt-0.5 text-2xl font-bold tracking-tight">Categorias</h1>
          {!loading && (
            <p className="mt-1 text-sm text-muted-foreground">
              {categorias.length} {categorias.length === 1 ? "categoria cadastrada" : "categorias cadastradas"}
            </p>
          )}
        </div>
        <button
          onClick={openCreate}
          className="inline-flex h-9 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/25 transition-all hover:opacity-90 hover:shadow-md hover:shadow-primary/30 active:scale-[0.98] shrink-0"
        >
          <Plus className="size-4" />
          Nova categoria
        </button>
      </div>

      {/* Cards grid */}
      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
              <div className="h-10 w-10 animate-pulse rounded-xl bg-muted" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-32 animate-pulse rounded-full bg-muted" />
                <div className="h-2.5 w-16 animate-pulse rounded-full bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : categorias.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Tag className="size-7 text-primary" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-semibold">Nenhuma categoria cadastrada</p>
          <p className="mt-1 text-xs text-muted-foreground">Crie categorias para organizar o catálogo.</p>
          <button
            onClick={openCreate}
            className="mt-4 inline-flex h-8 items-center gap-1.5 rounded-xl border border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
          >
            <Plus className="size-3.5" />
            Criar categoria
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categorias.map((cat, i) => (
            <div
              key={cat._id}
              className="group flex items-center gap-3.5 rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/20 hover:shadow-card"
            >
              {/* Icon */}
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white/70"
                style={{
                  background: `oklch(${0.47 + (i % 3) * 0.04} ${0.20 + (i % 2) * 0.04} ${265 + (i % 4) * 8})`,
                }}
              >
                <Tag className="size-4" strokeWidth={1.8} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{cat.nome}</p>
                <p className="text-[11px] text-muted-foreground">Categoria</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => openEdit(cat)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
                >
                  <Pencil className="size-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <>
          <div className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="w-full max-w-sm rounded-2xl border border-border bg-background shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
                <div>
                  <h3 className="text-base font-bold">{editing ? "Editar categoria" : "Nova categoria"}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {editing ? "Altere o nome da categoria" : "Defina um nome para a categoria"}
                  </p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 p-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Nome da categoria
                  </label>
                  <input
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Eletrônicos"
                    required
                    autoFocus
                    className="h-9 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="h-9 rounded-xl border border-border px-4 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/25 transition-all hover:opacity-90 disabled:opacity-60"
                  >
                    {saving && <Loader2 className="size-3.5 animate-spin" />}
                    {editing ? "Salvar" : "Criar categoria"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
