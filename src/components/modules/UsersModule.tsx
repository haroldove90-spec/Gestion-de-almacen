import React, { useState } from 'react';
import { UserAccount, ActivitySession, RoleId } from '../../types/warehouse';
import { SYSTEM_ROLES, WAREHOUSE_ZONES } from '../../data/mockData';
import { 
  Users2, 
  UserPlus, 
  ShieldCheck, 
  History, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Laptop, 
  Smartphone,
  Lock
} from 'lucide-react';

interface UsersModuleProps {
  users: UserAccount[];
  sessions: ActivitySession[];
  onAddUser: (user: Omit<UserAccount, 'id' | 'lastLogin'>) => void;
  onToggleUserStatus: (id: string) => void;
}

export const UsersModule: React.FC<UsersModuleProps> = ({
  users,
  sessions,
  onAddUser,
  onToggleUserStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'usuarios' | 'auditoria'>('usuarios');
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form fields
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<RoleId>('almacenista');
  const [assignedWarehouse, setAssignedWarehouse] = useState(WAREHOUSE_ZONES[0]);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!username.trim() || !fullName.trim() || !email.trim()) {
      setFormError('Todos los campos son obligatorios.');
      return;
    }

    try {
      onAddUser({
        username: username.trim().toLowerCase(),
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        role,
        status: 'Activo',
        assignedWarehouse,
      });

      setSuccessMessage(`Usuario ${username} creado con perfil ${role}.`);
      setUsername('');
      setFullName('');
      setEmail('');
      setShowForm(false);
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError('Error al crear usuario.');
      }
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700">
            <Users2 className="w-4 h-4" />
            <span>Nivel Estratégico / Dirección</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-0.5">
            Gestión de Accesos, Usuarios y Auditoría
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Creación de credenciales, asignación de permisos por rol y bitácora de auditoría de sesiones.
          </p>
        </div>

        <button
          onClick={() => {
            setShowForm(!showForm);
            setFormError('');
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-700 text-white rounded-xl text-xs font-semibold hover:bg-amber-800 transition shadow-xs shrink-0"
        >
          {showForm ? (
            <span>Ver Cuentas</span>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Nuevo Usuario</span>
            </>
          )}
        </button>
      </div>

      {successMessage && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Tabs segmentadas */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('usuarios')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'usuarios'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Cuentas y Permisos ({users.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('auditoria')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'auditoria'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <History className="w-4 h-4 text-blue-600" />
          <span>Auditoría de Sesiones ({sessions.length})</span>
        </button>
      </div>

      {/* Formulario de Alta de Usuario */}
      {showForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in duration-200">
          <div className="pb-4 mb-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-amber-600" />
              <span>Creación de Credencial de Personal</span>
            </h3>
            <span className="text-xs text-slate-500">Asignación de rol y permisos</span>
          </div>

          {formError && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre de Usuario (Login) *
                </label>
                <input
                  type="text"
                  placeholder="ej. miguel.torres"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  placeholder="ej. Ing. Miguel Torres"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  placeholder="ej. miguel@invernaderofutura.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rol y Nivel Operativo Asignado *
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as RoleId)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 bg-white"
                >
                  {SYSTEM_ROLES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.level})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Almacén / Bodega Principal Asignada
                </label>
                <select
                  value={assignedWarehouse}
                  onChange={(e) => setAssignedWarehouse(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 bg-white"
                >
                  <option value="General - Todas las Bodegas">General - Todas las Bodegas</option>
                  {WAREHOUSE_ZONES.map((zone) => (
                    <option key={zone} value={zone}>
                      {zone}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-700 text-white rounded-lg text-xs font-semibold hover:bg-amber-800 transition shadow-xs"
              >
                Crear Credencial
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Vista 1: Cuentas y Permisos */}
      {activeTab === 'usuarios' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Usuarios Registrados en el Sistema</h3>
              <span className="text-xs text-slate-500">
                {filteredUsers.length} cuentas con credenciales activas
              </span>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o usuario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Usuario</th>
                  <th className="py-3 px-4">Nombre Completo</th>
                  <th className="py-3 px-4">Rol Asignado</th>
                  <th className="py-3 px-4">Almacén Asignado</th>
                  <th className="py-3 px-4">Último Acceso</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => {
                  const roleObj = SYSTEM_ROLES.find((r) => r.id === u.role);

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {u.username}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{u.fullName}</div>
                        <div className="text-[11px] text-slate-400">{u.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs font-semibold text-slate-800">
                          {roleObj?.shortName || u.role}
                        </span>
                        <div className="text-[10px] text-slate-400">{roleObj?.level}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 text-[11px]">
                        {u.assignedWarehouse}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {u.lastLogin}
                      </td>
                      <td className="py-3 px-4">
                        {u.status === 'Activo' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Activo</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            <XCircle className="w-3 h-3 text-slate-400" />
                            <span>Inactivo</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => onToggleUserStatus(u.id)}
                          className={`px-2.5 py-1 text-[11px] rounded font-medium transition ${
                            u.status === 'Activo'
                              ? 'text-rose-700 hover:bg-rose-50'
                              : 'text-emerald-700 hover:bg-emerald-50'
                          }`}
                        >
                          {u.status === 'Activo' ? 'Desactivar' : 'Activar'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Vista 2: Auditoría de Sesiones */}
      {activeTab === 'auditoria' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200/90 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Bitácora de Auditoría de Sesiones y Trazabilidad</h3>
            <span className="text-xs text-slate-500 font-mono">Registro inmutable de actividades</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Fecha / Hora</th>
                  <th className="py-3 px-4">Usuario / Rol</th>
                  <th className="py-3 px-4">Acción Ejecutada</th>
                  <th className="py-3 px-4">Dirección IP</th>
                  <th className="py-3 px-4">Dispositivo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sessions.map((ses) => (
                  <tr key={ses.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap tabular-nums">
                      {ses.timestamp}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{ses.user}</div>
                      <div className="text-[10px] text-slate-400">{ses.role}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {ses.action}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                      {ses.ipAddress}
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        {ses.device.includes('Móvil') ? (
                          <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                        ) : (
                          <Laptop className="w-3.5 h-3.5 text-slate-400" />
                        )}
                        <span>{ses.device}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
