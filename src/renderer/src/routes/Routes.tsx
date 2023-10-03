import { Route, Routes } from 'react-router-dom'
import { LoginPage } from '../pages/Login'
import { Dashboard } from '../pages/Dashboard'
import { Commands } from '../pages/Commands'
import { Stocks } from '../pages/Stocks'
import { Tables } from '../pages/Tables'
import { Apps } from '../pages/Apps'
import { Products } from '../pages/Products/Products'
import { Integrations } from '../pages/Integrations'
import { AddSidebar } from '../components/AddSidebar'
import { Command } from '../pages/Command'
import { CategoryProducts } from '../pages/CategoryProducts'
import { PrivateRoute } from './PrivateRoute'
import { LoginRoute } from './LoginRoute'
import { Table } from '../pages/Table/Table'
import { CashierPage } from '../pages/Cashier/Cashier'
import { EmployersPage } from '../pages/Employers/Employers'
import { EmployerRegisterPage } from '../pages/EmployerRegister/EmployerRegister'
import { EmployerViewPage } from '../pages/EmployerView/EmployerView'
import { Terminal } from '../pages/Terminal'
import { TerminalProvider } from '../hooks/useTerminal'
import { BillClosedPage } from '@renderer/pages/BillCLosed'
import { PastCashiers } from '@renderer/pages/PastCashiers'
import { CashierDetail } from '@renderer/pages/CashierDetail'
// import { Takeout } from '@renderer/pages/Takeout'
import { OrdersManager } from '@renderer/pages/OrdersManager'
import { FinancialStats } from '@renderer/pages/FinancialStats'
// import { TakeoutPayment } from '@renderer/pages/TakeoutPayment/TakeoutPayment'
import { Complements } from '@renderer/pages/Complements'

export function Navigation(): JSX.Element {
  return (
    <Routes>
      {/* Rota de comandas fechadas */}
      <Route path="/comandas-fechadas/" element={<PrivateRoute />}>
        <Route
          path="/comandas-fechadas/"
          element={
            <AddSidebar titleHeader="Comandas fechadas">
              <BillClosedPage />
            </AddSidebar>
          }
        />
      </Route>

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
      <Route path="/complementos/" element={<PrivateRoute />}>
        <Route
          path="/complementos/"
          element={
            <AddSidebar titleHeader="Complementos">
              <Complements />
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

      {/*Pedidos de balcão */}
      {/* <Route path="/pedidos-balcao/" element={<PrivateRoute />}>
        <Route
          path="/pedidos-balcao/"
          element={
            <AddSidebar>
              <Takeout />
            </AddSidebar>
          }
        />
      </Route> */}

      {/*Pagamentos Pedidos de balcão */}
      {/* <Route path="/pedidos-balcao/pagamentos/" element={<PrivateRoute />}>
        <Route
          path="/pedidos-balcao/pagamentos/"
          element={
            <AddSidebar>
              <TakeoutPayment />
            </AddSidebar>
          }
        />
      </Route> */}

      {/*Pedidos de balcão */}
      <Route path="/pedidos/" element={<PrivateRoute />}>
        <Route
          path="/pedidos/"
          element={
            <AddSidebar>
              <OrdersManager />
            </AddSidebar>
          }
        />
      </Route>

      <Route path="/relatorios/caixas-passados/" element={<PrivateRoute />}>
        <Route
          path="/relatorios/caixas-passados/"
          element={
            <AddSidebar titleHeader="Caixas passados">
              <PastCashiers />
            </AddSidebar>
          }
        />
      </Route>
      <Route path="/relatorios/financeiro/" element={<PrivateRoute />}>
        <Route
          path="/relatorios/financeiro/"
          element={
            <AddSidebar titleHeader="Relatório por período">
              <FinancialStats />
            </AddSidebar>
          }
        />
      </Route>
      <Route path="/relatorios/caixas-passados/:id" element={<PrivateRoute />}>
        <Route
          path="/relatorios/caixas-passados/:id"
          element={
            <AddSidebar titleHeader="Relatório de caixa">
              <CashierDetail />
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
  )
}
