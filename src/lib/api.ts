import { toast } from "sonner";

export type ApiError = {
  error?: { code?: string; message?: string; details?: unknown };
  message?: string;
};

export type User = { _id: string; nome?: string; email: string };

export type LoginResponse = { user: User; token: string };

export type Categoria = {
  _id: string;
  nome: string;
};

export type Produto = {
  _id: string;
  nome: string;
  descricao?: string;
  preco: number;
  urlImagem?: string;
  categoria_id?: Categoria | string | null;
  tags?: Array<{ _id: string; nome: string }>;
};

export type ProdutosListResponse = {
  data: Produto[];
  meta: { page: number; limit: number; total: number };
};

export type CategoriasListResponse = {
  data: Categoria[];
  meta: { page: number; limit: number; total: number };
};

const DEFAULT_BASE_URL = "http://localhost:3000/api";

export function getApiBaseUrl() {
  const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
  return env?.VITE_API_URL || DEFAULT_BASE_URL;
}

export async function apiFetch<T>(
  path: string,
  opts: RequestInit & { token?: string | null; silent404?: boolean } = {}
): Promise<T> {
  const url = `${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(opts.headers);
  headers.set("Content-Type", "application/json");
  if (opts.token) headers.set("Authorization", `Bearer ${opts.token}`);

  const res = await fetch(url, { ...opts, headers });
  const text = await res.text();

  const body = text ? (JSON.parse(text) as unknown) : undefined;
  if (res.ok) return body as T;

  // 404 silencioso — recurso ainda não existe (ex: perfil não criado)
  if (res.status === 404 && opts.silent404) return null as T;

  const err = body as ApiError | undefined;
  const message =
    err?.error?.message ||
    err?.message ||
    `Erro na API (${res.status})`;

  toast.error(message);
  throw new Error(message);
}

export function register(payload: { nome: string; email: string; senha: string }) {
  return apiFetch<{ message: string }>("/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login(payload: { email: string; senha: string }) {
  return apiFetch<LoginResponse>("/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function listarProdutos(params?: { page?: number; limit?: number; categoria?: string }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.categoria) qs.set("categoria", params.categoria);
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return apiFetch<ProdutosListResponse>(`/produtos${suffix}`, { method: "GET" });
}

export function obterProduto(id: string) {
  return apiFetch<Produto>(`/produtos/${id}`, { method: "GET" });
}

export function listarPedidos(token: string) {
  return apiFetch<unknown[]>("/pedidos", { method: "GET", token });
}

export function obterPerfil(token: string) {
  return apiFetch<Record<string, unknown> | null>("/perfis/me", { method: "GET", token, silent404: true });
}

// --- Categorias ---

export function listarCategorias(params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return apiFetch<CategoriasListResponse>(`/categorias${suffix}`, { method: "GET" });
}

export function criarCategoria(payload: { nome: string }, token: string) {
  return apiFetch<Categoria>("/categorias", {
    method: "POST",
    body: JSON.stringify(payload),
    token,
  });
}

export function atualizarCategoria(id: string, payload: { nome: string }, token: string) {
  return apiFetch<Categoria>(`/categorias/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    token,
  });
}

export function deletarCategoria(id: string, token: string) {
  return apiFetch<{ message: string }>(`/categorias/${id}`, {
    method: "DELETE",
    token,
  });
}

// --- Produtos (Admin) ---

export function criarProduto(
  payload: { nome: string; descricao?: string; preco: number; urlImagem?: string; categoria_id?: string },
  token: string
) {
  return apiFetch<Produto>("/produtos", {
    method: "POST",
    body: JSON.stringify(payload),
    token,
  });
}

export function atualizarProduto(
  id: string,
  payload: { nome?: string; descricao?: string; preco?: number; urlImagem?: string; categoria_id?: string },
  token: string
) {
  return apiFetch<Produto>(`/produtos/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    token,
  });
}

export function deletarProduto(id: string, token: string) {
  return apiFetch<{ message: string }>(`/produtos/${id}`, {
    method: "DELETE",
    token,
  });
}

// --- Perfil (Admin) ---

export function criarPerfil(
  payload: { nome?: string; cpf?: string; telefone?: string },
  token: string
) {
  return apiFetch<Record<string, unknown>>("/perfis/me", {
    method: "POST",
    body: JSON.stringify(payload),
    token,
  });
}

export function atualizarPerfil(
  payload: { nome?: string; cpf?: string; telefone?: string },
  token: string
) {
  return apiFetch<Record<string, unknown>>("/perfis/me", {
    method: "PUT",
    body: JSON.stringify(payload),
    token,
  });
}

