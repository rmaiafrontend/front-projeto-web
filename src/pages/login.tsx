import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "@/lib/api";
import { useAuth } from "@/state/auth";
import { toast } from "sonner";
import { ShoppingBag, ArrowRight, Eye, EyeOff } from "lucide-react";

export function LoginPage() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await login({ email, senha });
      auth.login(resp);
      toast.success("Acesso autorizado");
      navigate("/admin/produtos");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-dvh">

      {/* ── Left panel ──────────────────────────────── */}
      <div className="relative hidden w-[52%] flex-col overflow-hidden lg:flex"
        style={{ background: "oklch(0.47 0.22 270)" }}>

        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px",
          }}
        />

        {/* Glow orbs */}
        <div className="absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full opacity-30"
          style={{ background: "oklch(0.75 0.18 290)", filter: "blur(80px)" }} />
        <div className="absolute -bottom-20 -right-20 h-[360px] w-[360px] rounded-full opacity-20"
          style={{ background: "oklch(0.60 0.24 250)", filter: "blur(70px)" }} />

        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />

        {/* Content */}
        <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">
              <ShoppingBag className="size-4 text-white" strokeWidth={2.2} />
            </div>
            <span className="text-[15px] font-bold text-white tracking-tight">Vitrine</span>
          </div>

          {/* Hero text */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/15">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                <span className="text-[11px] font-semibold uppercase tracking-widest text-white/70">
                  Painel Administrativo
                </span>
              </div>
              <h2 className="text-3xl font-semibold leading-tight tracking-tight text-white xl:text-[2.5rem]">
                Gerencie seu<br />
                <span className="text-white/50">negócio com clareza.</span>
              </h2>
            </div>

            <p className="max-w-xs text-sm leading-relaxed text-white/45">
              Produtos, categorias, pedidos e perfil — tudo em um único painel, rápido e intuitivo.
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-6 pt-2">
              {[
                { value: "100%", label: "Controle" },
                { value: "1 lugar", label: "Tudo aqui" },
                { value: "Simples", label: "Interface" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-base font-bold text-white">{value}</p>
                  <p className="text-[11px] text-white/40">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <p className="text-[11px] text-white/25">
            Acesso exclusivo para administradores autorizados.
          </p>
        </div>
      </div>

      {/* ── Right form panel ────────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-16">
        <div className="w-full max-w-[360px] animate-in-up space-y-8">

          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <ShoppingBag className="size-4" strokeWidth={2.2} />
            </div>
            <span className="text-sm font-bold">Vitrine</span>
          </div>

          {/* Heading */}
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight">Bem-vindo de volta</h1>
            <p className="text-sm text-muted-foreground">
              Entre com suas credenciais para acessar o painel.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={onSubmit}>
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="senha" className="text-sm font-medium text-foreground">
                  Senha
                </label>
                <button
                  type="button"
                  className="text-xs text-muted-foreground transition-colors hover:text-primary"
                >
                  Esqueci a senha
                </button>
              </div>
              <div className="relative">
                <input
                  id="senha"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  className="h-11 w-full rounded-xl border border-input bg-background px-3.5 pr-11 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:shadow-primary/30 disabled:pointer-events-none disabled:opacity-60 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                  Verificando...
                </>
              ) : (
                <>
                  Entrar no painel
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">ou</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-muted-foreground">
            Não tem uma conta?{" "}
            <Link
              to="/register"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
