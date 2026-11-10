import React from 'react';
import { RoleId, UserRole } from '../types/warehouse';
import { SYSTEM_ROLES } from '../data/mockData';
import { 
  PackageSearch, 
  ShieldCheck, 
  SlidersHorizontal, 
  ClipboardCheck, 
  ArrowRight,
  Download
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface RoleSelectorProps {
  onSelectRole: (roleId: RoleId) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelectRole }) => {
  const { isInstallable, install, isIOS } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = React.useState(false);

  const getRoleIcon = (id: RoleId) => {
    switch (id) {
      case 'almacenista':
        return <PackageSearch className="w-9 h-9 text-emerald-700 stroke-[1.8]" />;
      case 'supervisor':
        return <ShieldCheck className="w-9 h-9 text-blue-700 stroke-[1.8]" />;
      case 'administrador':
        return <SlidersHorizontal className="w-9 h-9 text-amber-700 stroke-[1.8]" />;
      case 'auditor':
        return <ClipboardCheck className="w-9 h-9 text-purple-700 stroke-[1.8]" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-8 md:py-16 selection:bg-emerald-100">
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
        
        {/* Logo del sistema sin encapsular */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-14">
          <div className="w-20 h-20 md:w-24 md:h-24 mb-4 transition-transform hover:scale-105 duration-200">
            <img 
              src="/icon.svg" 
              alt="Logotipo Invernadero Futura" 
              className="w-full h-full drop-shadow-sm object-contain"
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Invernadero Futura
          </h1>
          <p className="text-sm md:text-base font-medium text-slate-600 mt-1">
            Sistema de Gestión de Almacén e Inventarios
          </p>
        </div>

        {/* Cuadrícula: 2 Columnas Móvil / 4 Columnas Escritorio */}
        <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {SYSTEM_ROLES.map((role: UserRole) => (
            <button
              key={role.id}
              onClick={() => onSelectRole(role.id)}
              className="group relative flex flex-col items-center justify-between p-6 bg-white border border-slate-200/90 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-600/60 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 transition-all duration-200 text-center min-h-[190px] md:min-h-[220px]"
            >
              {/* Icono representativo del rol */}
              <div className="w-16 h-16 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors duration-200 mt-2">
                {getRoleIcon(role.id)}
              </div>

              {/* Solo nombre del rol */}
              <div className="my-auto py-2">
                <span className="text-base md:text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug block">
                  {role.name}
                </span>
              </div>

              {/* Acción visual de ingreso directo */}
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 group-hover:text-emerald-700 transition-colors">
                <span>Ingresar</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>

        {/* Opción rápida de instalación PWA en pie de selector si aplica */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
          <span>Invernadero Futura · Control con Registro Obligatorio de Folios</span>
          
          {isInstallable && (
            <button
              onClick={install}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-medium hover:bg-emerald-800 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Instalar Aplicación</span>
            </button>
          )}

          {isIOS && (
            <button
              onClick={() => setShowIOSModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 text-slate-700 bg-white rounded-lg text-xs font-medium hover:bg-slate-100 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Instalar en iOS</span>
            </button>
          )}
        </div>

        {/* Modal informativo iOS */}
        {showIOSModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 text-left">
              <h3 className="text-base font-bold text-slate-900 mb-2">Instalar en iPhone o iPad</h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                1. Pulsa el botón <strong>Compartir</strong> (icono de cuadrado con flecha hacia arriba) en la barra de Safari.<br />
                2. Desplázate hacia abajo y selecciona <strong>Agregar a Inicio</strong>.<br />
                3. Pulsa <strong>Agregar</strong> en la esquina superior derecha.
              </p>
              <button
                onClick={() => setShowIOSModal(false)}
                className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
