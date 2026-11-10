import React, { useState } from 'react';
import { RoleId, UserRole } from '../types/warehouse';
import { SYSTEM_ROLES } from '../data/mockData';
import { 
  LogOut, 
  Download, 
  ChevronDown, 
  PanelLeftClose, 
  PanelLeftOpen,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface UnifiedHeaderProps {
  currentRole: RoleId;
  onSelectRole: (roleId: RoleId) => void;
  onLogout: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({
  currentRole,
  onSelectRole,
  onLogout,
  isSidebarOpen,
  onToggleSidebar,
}) => {
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  const activeRoleObj = SYSTEM_ROLES.find((r) => r.id === currentRole) || SYSTEM_ROLES[0];

  const handleRoleChange = (roleId: RoleId) => {
    onSelectRole(roleId);
    setIsRoleDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 h-16 px-4 md:px-6 flex items-center justify-between shadow-xs">
      {/* Zona 1: Menú hamburguesa (desktop/tablet) + Logotipo del sistema */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? 'Colapsar menú lateral' : 'Expandir menú lateral'}
          className="hidden lg:flex items-center justify-center w-9 h-9 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="w-5 h-5" />
          ) : (
            <PanelLeftOpen className="w-5 h-5" />
          )}
        </button>

        <div className="flex items-center gap-2.5">
          <img 
            src="/icon.svg" 
            alt="Logo Invernadero Futura" 
            className="w-8 h-8 object-contain"
          />
          <div className="flex flex-col">
            <span className="text-sm md:text-base font-bold text-slate-900 tracking-tight leading-tight">
              Invernadero Futura
            </span>
            <span className="text-[11px] font-medium text-emerald-700 leading-none">
              Gestión de Almacén
            </span>
          </div>
        </div>
      </div>

      {/* Zona 2: Identificación del Rol Activo con selector */}
      <div className="relative">
        <button
          onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-semibold text-slate-800"
        >
          <span className="hidden sm:inline text-slate-500 font-normal">Rol activo:</span>
          <span className="text-emerald-800 font-bold truncate max-w-[130px] sm:max-w-[190px]">
            {activeRoleObj.shortName}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isRoleDropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50">
            <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-400">
              Cambiar Rol Operativo
            </div>
            {SYSTEM_ROLES.map((r: UserRole) => (
              <button
                key={r.id}
                onClick={() => handleRoleChange(r.id)}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                  r.id === currentRole ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'text-slate-700'
                }`}
              >
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-[10px] text-slate-400">{r.level}</div>
                </div>
                {r.id === currentRole && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Zona 3: Botón de Instalación Rápida PWA + Botón de Cierre de Sesión */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* PWA Install Button */}
        {!isInstalled && isInstallable && (
          <button
            onClick={install}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 shadow-xs transition-colors shrink-0"
            title="Instalar Invernadero Futura en tu dispositivo"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Instalar App</span>
            <span className="sm:hidden">Instalar</span>
          </button>
        )}

        {!isInstalled && isIOS && (
          <button
            onClick={() => setShowIOSModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 border border-slate-300 bg-white text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors shrink-0"
            title="Cómo instalar en iOS"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Instalar iOS</span>
          </button>
        )}

        {/* Botón de Cierre de Sesión */}
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 rounded-lg transition-colors shrink-0"
          title="Cerrar sesión y volver al selector de roles"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Cerrar Sesión</span>
        </button>
      </div>

      {/* Modal Guía iOS */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl border border-slate-200 text-left">
            <div className="flex items-center gap-2 mb-3 text-slate-900 font-bold">
              <HelpCircle className="w-5 h-5 text-emerald-600" />
              <span>Instalar en iOS / Safari</span>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              1. En la barra de Safari, pulsa el botón <strong>Compartir</strong>.<br />
              2. Elige <strong>"Agregar a Inicio"</strong>.<br />
              3. Pulsa <strong>"Agregar"</strong> para usar como aplicación de almacén.
            </p>
            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
