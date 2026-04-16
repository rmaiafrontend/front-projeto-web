import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/components/app-layout";
import { PublicLayout } from "@/components/public-layout";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import { ProdutosPage } from "@/pages/produtos";
import { ProdutoDetalhePage } from "@/pages/produto-detalhe";
import { PedidosPage } from "@/pages/pedidos";
import { AdminProdutosPage } from "@/pages/admin-produtos";
import { AdminCategoriasPage } from "@/pages/admin-categorias";
import { AdminPerfilPage } from "@/pages/admin-perfil";
import { ProtectedRoute } from "@/routes/protected-route";

export default function App() {
  return (
    <Routes>
      {/* Auth pages — full screen */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Public catalog — no sidebar */}
      <Route element={<PublicLayout />}>
        <Route index element={<Navigate to="/produtos" replace />} />
        <Route path="/produtos" element={<ProdutosPage />} />
        <Route path="/produtos/:id" element={<ProdutoDetalhePage />} />
      </Route>

      {/* Admin panel — with sidebar, protected */}
      <Route element={<AppLayout />}>
        <Route
          path="/admin/produtos"
          element={
            <ProtectedRoute>
              <AdminProdutosPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categorias"
          element={
            <ProtectedRoute>
              <AdminCategoriasPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/perfil"
          element={
            <ProtectedRoute>
              <AdminPerfilPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pedidos"
          element={
            <ProtectedRoute>
              <PedidosPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/produtos" replace />} />
    </Routes>
  );
}
