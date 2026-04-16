import React from "react";
import { obterPerfil } from "@/lib/api";
import { useAuth } from "@/state/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Camera,
  Edit3,
  ShieldCheck,
  Package,
  MapPin,
} from "lucide-react";

type Perfil = Record<string, unknown>;

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-border/60 last:border-0">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-foreground truncate">{value}</p>
      </div>
      <button className="shrink-0 p-1 text-muted-foreground transition-colors hover:text-foreground">
        <Edit3 className="size-3.5" />
      </button>
    </div>
  );
}

const QUICK_LINKS = [
  { icon: Package, label: "Meus pedidos", desc: "Acompanhe suas compras" },
  { icon: MapPin, label: "Endereços", desc: "Gerencie seus endereços" },
  { icon: ShieldCheck, label: "Segurança", desc: "Senha e autenticação" },
];

export function PerfilPage() {
  const { token, user } = useAuth();
  const [perfil, setPerfil] = React.useState<Perfil | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!token) return;
    let alive = true;
    setLoading(true);
    obterPerfil(token)
      .then((data) => {
        if (!alive) return;
        setPerfil(data as Perfil | null);
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [token]);

  const initials = user?.nome
    ? user.nome.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? "?";

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-10">
        <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Conta
        </p>
        <h1 className="text-3xl font-bold tracking-tight">Meu Perfil</h1>
        <div className="mt-6 h-px bg-gradient-to-r from-border via-border/30 to-transparent" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Avatar card */}
        <div className="lg:col-span-1">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
            {/* Cover */}
            <div className="h-20 bg-gradient-to-br from-muted to-muted/60" />

            {/* Avatar + info */}
            <div className="relative px-5 pb-5">
              <div className="relative -mt-10 inline-flex">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-card bg-foreground text-background text-2xl font-bold shadow-sm">
                  {initials}
                </div>
                <button className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-background ring-2 ring-border shadow-sm transition-colors hover:bg-muted">
                  <Camera className="size-3.5 text-muted-foreground" />
                </button>
              </div>

              <div className="mt-3 space-y-1">
                {user?.nome && (
                  <h2 className="text-base font-semibold">{user.nome}</h2>
                )}
                <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                <div className="pt-1">
                  <Badge variant="success" className="text-xs">
                    <ShieldCheck className="size-3" />
                    Conta verificada
                  </Badge>
                </div>
              </div>

              <div className="mt-4">
                <Button variant="outline" size="sm" className="w-full gap-1.5">
                  <Edit3 className="size-3.5" />
                  Editar perfil
                </Button>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-card">
            {QUICK_LINKS.map(({ icon: Icon, label, desc }) => (
              <button
                key={label}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50 border-b border-border/50 last:border-0"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Icon className="size-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account info */}
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
            <div className="border-b border-border px-5 py-4">
              <h3 className="text-sm font-semibold">Informações da conta</h3>
              <p className="text-xs text-muted-foreground">Dados básicos do seu perfil</p>
            </div>
            <div className="px-5">
              <InfoRow
                icon={User}
                label="Nome"
                value={user?.nome ?? "Não informado"}
              />
              <InfoRow
                icon={Mail}
                label="Email"
                value={user?.email ?? "Não informado"}
              />
            </div>
          </div>

          {/* Profile details */}
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
            <div className="border-b border-border px-5 py-4">
              <h3 className="text-sm font-semibold">Dados pessoais</h3>
              <p className="text-xs text-muted-foreground">Informações adicionais do seu perfil</p>
            </div>

            {loading ? (
              <div className="space-y-4 p-5">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                      <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                    </div>
                  </div>
                ))}
              </div>
            ) : !perfil ? (
              <div className="flex flex-col items-center py-10 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <User className="size-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">Perfil incompleto</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Complete seu perfil para uma melhor experiência.
                </p>
                <Button variant="outline" size="sm" className="mt-4">
                  Completar perfil
                </Button>
              </div>
            ) : (
              <div className="px-5">
                <InfoRow
                  icon={CreditCard}
                  label="CPF"
                  value={String(perfil.cpf ?? "Não informado")}
                />
                <InfoRow
                  icon={Phone}
                  label="Telefone"
                  value={String(perfil.telefone ?? "Não informado")}
                />
                {perfil.fotoUrl != null && String(perfil.fotoUrl) !== "-" && (
                  <InfoRow
                    icon={Camera}
                    label="Foto de perfil"
                    value={String(perfil.fotoUrl)}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
