import React, { useState } from 'react';
import { useWarehouse } from './hooks/useWarehouse';
import { RoleSelector } from './components/RoleSelector';
import { UnifiedHeader } from './components/UnifiedHeader';
import { DesktopSidebar } from './components/DesktopSidebar';
import { MobileBottomBar } from './components/MobileBottomBar';
import { EntriesModule } from './components/modules/EntriesModule';
import { ExitsModule } from './components/modules/ExitsModule';
import { LocationsModule } from './components/modules/LocationsModule';
import { CyclicCountModule } from './components/modules/CyclicCountModule';
import { AdjustmentsModule } from './components/modules/AdjustmentsModule';
import { KardexModule } from './components/modules/KardexModule';
import { StockAlertsModule } from './components/modules/StockAlertsModule';
import { TransfersModule } from './components/modules/TransfersModule';
import { CatalogModule } from './components/modules/CatalogModule';
import { ReportsModule } from './components/modules/ReportsModule';
import { UsersModule } from './components/modules/UsersModule';

export default function App() {
  const {
    currentRole,
    currentModule,
    setCurrentModule,
    selectRole,
    logout,
    products,
    movements,
    cyclicCounts,
    adjustments,
    transfers,
    users,
    sessions,
    registerEntry,
    registerExit,
    registerCyclicCount,
    registerAdjustment,
    registerTransfer,
    addProduct,
    updateProduct,
    updateLocation,
    addUser,
    toggleUserStatus,
  } = useWarehouse();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Alerts count: critical reorders + items with >60 days stay
  const alertsCount = products.filter((p) => p.stock <= p.minStock || p.daysInWarehouse >= 60).length;

  // 1. Si no hay rol activo, mostrar la pantalla limpia de Acceso por Roles en Inicio
  // (Cuadrícula 2 Columnas Móvil / 4 Columnas Escritorio, sin header, sin descripciones, solo nombre y logo sin encapsular)
  if (!currentRole) {
    return <RoleSelector onSelectRole={selectRole} />;
  }

  // 2. Aplicación Principal con Cabecera Institucional Unificada, Menú Lateral Desplegable y Bottom Bar
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Cabecera Institucional Unificada */}
      <UnifiedHeader
        currentRole={currentRole}
        onSelectRole={selectRole}
        onLogout={logout}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Menú Lateral Desplegable en Escritorio */}
        <DesktopSidebar
          currentModule={currentModule}
          onSelectModule={setCurrentModule}
          currentRole={currentRole}
          isOpen={isSidebarOpen}
          onLogout={logout}
          alertsCount={alertsCount}
        />

        {/* Área de Trabajo Principal - Sin Pestañas Repetitivas */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 pb-24 lg:pb-8">
          <div className="max-w-7xl mx-auto">
            {currentModule === 'entradas' && (
              <EntriesModule
                products={products}
                movements={movements}
                onRegisterEntry={registerEntry}
              />
            )}

            {currentModule === 'salidas' && (
              <ExitsModule
                products={products}
                movements={movements}
                onRegisterExit={registerExit}
              />
            )}

            {currentModule === 'ubicaciones' && (
              <LocationsModule
                products={products}
                onUpdateLocation={updateLocation}
              />
            )}

            {currentModule === 'conteo' && (
              <CyclicCountModule
                products={products}
                cyclicCounts={cyclicCounts}
                onRegisterCyclicCount={registerCyclicCount}
                onNavigateToAdjustments={() => setCurrentModule('ajustes')}
              />
            )}

            {currentModule === 'ajustes' && (
              <AdjustmentsModule
                products={products}
                adjustments={adjustments}
                onRegisterAdjustment={registerAdjustment}
              />
            )}

            {currentModule === 'kardex' && (
              <KardexModule
                products={products}
                movements={movements}
              />
            )}

            {currentModule === 'alertas' && (
              <StockAlertsModule
                products={products}
                onNavigateToEntries={() => setCurrentModule('entradas')}
                onNavigateToTransfers={() => setCurrentModule('transferencias')}
              />
            )}

            {currentModule === 'transferencias' && (
              <TransfersModule
                products={products}
                transfers={transfers}
                onRegisterTransfer={registerTransfer}
              />
            )}

            {currentModule === 'catalogo' && (
              <CatalogModule
                products={products}
                onAddProduct={addProduct}
                onUpdateProduct={updateProduct}
              />
            )}

            {currentModule === 'reportes' && (
              <ReportsModule
                products={products}
                movements={movements}
              />
            )}

            {currentModule === 'usuarios' && (
              <UsersModule
                users={users}
                sessions={sessions}
                onAddUser={addUser}
                onToggleUserStatus={toggleUserStatus}
              />
            )}
          </div>
        </main>
      </div>

      {/* Navegación Móvil y Tablet (Bottom Bar) */}
      <MobileBottomBar
        currentModule={currentModule}
        onSelectModule={setCurrentModule}
        currentRole={currentRole}
        alertsCount={alertsCount}
      />
    </div>
  );
}
