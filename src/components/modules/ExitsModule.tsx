import React, { useState } from 'react';
import { Product, MovementRecord } from '../../types/warehouse';
import {
  ArrowUpFromLine,
  Plus,
  FileCheck2,
  AlertCircle,
  CheckCircle2,
  Search,
  Truck,
  SendHorizontal
} from 'lucide-react';
import { WAREHOUSE_ZONES } from '../../data/mockData';

interface ExitsModuleProps {
  products: Product[];
  movements: MovementRecord[];
  onRegisterExit: (params: {
    folio: string;
    productId: string;
    quantity: number;
    destination: string;
    sourceWarehouse: string;
    notes?: string;
    responsibleName?: string;
  }) => void;
}

export const ExitsModule: React.FC<ExitsModuleProps> = ({
  products,
  movements,
  onRegisterExit,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form fields
  const [folio, setFolio] = useState('');
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [destination, setDestination] = useState('');
  const [sourceWarehouse, setSourceWarehouse] = useState(WAREHOUSE_ZONES[0]);
  const [notes, setNotes] = useState('');
  const [responsibleName, setResponsibleName] = useState('Carlos Méndez (Almacenista)');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const selectedProduct = products.find((p) => p.id === productId);

  // Filter exit movements
  const exitMovements = movements.filter((m) => m.type === 'Salida por Venta / Requisición');
  const filteredMovements = exitMovements.filter(
    (m) =>
      m.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.targetWarehouse && m.targetWarehouse.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!folio.trim()) {
      setFormError('El folio de Nota de Venta, Pedido o Manifiesto de Ruta es obligatorio.');
      return;
    }

    if (!productId) {
      setFormError('Seleccione el artículo a despachar.');
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      setFormError('La cantidad a despachar debe ser mayor a 0.');
      return;
    }

    if (!destination.trim()) {
      setFormError('Indique la ruta de reparto, cliente o destino.');
      return;
    }

    if (selectedProduct && Number(quantity) > selectedProduct.stock) {
      setFormError(
        `Validación de Unidades Fallida: No se pueden despachar ${quantity} ${selectedProduct.unit}. La existencia disponible en almacén es de solo ${selectedProduct.stock} ${selectedProduct.unit}.`
      );
      return;
    }

    try {
      onRegisterExit({
        folio: folio.trim(),
        productId,
        quantity: Number(quantity),
        destination: destination.trim(),
        sourceWarehouse,
        notes: notes.trim() || undefined,
        responsibleName: responsibleName.trim(),
      });

      setSuccessMessage(`¡Despacho registrado! Folio: ${folio}. Se descontaron ${quantity} unidades del inventario.`);
      setFolio('');
      setProductId('');
      setQuantity('');
      setDestination('');
      setNotes('');
      setShowForm(false);

      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError('Error inesperado al registrar el despacho.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-700">
            <ArrowUpFromLine className="w-4 h-4" />
            <span>Módulo Operativo</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-0.5">
            Registro de Salidas (Despacho a Rutas y Clientes)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Descuento de garrafones y producto embotellado por notas de venta o rutas de reparto con validación estricta de existencias.
          </p>
        </div>

        <button
          onClick={() => {
            setShowForm(!showForm);
            setFormError('');
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition shadow-xs shrink-0"
        >
          {showForm ? (
            <span>Ver Historial</span>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Nuevo Despacho / Carga</span>
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

      {/* Formulario de Despacho */}
      {showForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in duration-200">
          <div className="pb-4 mb-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-black" />
              <span>Captura de Despacho / Carga de Vehículo</span>
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
                  placeholder="ej. NV-4093 o RUTA-MAN-012"
                  value={folio}
                  onChange={(e) => setFolio(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087DCD] font-mono"
                  required
                />
                <span className="text-[10px] text-slate-400">Nota de venta, pedido o manifiesto de carga</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ruta de Reparto o Cliente *
                </label>
                <input
                  type="text"
                  placeholder="ej. Ruta 02 Poniente / Camión 5"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087DCD]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Almacén de Origen *
                </label>
                <select
                  value={sourceWarehouse}
                  onChange={(e) => setSourceWarehouse(e.target.value)}
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
                  Artículo o Presentación a Despachar *
                </label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087DCD] bg-white"
                  required
                >
                  <option value="">-- Seleccionar producto con existencia disponible --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                      {p.sku} · {p.name} {p.stock <= 0 ? '(AGOTADO)' : `(Disponible: ${p.stock} ${p.unit})`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cantidad a Despachar {selectedProduct ? `(${selectedProduct.unit})` : ''} *
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedProduct ? selectedProduct.stock : undefined}
                  step="any"
                  placeholder="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087DCD] font-mono tabular-nums font-bold text-slate-900"
                  required
                />
              </div>
            </div>

            {selectedProduct && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="font-semibold">Existencia actual en bodega:</span>{' '}
                  <span className="font-mono font-bold text-slate-900">{selectedProduct.stock} {selectedProduct.unit}</span>
                </div>
                <div>
                  <span className="font-semibold">Ubicación física:</span> {selectedProduct.location.binCode} ({selectedProduct.location.warehouseName})
                </div>
                {quantity && Number(quantity) > 0 && (
                  <div className={`font-bold ${Number(quantity) > selectedProduct.stock ? 'text-rose-600' : 'text-[#087DCD]'}`}>
                    Saldo posterior: {selectedProduct.stock} - {quantity} = {selectedProduct.stock - Number(quantity)} {selectedProduct.unit}
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notas de Carga (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="ej. Tarimas aseguradas con fleje, envases limpios"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087DCD]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Almacenista Despachador
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
                className="px-5 py-2 bg-black text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition shadow-xs flex items-center gap-1.5"
              >
                <SendHorizontal className="w-3.5 h-3.5" />
                <span>Validar y Descontar Existencias (-)</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Historial de Despachos */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Historial de Despachos y Cargas</h3>
            <span className="text-xs text-slate-500">
              {filteredMovements.length} despachos con folio de respaldo
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por folio, ruta o SKU..."
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
                <th className="py-3 px-4">Ruta / Destino</th>
                <th className="py-3 px-4 text-right">Cant. Despachada</th>
                <th className="py-3 px-4 text-right">Saldo Restante</th>
                <th className="py-3 px-4">Notas / Observaciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMovements.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No se han registrado despachos que coincidan con la búsqueda.
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
                        <Truck className="w-3.5 h-3.5 text-slate-400" />
                        <span>{mov.targetWarehouse || 'Ruta General'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-rose-700 tabular-nums">
                      {mov.quantity} {mov.unit}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-800 tabular-nums">
                      {mov.resultingStock} {mov.unit}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {mov.notes || 'Despacho verificado'}
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
