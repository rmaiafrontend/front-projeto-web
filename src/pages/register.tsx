import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { register } from "@/lib/api";
import { toast } from "sonner";
import { Package, ArrowRight, Eye, EyeOff, Shield, AlertTriangle } from "lucide-react";

export function RegisterPage() {
  const navigate = useNavigate();

  const [nome, setNome] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await register({ nome, email, senha });
      toast.success("Conta criada. Faça login para acessar o painel.");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-dvh">
      {/* Left panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-foreground p-10 text-background lg:flex xl:p-14">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -bottom-40 -right-20 h-[400px] w-[400px] rounded-full bg-background/4 blur-3xl" />
          <div className="absolute top-20 left-10 h-80 w-80 rounded-full bg-background/4 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgb(255,255,255) 1px, transparent 1px), linear-gradient(90deg, rgb(255,255,255) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/10 ring-1 ring-background/20">
            <Package className="size-5 text-background" strokeWidth={2} />
          </div>
          <div>
            <p className="text-base font-bold tracking-tight leading-none">E-commerce</p>
            <div className="mt-1 flex items-center gap-1.5">
              <Shield className="size-3 text-background/50" />
              <span className="text-[11px] text-background/50 uppercase tracking-wider font-medium">
                Área Restrita
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative space-y-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-light leading-snug tracking-tight xl:text-4xl">
              Crie sua conta de administrador.
            </h2>
            <p className="text-background/50 text-sm leading-relaxed">
              Após criar a conta, você terá acesso completo ao painel de gestão do e-commerce.
            </p>
          </div>

          {/* Warning notice */}
          <div className="flex items-start gap-3 rounded-xl border border-background/15 bg-background/8 p-4">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-400" />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-background/80">Atenção</p>
              <p className="text-[11px] text-background/50 leading-relaxed">
                Este cadastro cria uma conta com acesso administrativo. Certifique-se de usar credenciais seguras e manter sua senha protegida.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="relative flex items-center gap-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`h-0.5 rounded-full bg-background/20 ${i === 1 ? "w-10 !bg-background/60" : "w-4"}`}
            />
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 flex-col items-center justify-center bg-muted/30 px-6 py-12 lg:px-10 xl:px-16">
        <div className="w-full max-w-sm space-y-8 animate-in-up">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground text-background">
              <Package className="size-4" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-bold leading-none">E-commerce</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Painel Administrativo</p>
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Criar conta admin</h1>
            <p className="text-sm text-muted-foreground">
              Preencha os dados para criar seu acesso.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-card space-y-5">
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="space-y-1.5">
                <Label htmlFor="nome" className="text-sm font-medium">
                  Nome completo
                </Label>
                <Input
                  id="nome"
                  placeholder="Seu nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="h-11 text-base"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 text-base"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="senha" className="text-sm font-medium">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="senha"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Mínimo 6 caracteres"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="h-11 pr-11 text-base"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {senha.length > 0 && (
                  <div className="flex gap-1 pt-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-0.5 flex-1 rounded-full transition-colors ${
                          senha.length >= (i + 1) * 3
                            ? senha.length >= 12
                              ? "bg-emerald-500"
                              : senha.length >= 8
                                ? "bg-amber-500"
                                : "bg-red-400"
                            : "bg-muted-foreground/20"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full gap-2 text-sm font-semibold"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Criando conta...
                  </>
                ) : (
                  <>
                    Criar conta
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Já tem acesso?{" "}
              <Link
                className="font-medium text-foreground underline underline-offset-4 hover:no-underline"
                to="/login"
              >
                Entrar no painel
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Acesso exclusivo para administradores autorizados.
          </p>
        </div>
      </div>
    </div>
  );
}
