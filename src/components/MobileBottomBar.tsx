import React, { useState } from 'react';
import { ModuleId, RoleId } from '../types/warehouse';
import { SYSTEM_ROLES } from '../data/mockData';
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  MapPin,
  RefreshCw,
  Scale,
  ScrollText,
  AlertTriangle,
  ArrowLeftRight,
  PackageCheck,
  BarChart3,
  Users2,
  Grid,
  X
} from 'lucide-react';

interface MobileBottomBarProps {
  currentModule: ModuleId;
  onSelectModule: (mod: ModuleId) => void;
  currentRole: RoleId;
  alertsCount: number;
}

interface BottomBarItem {
  id: ModuleId;
  label: string;
  icon: React.ReactNode;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  currentModule,
  onSelectModule,
  currentRole,
  alertsCount,
}) => {
  const [showAllModulesModal, setShowAllModulesModal] = useState(false);
  const currentRoleObj = SYSTEM_ROLES.find((r) => r.id === currentRole) || SYSTEM_ROLES[0];

  const allModuleDefinitions: Record<ModuleId, { label: string; icon: React.ReactNode }> = {
    entradas: { label: 'Entradas', icon: <ArrowDownToLine className="w-5 h-5" /> },
    salidas: { label: 'Salidas', icon: <ArrowUpFromLine className="w-5 h-5" /> },
    ubicaciones: { label: 'Ubicación', icon: <MapPin className="w-5 h-5" /> },
    conteo: { label: 'Conteo', icon: <RefreshCw className="w-5 h-5" /> },
    ajustes: { label: 'Ajustes', icon: <Scale className="w-5 h-5" /> },
    kardex: { label: 'Kardex', icon: <ScrollText className="w-5 h-5" /> },
    alertas: { label: 'Alertas', icon: <AlertTriangle className="w-5 h-5" /> },
    transferencias: { label: 'Traspasos', icon: <ArrowLeftRight className="w-5 h-5" /> },
    catalogo: { label: 'Catálogo', icon: <PackageCheck className="w-5 h-5" /> },
    reportes: { label: 'Reportes', icon: <BarChart3 className="w-5 h-5" /> },
    usuarios: { label: 'Usuarios', icon: <Users2 className="w-5 h-5" /> },
  };

  // Get primary 4 modules for the active role + "Más" button if > 4
  const allowed = currentRoleObj.allowedModules;
  const primaryModules: BottomBarItem[] = allowed.slice(0, 4).map((id) => ({
    id,
    label: allModuleDefinitions[id]?.label || id,
    icon: allModuleDefinitions[id]?.icon || <Grid className="w-5 h-5" />,
  }));

  const hasMore = allowed.length > 4;

  const handleSelect = (id: ModuleId) => {
    onSelectModule(id);
    setShowAllModulesModal(false);
  };

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200/90 shadow-lg px-2 py-1 flex items-center justify-around h-16 safe-area-pb">
        {primaryModules.map((item) => {
          const isActive = currentModule === item.id;
          const isAlert = item.id === 'alertas' && alertsCount > 0;

          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 min-h-[44px] transition-colors relative ${
                isActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className="relative">
                {item.icon}
                {isAlert && (
                  <span className="absolute -top-1 -right-2 bg-amber-500 text-white text-[9px] font-bold px-1 rounded-full">
                    {alertsCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[64px]">
                {item.label}
              </span>
              {isActive && (
                <span className="w-6 h-0.5 bg-emerald-700 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}

        {hasMore && (
          <button
            onClick={() => setShowAllModulesModal(true)}
            className={`flex flex-col items-center justify-center flex-1 py-1 min-h-[44px] transition-colors ${
              showAllModulesModal ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Grid className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 tracking-tight">Más</span>
          </button>
        )}
      </nav>

      {/* Modal para ver todos los módulos en pantallas móviles */}
      {showAllModulesModal && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-t-3xl max-h-[75vh] flex flex-col p-5 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Todos los Módulos</h3>
                <p className="text-xs text-slate-500">{currentRoleObj.name}</p>
              </div>
              <button
                onClick={() => setShowAllModulesModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 py-4 overflow-y-auto">
              {allowed.map((modId) => {
                const def = allModuleDefinitions[modId];
                if (!def) return null;
                const isActive = currentModule === modId;

                return (
                  <button
                    key={modId}
                    onClick={() => handleSelect(modId)}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-colors min-h-[48px] ${
                      isActive
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                        : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className={isActive ? 'text-emerald-700' : 'text-slate-600'}>
                      {def.icon}
                    </span>
                    <span className="text-xs">{def.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
