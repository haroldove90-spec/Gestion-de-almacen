import React, { useState } from 'react';
import { Product, CyclicCountItem } from '../../types/warehouse';
import { 
  RefreshCw, 
  Plus, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight,
  ClipboardList,
  Search
} from 'lucide-react';

interface CyclicCountModuleProps {
  products: Product[];
  cyclicCounts: CyclicCountItem[];
  onRegisterCyclicCount: (params: {
    productId: string;
    section: string;
    countedStock: number;
    notes?: string;
    countedBy: string;
  }) => void;
  onNavigateToAdjustments?: () => void;
}

export const CyclicCountModule: React.FC<CyclicCountModuleProps> = ({
  products,
  cyclicCounts,
  onRegisterCyclicCount,
  onNavigateToAdjustments,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form fields
  const [productId, setProductId] = useState('');
  const [section, setSection] = useState('');
  const [countedStock, setCountedStock] = useState<number | ''>('');
  const [countedBy, setCountedBy] = useState('Carlos Méndez (Almacenista)');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const selectedProduct = products.find((p) => p.id === productId);

  // Auto-fill section if product is picked
  const handleProductChange = (id: string) => {
    setProductId(id);
    const prod = products.find((p) => p.id === id);
    if (prod) {
      setSection(`${prod.location.warehouseName} - ${prod.location.aisle} (${prod.location.binCode})`);
    }
  };

  const theoreticalStock = selectedProduct ? selectedProduct.stock : 0;
  const currentDiscrepancy =
    countedStock !== '' && selectedProduct ? Number(countedStock) - theoreticalStock : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!productId) {
      setFormError('Seleccione el artículo verificado.');
      return;
    }

    if (countedStock === '' || Number(countedStock) < 0) {
      setFormError('Ingrese un conteo físico válido (0 o superior).');
      return;
    }

    if (!section.trim()) {
      setFormError('Indique la sección o anaquel auditado.');
      return;
    }

    try {
      onRegisterCyclicCount({
        productId,
        section: section.trim(),
        countedStock: Number(countedStock),
        notes: notes.trim() || undefined,
        countedBy: countedBy.trim(),
      });

      setSuccessMsg(
        `Conteo registrado para ${selectedProduct?.sku}. Discrepancia calculada: ${
          currentDiscrepancy && currentDiscrepancy > 0 ? '+' : ''
        }${currentDiscrepancy} ${selectedProduct?.unit}.`
      );

      setProductId('');
      setSection('');
      setCountedStock('');
      setNotes('');
      setShowForm(false);

      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError('Error al guardar conteo.');
      }
    }
  };

  const filteredCounts = cyclicCounts.filter(
    (c) =>
      c.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.section.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
            <RefreshCw className="w-4 h-4" />
            <span>Módulo Operativo / Auditoría</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-0.5">
            Conteo Cíclico
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Ingreso de conteos físicos rápidos por lote o sección para comparación inmediata contra el sistema y detección de variaciones.
          </p>
        </div>

        <button
          onClick={() => {
            setShowForm(!showForm);
            setFormError('');
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-semibold hover:bg-emerald-800 transition shadow-xs shrink-0"
        >
          {showForm ? (
            <span>Ver Registro</span>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Registrar Conteo Físico</span>
            </>
          )}
        </button>
      </div>

      {successMsg && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Formulario de Conteo Cíclico */}
      {showForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in duration-200">
          <div className="pb-4 mb-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-emerald-600" />
              <span>Nuevo Conteo Físico en Sitio</span>
            </h3>
            <span className="text-xs text-slate-500">Comparación teórica vs física</span>
          </div>

          {formError && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Artículo / SKU a Contar *
                </label>
                <select
                  value={productId}
                  onChange={(e) => handleProductChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                  required
                >
                  <option value="">-- Seleccionar producto --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.sku} · {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sección / Lote / Posición *
                </label>
                <input
                  type="text"
                  placeholder="ej. Bodega Norte - Pasillo C (C-01-N2)"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>
            </div>

            {selectedProduct && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <div className="text-[11px] font-semibold text-slate-500">Existencia en Sistema:</div>
                  <div className="text-lg font-mono font-bold text-slate-800">
                    {theoreticalStock} <span className="text-xs font-sans font-normal text-slate-500">{selectedProduct.unit}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Conteo Físico Real *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="Cantidad contada"
                    value={countedStock}
                    onChange={(e) => setCountedStock(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-base border border-slate-300 rounded-lg font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    required
                  />
                </div>

                <div>
                  <div className="text-[11px] font-semibold text-slate-500">Discrepancia Calculada:</div>
                  <div
                    className={`text-lg font-mono font-bold ${
                      currentDiscrepancy === null
                        ? 'text-slate-400'
                        : currentDiscrepancy === 0
                        ? 'text-emerald-600'
                        : currentDiscrepancy < 0
                        ? 'text-rose-600'
                        : 'text-amber-600'
                    }`}
                  >
                    {currentDiscrepancy === null
                      ? '--'
                      : `${currentDiscrepancy > 0 ? '+' : ''}${currentDiscrepancy} ${selectedProduct.unit}`}
                  </div>
                  {currentDiscrepancy !== null && currentDiscrepancy !== 0 && (
                    <div className="text-[10px] text-rose-600 font-semibold mt-0.5">
                      Requiere autorización de ajuste por supervisión
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notas de Inspección (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="ej. Tarima contada por piezas individuales, empaque en buen estado"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Auditor / Operador que ejecutó el conteo
                </label>
                <input
                  type="text"
                  value={countedBy}
                  onChange={(e) => setCountedBy(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-slate-50"
                />
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
                className="px-5 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition shadow-xs"
              >
                Guardar Comparación de Conteo
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Historial de Conteos Cíclicos */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Historial de Conteos Cíclicos y Auditoría</h3>
            <span className="text-xs text-slate-500">
              {filteredCounts.length} auditorías físicas realizadas
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por SKU o sección..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Artículo / SKU</th>
                <th className="py-3 px-4">Sección / Ubicación</th>
                <th className="py-3 px-4 text-right">Stock Sistema</th>
                <th className="py-3 px-4 text-right">Conteo Físico</th>
                <th className="py-3 px-4 text-right">Discrepancia</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCounts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No hay conteos cíclicos registrados.
                  </td>
                </tr>
              ) : (
                filteredCounts.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{item.productName}</div>
                      <div className="text-[11px] font-mono text-slate-400">{item.sku}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-[11px]">
                      {item.section}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-medium text-slate-700 tabular-nums">
                      {item.systemStock} {item.unit}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {item.countedStock} {item.unit}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold tabular-nums">
                      <span
                        className={
                          item.discrepancy === 0
                            ? 'text-emerald-700'
                            : item.discrepancy < 0
                            ? 'text-rose-600'
                            : 'text-amber-600'
                        }
                      >
                        {item.discrepancy > 0 ? `+${item.discrepancy}` : item.discrepancy} {item.unit}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {item.discrepancy === 0 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          <span>Exacto</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          <span>Discrepancia</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {item.discrepancy !== 0 && onNavigateToAdjustments && (
                        <button
                          onClick={onNavigateToAdjustments}
                          className="flex items-center gap-1 text-[11px] font-semibold text-blue-700 hover:text-blue-900 hover:underline"
                        >
                          <span>Ajustar</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
