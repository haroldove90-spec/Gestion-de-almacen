import React, { useState } from 'react';
import { RoleId } from '../types/warehouse';
import { SYSTEM_ROLES } from '../data/mockData';
import { 
  LogOut, 
  Download, 
  PanelLeftClose, 
  PanelLeftOpen,
  HelpCircle,
  Shield
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface UnifiedHeaderProps {
  currentRole: RoleId;
  onLogout: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({
  currentRole,
  onLogout,
  isSidebarOpen,
  onToggleSidebar,
}) => {
  const [showIOSModal, setShowIOSModal] = useState(false);
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  const activeRoleObj = SYSTEM_ROLES.find((r) => r.id === currentRole) || SYSTEM_ROLES[0];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 h-16 px-4 md:px-6 flex items-center justify-between shadow-xs">
      {/* Zona 1: Menú hamburguesa (desktop/tablet) + Logotipo del sistema Borneo sin encapsular */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? 'Colapsar menú lateral' : 'Expandir menú lateral'}
          className="hidden lg:flex items-center justify-center w-9 h-9 text-slate-700 hover:text-black hover:bg-slate-100 rounded-lg transition-colors"
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="w-5 h-5" />
          ) : (
            <PanelLeftOpen className="w-5 h-5" />
          )}
        </button>

        <div className="flex items-center gap-3">
          <img 
            src="https://daloocomercializadora.com.mx/borneologo.png" 
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== window.location.origin + '/borneologo.png') {
                target.src = '/borneologo.png';
              }
            }}
            alt="Borneo Agua Purificada" 
            className="h-8 md:h-9 w-auto object-contain"
          />
          <div className="hidden sm:flex flex-col border-l border-slate-200 pl-3">
            <span className="text-[11px] font-bold text-black uppercase tracking-wider leading-tight">
              Gestión de Almacén
            </span>
            <span className="text-[10px] font-medium text-[#087DCD] leading-none">
              Planta & Distribución
            </span>
          </div>
        </div>
      </div>

      {/* Zona 2: Identificación del Rol Activo (fijo; para acceder a otro rol se debe cerrar sesión) */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-800">
        <Shield className="w-3.5 h-3.5 text-[#087DCD] shrink-0" />
        <span className="hidden sm:inline text-slate-500 font-normal">Rol:</span>
        <span className="text-[#087DCD] font-bold truncate max-w-[150px] sm:max-w-none">
          {activeRoleObj.name}
        </span>
        <span className="text-[10px] text-slate-400 font-medium hidden md:inline">
          · {activeRoleObj.level}
        </span>
      </div>

      {/* Zona 3: Botón de Instalación Rápida PWA + Botón de Cierre de Sesión */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* PWA Install Button */}
        {!isInstalled && isInstallable && (
          <button
            onClick={install}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#087DCD] text-white rounded-lg text-xs font-semibold hover:bg-[#0667a9] shadow-xs transition-colors shrink-0"
            title="Instalar Borneo en tu dispositivo"
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

        {/* Botón de Cierre de Sesión para cambiar de rol */}
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:text-white hover:bg-black border border-slate-200 rounded-lg transition-colors shrink-0 shadow-2xs"
          title="Cerrar sesión para seleccionar otro rol operativo"
        >
          <LogOut className="w-3.5 h-3.5 text-rose-600" />
          <span>Cerrar Sesión</span>
        </button>
      </div>

      {/* Modal Guía iOS */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl border border-slate-200 text-left">
            <div className="flex items-center gap-2 mb-3 text-slate-900 font-bold">
              <HelpCircle className="w-5 h-5 text-[#087DCD]" />
              <span>Instalar Borneo en iOS / Safari</span>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              1. En la barra de Safari, pulsa el botón <strong>Compartir</strong>.<br />
              2. Elige <strong>"Agregar a Inicio"</strong>.<br />
              3. Pulsa <strong>"Agregar"</strong> para instalar el almacén Borneo.
            </p>
            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2 bg-black text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
