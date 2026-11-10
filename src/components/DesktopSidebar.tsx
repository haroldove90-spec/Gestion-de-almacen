import React from 'react';
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
  Warehouse,
  ChevronRight,
  LogOut,
  Info
} from 'lucide-react';

interface DesktopSidebarProps {
  currentModule: ModuleId;
  onSelectModule: (mod: ModuleId) => void;
  currentRole: RoleId;
  isOpen: boolean;
  onLogout: () => void;
  alertsCount: number;
}

interface NavItem {
  id: ModuleId;
  label: string;
  icon: React.ReactNode;
  category: 'Operativo' | 'Táctico' | 'Estratégico';
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  currentModule,
  onSelectModule,
  currentRole,
  isOpen,
  onLogout,
  alertsCount,
}) => {
  const currentRoleObj = SYSTEM_ROLES.find((r) => r.id === currentRole) || SYSTEM_ROLES[0];

  const allNavItems: NavItem[] = [
    // Nivel Operativo
    {
      id: 'entradas',
      label: 'Registro de Entradas',
      icon: <ArrowDownToLine className="w-4 h-4" />,
      category: 'Operativo',
    },
    {
      id: 'salidas',
      label: 'Registro de Salidas',
      icon: <ArrowUpFromLine className="w-4 h-4" />,
      category: 'Operativo',
    },
    {
      id: 'ubicaciones',
      label: 'Ubicaciones y Pasillos',
      icon: <MapPin className="w-4 h-4" />,
      category: 'Operativo',
    },
    {
      id: 'conteo',
      label: 'Conteo Cíclico',
      icon: <RefreshCw className="w-4 h-4" />,
      category: 'Operativo',
    },

    // Nivel Táctico
    {
      id: 'ajustes',
      label: 'Ajustes de Inventario',
      icon: <Scale className="w-4 h-4" />,
      category: 'Táctico',
    },
    {
      id: 'kardex',
      label: 'Kardex de Producto',
      icon: <ScrollText className="w-4 h-4" />,
      category: 'Táctico',
    },
    {
      id: 'alertas',
      label: 'Alertas de Stock',
      icon: <AlertTriangle className="w-4 h-4" />,
      category: 'Táctico',
    },
    {
      id: 'transferencias',
      label: 'Transferencias Internas',
      icon: <ArrowLeftRight className="w-4 h-4" />,
      category: 'Táctico',
    },

    // Nivel Estratégico
    {
      id: 'catalogo',
      label: 'Catálogo Maestro',
      icon: <PackageCheck className="w-4 h-4" />,
      category: 'Estratégico',
    },
    {
      id: 'reportes',
      label: 'Reportes y Valuación',
      icon: <BarChart3 className="w-4 h-4" />,
      category: 'Estratégico',
    },
    {
      id: 'usuarios',
      label: 'Accesos y Usuarios',
      icon: <Users2 className="w-4 h-4" />,
      category: 'Estratégico',
    },
  ];

  // Group items by category
  const categories: Array<{ name: string; items: NavItem[] }> = [
    {
      name: 'Operación de Almacén',
      items: allNavItems.filter((i) => i.category === 'Operativo'),
    },
    {
      name: 'Supervisión y Control',
      items: allNavItems.filter((i) => i.category === 'Táctico'),
    },
    {
      name: 'Dirección y Administración',
      items: allNavItems.filter((i) => i.category === 'Estratégico'),
    },
  ];

  return (
    <aside
      className={`hidden lg:flex flex-col bg-slate-900 text-slate-100 transition-all duration-300 border-r border-slate-800 ${
        isOpen ? 'w-64' : 'w-20'
      } shrink-0 select-none`}
    >
      {/* Encabezado del Menú Lateral */}
      <div className="h-16 flex items-center px-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Warehouse className="w-5 h-5 text-emerald-400" />
          </div>
          {isOpen && (
            <div className="flex flex-col truncate">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Módulos Activos
              </span>
              <span className="text-sm font-bold text-white truncate">
                {currentRoleObj.level}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Lista de Módulos */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {categories.map((cat) => {
          const visibleItems = cat.items.filter((item) =>
            currentRoleObj.allowedModules.includes(item.id)
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={cat.name} className="space-y-1">
              {isOpen && (
                <div className="px-3 pb-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {cat.name}
                </div>
              )}
              {visibleItems.map((item) => {
                const isActive = currentModule === item.id;
                const isAlertItem = item.id === 'alertas' && alertsCount > 0;

                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectModule(item.id)}
                    title={!isOpen ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors group relative ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="shrink-0">{item.icon}</span>

                    {isOpen && (
                      <span className="truncate flex-1 text-left">{item.label}</span>
                    )}

                    {isAlertItem && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                          isActive
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {alertsCount}
                      </span>
                    )}

                    {isOpen && !isAlertItem && isActive && (
                      <ChevronRight className="w-3.5 h-3.5 opacity-70 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Pie del Menú Lateral: Sesión y Respaldo */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60">
        {isOpen ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-2">
              <span>Folios Obligatorios</span>
              <span className="text-emerald-400 font-mono">Activo</span>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Cambiar Rol / Salir</span>
            </button>
          </div>
        ) : (
          <button
            onClick={onLogout}
            title="Cerrar sesión"
            className="w-full flex items-center justify-center p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
};
