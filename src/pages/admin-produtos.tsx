import React from "react";
import { useAuth } from "@/state/auth";
import {
  listarProdutos,
  listarCategorias,
  criarProduto,
  atualizarProduto,
  deletarProduto,
  type Produto,
  type Categoria,
} from "@/lib/api";
import {
  Plus, Pencil, Trash2, X, Package, Loader2, ChevronLeft, ChevronRight, ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type FormData = { nome: string; descricao: string; preco: string; categoria_id: string; urlImagem: string };
const EMPTY_FORM: FormData = { nome: "", descricao: "", preco: "", categoria_id: "", urlImagem: "" };

function getCategoryName(cat: Produto["categoria_id"]): string {
  if (!cat || typeof cat === "string") return "—";
  return cat.nome;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{children}</label>;
}

function FieldInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-9 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/15",
        className
      )}
      {...props}
    />
  );
}

export function AdminProdutosPage() {
  const { token } = useAuth();
  const [produtos, setProdutos] = React.useState<Produto[]>([]);
  const [categorias, setCategorias] = React.useState<Categoria[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const limit = 10;

  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Produto | null>(null);
  const [form, setForm] = React.useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = React.useState(false);

  function fetchProdutos() {
    setLoading(true);
    listarProdutos({ page, limit })
      .then((resp) => {
        const list = Array.isArray(resp) ? resp : Array.isArray(resp.data) ? resp.data : [];
        setProdutos(list as Produto[]);
        setTotal(resp.meta?.total ?? list.length);
      })
      .finally(() => setLoading(false));
  }

  React.useEffect(() => { fetchProdutos(); }, [page]);

  React.useEffect(() => {
    listarCategorias({ limit: 100 })
      .then((r) => { const l = Array.isArray(r) ? r : Array.isArray(r.data) ? r.data : []; setCategorias(l); })
      .catch(() => {});
  }, []);

  function openCreate() { setEditing(null); setForm(EMPTY_FORM); setModalOpen(true); }

  function openEdit(p: Produto) {
    setEditing(p);
    const catId = p.categoria_id ? (typeof p.categoria_id === "string" ? p.categoria_id : p.categoria_id._id) : "";
    setForm({ nome: p.nome, descricao: p.descricao ?? "", preco: String(p.preco), categoria_id: catId, urlImagem: p.urlImagem ?? "" });
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !form.nome.trim() || !form.preco.trim()) return;
    setSaving(true);
    try {
      const payload = { nome: form.nome.trim(), descricao: form.descricao.trim() || undefined, preco: Number(form.preco), categoria_id: form.categoria_id || undefined, urlImagem: form.urlImagem.trim() || undefined };
      if (editing) { await atualizarProduto(editing._id, payload, token); toast.success("Produto atualizado"); }
      else { await criarProduto(payload, token); toast.success("Produto criado"); }
      setModalOpen(false);
      fetchProdutos();
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!token || !window.confirm("Excluir este produto?")) return;
    await deletarProduto(id, token);
    toast.success("Produto excluído");
    fetchProdutos();
  }

  const pages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-6 animate-in-up">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Catálogo</p>
          <h1 className="mt-0.5 text-2xl font-bold tracking-tight">Produtos</h1>
          {!loading && (
            <p className="mt-1 text-sm text-muted-foreground">
              {total} {total === 1 ? "produto cadastrado" : "produtos cadastrados"}
            </p>
          )}
        </div>
        <button
          onClick={openCreate}
          className="group inline-flex h-9 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/25 transition-all hover:opacity-90 hover:shadow-md hover:shadow-primary/30 active:scale-[0.98] shrink-0"
        >
          <Plus className="size-4" />
          Novo produto
        </button>
      </div>

      {/* Table card */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/70">
                <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Produto</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Categoria</th>
                <th className="px-5 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">Preço</th>
                <th className="w-24 px-5 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-5 py-4"><div className="h-4 w-44 animate-pulse rounded-full bg-muted" /></td>
                    <td className="px-5 py-4 hidden sm:table-cell"><div className="h-5 w-20 animate-pulse rounded-full bg-muted" /></td>
                    <td className="px-5 py-4 text-right"><div className="ml-auto h-4 w-20 animate-pulse rounded-full bg-muted" /></td>
                    <td className="px-5 py-4"><div className="ml-auto h-4 w-14 animate-pulse rounded-full bg-muted" /></td>
                  </tr>
                ))
              ) : produtos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                        <Package className="size-6 text-primary" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Nenhum produto cadastrado</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">Comece adicionando o primeiro produto.</p>
                      </div>
                      <button
                        onClick={openCreate}
                        className="mt-1 inline-flex h-8 items-center gap-1.5 rounded-xl border border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
                      >
                        <Plus className="size-3.5" />
                        Adicionar produto
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                produtos.map((p) => (
                  <tr key={p._id} className="group transition-colors hover:bg-muted/30">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 shrink-0 overflow-hidden rounded-xl" style={!p.urlImagem ? { background: "oklch(0.47 0.22 270)" } : {}}>
                          {p.urlImagem ? (
                            <img src={p.urlImagem} alt={p.nome} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Package className="size-3.5 text-white/60" strokeWidth={1.5} />
                            </div>
                          )}
                        </div>
                        <span className="font-medium">{p.nome}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span className="inline-flex items-center rounded-full bg-primary/8 px-2.5 py-1 text-[11px] font-semibold text-primary">
                        {getCategoryName(p.categoria_id)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="font-semibold tabular-nums">
                        R$ {Number(p.preco).toFixed(2).replace(".", ",")}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={() => openEdit(p)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
                        >
                          <Pencil className="size-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && pages > 1 && (
          <div className="flex items-center justify-between border-t border-border/50 px-5 py-3">
            <p className="text-xs text-muted-foreground tabular-nums">
              Página {page} de {pages} · {total} produtos
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:border-primary/30 hover:text-primary disabled:opacity-40"
              >
                <ChevronLeft className="size-3.5" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page >= pages}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:border-primary/30 hover:text-primary disabled:opacity-40"
              >
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <>
          <div className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="w-full max-w-lg rounded-2xl border border-border bg-background shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
                <div>
                  <h3 className="text-base font-bold">{editing ? "Editar produto" : "Novo produto"}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {editing ? "Atualize os dados do produto" : "Preencha as informações do novo produto"}
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
                  <FieldLabel>Nome do produto</FieldLabel>
                  <FieldInput
                    placeholder="Ex: Tênis Air Max 90"
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <FieldLabel>Descrição <span className="normal-case font-normal text-muted-foreground">(opcional)</span></FieldLabel>
                  <textarea
                    rows={3}
                    placeholder="Descreva o produto..."
                    value={form.descricao}
                    onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/15 resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <FieldLabel>URL da imagem <span className="normal-case font-normal text-muted-foreground">(opcional)</span></FieldLabel>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
                    <FieldInput
                      type="url"
                      placeholder="https://exemplo.com/imagem.jpg"
                      value={form.urlImagem}
                      onChange={(e) => setForm({ ...form, urlImagem: e.target.value })}
                      className="pl-8"
                    />
                  </div>
                  {form.urlImagem && (
                    <div className="mt-1.5 overflow-hidden rounded-xl border border-border bg-muted/40">
                      <img
                        src={form.urlImagem}
                        alt="Preview"
                        className="h-28 w-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <FieldLabel>Preço (R$)</FieldLabel>
                    <FieldInput
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0,00"
                      value={form.preco}
                      onChange={(e) => setForm({ ...form, preco: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <FieldLabel>Categoria</FieldLabel>
                    <select
                      value={form.categoria_id}
                      onChange={(e) => setForm({ ...form, categoria_id: e.target.value })}
                      className="h-9 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
                    >
                      <option value="">Sem categoria</option>
                      {categorias.map((c) => (
                        <option key={c._id} value={c._id}>{c.nome}</option>
                      ))}
                    </select>
                  </div>
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
                    {editing ? "Salvar alterações" : "Criar produto"}
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
