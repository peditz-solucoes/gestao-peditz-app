import { Route, Routes } from "react-router-dom";
import { LoginPage } from "../pages/Login";
import { Dashboard } from "../pages/Dashboard";
import { Commands } from "../pages/Commands";
import { Reports } from "../pages/Reports";
import { Stocks } from "../pages/Stocks";
import { Tables } from "../pages/Tables";
import { Apps } from "../pages/Apps";
import { Products } from "../pages/Products/Products";
import { Integrations } from "../pages/Integrations";
import { AddSidebar } from "../components/AddSidebar";
import { Command } from "../pages/Command";
import { CategoryProducts } from "../pages/CategoryProducts";
import { PrivateRoute } from "./PrivateRoute";
import { LoginRoute } from "./LoginRoute";
import { Table } from "../pages/Table/Table";
import { CashierPage } from "../pages/Cashier/Cashier";
import { EmployersPage } from "../pages/Employers/Employers";
import { EmployerRegisterPage } from "../pages/EmployerRegister/EmployerRegister";
import { EmployerViewPage } from "../pages/EmployerView/EmployerView";
import { Terminal } from "../pages/Terminal";
import { TerminalProvider } from "../hooks/useTerminal";

export function Navigation() {
  return (
    <Routes>
      {/* Rota raiz / */}
      <Route path="/" element={<PrivateRoute />}>
        <Route
          path="/"
          element={
            <AddSidebar>
              <Dashboard />
            </AddSidebar>
          }
        />
      </Route>

      {/* Rota de login */}
      <Route path="/login/" element={<LoginRoute />}>
        <Route path="/login/" element={<LoginPage />} />
      </Route>

      {/* Rota de caixa */}
      <Route path="/caixa/" element={<PrivateRoute />}>
        <Route
          path="/caixa/"
          element={
            <AddSidebar titleHeader="Caixa">
              <CashierPage />
            </AddSidebar>
          }
        />
      </Route>

      {/* Rota de dashboard */}
      <Route path="/dashboard/" element={<PrivateRoute />}>
        <Route
          path="/dashboard/"
          element={
            <AddSidebar titleHeader="Dashboard">
              <Dashboard />
            </AddSidebar>
          }
        />
      </Route>

      {/* Rota de comandas */}
      <Route path="/comandas/" element={<PrivateRoute />}>
        <Route
          path="/comandas/"
          element={
            <AddSidebar titleHeader="Comandas">
              <Commands />
            </AddSidebar>
          }
        />
      </Route>

      {/* Rota de comanda */}
      <Route path="/comandas/:id/" element={<PrivateRoute />}>
        <Route
          path="/comandas/:id/"
          element={
            <AddSidebar titleHeader="Comanda">
              <Command />
            </AddSidebar>
          }
        />
      </Route>

      {/* Rota de relatórios */}
      <Route path="/relatorios/" element={<PrivateRoute />}>
        <Route
          path="/relatorios/"
          element={
            <AddSidebar titleHeader="Relatórios">
              <Reports />
            </AddSidebar>
          }
        />
      </Route>

      {/* Rota de estoque */}
      <Route path="/estoque/" element={<PrivateRoute />}>
        <Route
          path="/estoque/"
          element={
            <AddSidebar titleHeader="Estoque">
              <Stocks />
            </AddSidebar>
          }
        />
      </Route>

      {/* Rota de mesas */}
      <Route path="/mesas/" element={<PrivateRoute />}>
        <Route
          path="/mesas/"
          element={
            <AddSidebar titleHeader="Gerenciamento de mesas">
              <Tables />
            </AddSidebar>
          }
        />
      </Route>

      <Route path="/mesas/:id/" element={<PrivateRoute />}>
        <Route
          path="/mesas/:id/"
          element={
            <AddSidebar titleHeader="Informações da mesa">
              <Table />
            </AddSidebar>
          }
        />
      </Route>

      {/* Rota de aplicativos */}
      <Route path="/aplicativos/" element={<PrivateRoute />}>
        <Route
          path="/aplicativos/"
          element={
            <AddSidebar titleHeader="Aplicativos">
              <Apps />
            </AddSidebar>
          }
        />
      </Route>

      {/* Rota de produtos */}
      <Route path="/produtos/" element={<PrivateRoute />}>
        <Route
          path="/produtos/"
          element={
            <AddSidebar titleHeader="Produtos">
              <Products />
            </AddSidebar>
          }
        />
      </Route>

      {/* Rota de categorias dos produtos */}
      <Route path="/produtos/categorias/" element={<PrivateRoute />}>
        <Route
          path="/produtos/categorias/"
          element={
            <AddSidebar titleHeader="Categorias dos produtos">
              <CategoryProducts />
            </AddSidebar>
          }
        />
      </Route>

      {/* Rota de integrações */}
      <Route path="/integracoes/" element={<PrivateRoute />}>
        <Route
          path="/integracoes/"
          element={
            <AddSidebar titleHeader="Integrações">
              <Integrations />
            </AddSidebar>
          }
        />
      </Route>

      <Route path="/colaboradores/" element={<PrivateRoute />}>
        <Route
          path="/colaboradores/"
          element={
            <AddSidebar titleHeader="Colaboradores">
              <EmployersPage />
            </AddSidebar>
          }
        />
      </Route>

      <Route path="/colaboradores/registro/" element={<PrivateRoute />}>
        <Route
          path="/colaboradores/registro/"
          element={
            <AddSidebar titleHeader="Adicionar Colaborador">
              <EmployerRegisterPage />
            </AddSidebar>
          }
        />
      </Route>

      <Route path="/colaboradores/:id/" element={<PrivateRoute />}>
        <Route
          path="/colaboradores/:id/"
          element={
            <AddSidebar titleHeader="Editar Colaborador">
              <EmployerViewPage />
            </AddSidebar>
          }
        />
      </Route>
      <Route path="/terminal/" element={<PrivateRoute />}>
        <Route
          path="/terminal/"
          element={
            <TerminalProvider>
              <Terminal />
            </TerminalProvider>
          }
        />
      </Route>
    </Routes>
  );
}
