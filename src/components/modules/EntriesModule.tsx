import React, { useState } from 'react';
import { Product, MovementRecord } from '../../types/warehouse';
import { 
  ArrowDownToLine, 
  Plus, 
  FileText, 
  Building2, 
  AlertCircle, 
  CheckCircle2, 
  Search
} from 'lucide-react';
import { WAREHOUSE_ZONES } from '../../data/mockData';

interface EntriesModuleProps {
  products: Product[];
  movements: MovementRecord[];
  onRegisterEntry: (params: {
    folio: string;
    productId: string;
    quantity: number;
    supplier: string;
    targetWarehouse: string;
    notes?: string;
    incidentNotes?: string;
    responsibleName?: string;
  }) => void;
}

export const EntriesModule: React.FC<EntriesModuleProps> = ({
  products,
  movements,
  onRegisterEntry,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form fields
  const [folio, setFolio] = useState('');
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [supplier, setSupplier] = useState('');
  const [targetWarehouse, setTargetWarehouse] = useState(WAREHOUSE_ZONES[2]); // Insumos
  const [hasIncident, setHasIncident] = useState(false);
  const [incidentNotes, setIncidentNotes] = useState('');
  const [notes, setNotes] = useState('');
  const [responsibleName, setResponsibleName] = useState('Carlos Méndez (Almacenista)');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Filter entry movements
  const entryMovements = movements.filter((m) => m.type === 'Entrada por Compra');
  const filteredMovements = entryMovements.filter(
    (m) =>
      m.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.sourceWarehouse && m.sourceWarehouse.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedProduct = products.find((p) => p.id === productId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!folio.trim()) {
      setFormError('El folio de Orden de Compra o Factura es obligatorio según la especificación.');
      return;
    }

    if (!productId) {
      setFormError('Debe seleccionar un insumo o producto del catálogo.');
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      setFormError('La cantidad recibida debe ser un número positivo.');
      return;
    }

    if (!supplier.trim()) {
      setFormError('Indique el nombre del proveedor o procedencia.');
      return;
    }

    if (hasIncident && !incidentNotes.trim()) {
      setFormError('Si reporta incidencia o faltante, debe detallar la descripción del lote.');
      return;
    }

    try {
      onRegisterEntry({
        folio: folio.trim(),
        productId,
        quantity: Number(quantity),
        supplier: supplier.trim(),
        targetWarehouse,
        notes: notes.trim() || undefined,
        incidentNotes: hasIncident ? incidentNotes.trim() : undefined,
        responsibleName: responsibleName.trim(),
      });

      setSuccessMessage(`¡Entrada registrada con éxito! Folio: ${folio}. Se sumaron ${quantity} unidades al inventario.`);
      setFolio('');
      setProductId('');
      setQuantity('');
      setSupplier('');
      setHasIncident(false);
      setIncidentNotes('');
      setNotes('');
      setShowForm(false);

      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError('Error inesperado al registrar la entrada.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado del Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#087DCD]">
            <ArrowDownToLine className="w-4 h-4" />
            <span>Módulo Operativo</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-0.5">
            Registro de Entradas (Recepciones de Insumos y Envases)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Ingreso de tapas, sellos, garrafones, químicos y filtros con registro obligatorio de folio e incidencias.
          </p>
        </div>

        <button
          onClick={() => {
            setShowForm(!showForm);
            setFormError('');
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#087DCD] text-white rounded-xl text-xs font-semibold hover:bg-[#0667a9] transition shadow-xs shrink-0"
        >
          {showForm ? (
            <span>Ver Historial</span>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Nueva Recepción</span>
            </>
          )}
        </button>
      </div>

      {successMessage && (
        <div className="flex items-center gap-3 p-4 bg-[#087DCD]/10 border border-[#087DCD]/30 text-slate-900 rounded-xl text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 text-[#087DCD] shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Formulario de Captura de Entrada */}
      {showForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in duration-200">
          <div className="pb-4 mb-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#087DCD]" />
              <span>Captura de Recepción de Material</span>
            </h3>
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              * Folio Obligatorio
            </span>
          </div>

          {formError && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Documento / Folio de Respaldo *
                </label>
                <input
                  type="text"
                  placeholder="ej. OC-2026-092 o FACT-1049"
                  value={folio}
                  onChange={(e) => setFolio(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087DCD] font-mono"
                  required
                />
                <span className="text-[10px] text-slate-400">Orden de compra o factura de proveedor</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Proveedor / Procedencia *
                </label>
                <input
                  type="text"
                  placeholder="ej. Tapas y Envases de Occidente"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087DCD]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Almacén de Recepción Destino *
                </label>
                <select
                  value={targetWarehouse}
                  onChange={(e) => setTargetWarehouse(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087DCD] bg-white"
                >
                  {WAREHOUSE_ZONES.map((zone) => (
                    <option key={zone} value={zone}>
                      {zone}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Insumo o Producto a Ingresar *
                </label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087DCD] bg-white"
                  required
                >
                  <option value="">-- Seleccionar insumo del catálogo --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.sku} · {p.name} (Stock actual: {p.stock} {p.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cantidad Recibida {selectedProduct ? `(${selectedProduct.unit})` : ''} *
                </label>
                <input
                  type="number"
                  min="1"
                  step="any"
                  placeholder="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087DCD] font-mono tabular-nums font-bold text-[#087DCD]"
                  required
                />
              </div>
            </div>

            {selectedProduct && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-semibold">Ubicación asignada:</span> {selectedProduct.location.warehouseName} ({selectedProduct.location.binCode})
                </div>
                <div>
                  <span className="font-semibold">Costo unitario:</span> ${selectedProduct.cost.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                </div>
                {quantity && Number(quantity) > 0 && (
                  <div className="font-bold text-[#087DCD]">
                    Impacto en Stock: {selectedProduct.stock} ➔ {selectedProduct.stock + Number(quantity)} {selectedProduct.unit}
                  </div>
                )}
              </div>
            )}

            {/* Registro de Incidencias o Faltantes */}
            <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-3">
              <label className="flex items-center gap-2 text-xs font-bold text-amber-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasIncident}
                  onChange={(e) => setHasIncident(e.target.checked)}
                  className="rounded text-[#087DCD] focus:ring-[#087DCD] w-4 h-4"
                />
                <span>¿Presenta Incidencia o Faltante en la Recepción? (Tapas aplastadas, garrafones rayados/rotos o bultos rotos)</span>
              </label>

              {hasIncident && (
                <div>
                  <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                    Detalle de Incidencia / Faltante Registrado *
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Detalle exactamente la discrepancia respecto a la orden de compra o el estado físico del insumo..."
                    value={incidentNotes}
                    onChange={(e) => setIncidentNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-amber-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Observaciones Generales de la Entrega (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="ej. Certificado de inocuidad y grado alimenticio verificado"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087DCD]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Operador Responsable de Recepción
                </label>
                <input
                  type="text"
                  value={responsibleName}
                  onChange={(e) => setResponsibleName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087DCD] bg-slate-50"
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
                className="px-5 py-2 bg-[#087DCD] text-white rounded-lg text-xs font-semibold hover:bg-[#0667a9] transition shadow-xs"
              >
                Confirmar y Sumar a Existencias (+)
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla de Histórico de Recepciones con Folio */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Historial de Recepciones y Entradas</h3>
            <span className="text-xs text-slate-500">
              {filteredMovements.length} movimientos registrados con folio
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por folio, SKU o proveedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087DCD]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Folio Respaldo</th>
                <th className="py-3 px-4">Fecha / Hora</th>
                <th className="py-3 px-4">Artículo / SKU</th>
                <th className="py-3 px-4">Proveedor / Origen</th>
                <th className="py-3 px-4 text-right">Cant. Recibida</th>
                <th className="py-3 px-4 text-right">Stock Final</th>
                <th className="py-3 px-4">Incidencias / Notas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMovements.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No se encontraron registros de recepciones con ese criterio.
                  </td>
                </tr>
              ) : (
                filteredMovements.map((mov) => (
                  <tr key={mov.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {mov.folio}
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap font-mono tabular-nums">
                      {mov.timestamp.replace('T', ' ').substring(0, 16)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{mov.productName}</div>
                      <div className="text-[11px] font-mono text-slate-400">{mov.sku}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{mov.sourceWarehouse || 'Proveedor Insumos'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#087DCD] tabular-nums">
                      +{mov.quantity} {mov.unit}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-800 tabular-nums">
                      {mov.resultingStock} {mov.unit}
                    </td>
                    <td className="py-3 px-4">
                      {mov.incidentNotes ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-800 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <AlertCircle className="w-3 h-3 text-amber-600" />
                          <span>{mov.incidentNotes}</span>
                        </span>
                      ) : mov.notes ? (
                        <span className="text-slate-600 text-[11px]">{mov.notes}</span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Conforme</span>
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
