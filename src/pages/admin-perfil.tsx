import React from "react";
import { useAuth } from "@/state/auth";
import { obterPerfil, criarPerfil, atualizarPerfil } from "@/lib/api";
import { User, Mail, Phone, CreditCard, ShieldCheck, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type PerfilData = Record<string, unknown>;

function Field({
  label,
  icon: Icon,
  children,
  hint,
}: {
  label: string;
  icon: React.ElementType;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function StyledInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-9 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/15 disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
}

export function AdminPerfilPage() {
  const { token, user } = useAuth();
  const [perfilExiste, setPerfilExiste] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [nome, setNome] = React.useState("");
  const [cpf, setCpf] = React.useState("");
  const [telefone, setTelefone] = React.useState("");

  React.useEffect(() => {
    if (!token) return;
    let alive = true;
    setLoading(true);
    obterPerfil(token)
      .then((data) => {
        if (!alive) return;
        if (data) {
          setPerfilExiste(true);
          setNome(String(data.nome ?? user?.nome ?? ""));
          setCpf(String(data.cpf ?? ""));
          setTelefone(String(data.telefone ?? ""));
        } else {
          setPerfilExiste(false);
          setNome(user?.nome ?? "");
        }
      })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    try {
      const payload: Record<string, string> = {};
      if (nome.trim()) payload.nome = nome.trim();
      if (cpf.trim()) payload.cpf = cpf.trim();
      if (telefone.trim()) payload.telefone = telefone.trim();
      if (perfilExiste) {
        await atualizarPerfil(payload, token);
        toast.success("Perfil atualizado");
      } else {
        await criarPerfil(payload, token);
        setPerfilExiste(true);
        toast.success("Perfil criado com sucesso");
      }
    } finally {
      setSaving(false);
    }
  }

  const initials = nome
    ? nome.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? "?";

  if (loading) {
    return (
      <div className="mx-auto max-w-xl space-y-6">
        <div className="h-6 w-40 animate-pulse rounded-full bg-muted" />
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-3 w-20 animate-pulse rounded-full bg-muted" />
              <div className="h-9 w-full animate-pulse rounded-xl bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 animate-in-up">
      {/* Page header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-primary">Conta</p>
        <h1 className="mt-0.5 text-2xl font-bold tracking-tight">Meu Perfil</h1>
        <p className="mt-1 text-sm text-muted-foreground">Atualize suas informações pessoais</p>
      </div>

      {/* Avatar card */}
      <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
        <div className="relative">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-md"
            style={{ background: "oklch(0.47 0.22 270)" }}
          >
            {initials}
          </div>
          {/* Glow */}
          <div className="absolute inset-0 rounded-2xl opacity-30 blur-lg"
            style={{ background: "oklch(0.47 0.22 270)" }} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{nome || user?.email}</p>
          <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 ring-1 ring-emerald-500/20">
            <ShieldCheck className="size-3 text-emerald-600" />
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">Conta verificada</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Account info */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="border-b border-border/60 px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Informações da conta</p>
          </div>
          <div className="space-y-4 p-5">
            <Field label="Nome" icon={User}>
              <StyledInput
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome completo"
              />
            </Field>
            <Field label="Email" icon={Mail} hint="O email não pode ser alterado">
              <StyledInput value={user?.email ?? ""} disabled />
            </Field>
          </div>
        </div>

        {/* Personal data */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="border-b border-border/60 px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Dados pessoais</p>
          </div>
          <div className="space-y-4 p-5">
            <Field label="CPF" icon={CreditCard}>
              <StyledInput
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="000.000.000-00"
              />
            </Field>
            <Field label="Telefone" icon={Phone}>
              <StyledInput
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(00) 00000-0000"
              />
            </Field>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/25 transition-all hover:opacity-90 hover:shadow-md hover:shadow-primary/30 disabled:opacity-60 active:scale-[0.98]"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Salvar alterações
          </button>
        </div>
      </form>
    </div>
  );
}
