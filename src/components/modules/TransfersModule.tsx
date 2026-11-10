import React, { useState } from 'react';
import { Product, InternalTransfer } from '../../types/warehouse';
import { 
  ArrowLeftRight, 
  Plus, 
  FileText, 
  Truck, 
  AlertCircle, 
  CheckCircle2, 
  Search,
  Building,
  ArrowRight
} from 'lucide-react';
import { WAREHOUSE_ZONES } from '../../data/mockData';

interface TransfersModuleProps {
  products: Product[];
  transfers: InternalTransfer[];
  onRegisterTransfer: (params: {
    guiaFolio: string;
    productId: string;
    quantity: number;
    sourceWarehouse: string;
    targetWarehouse: string;
    driverOrCarrier: string;
    authorizedBy: string;
    notes?: string;
  }) => void;
}

export const TransfersModule: React.FC<TransfersModuleProps> = ({
  products,
  transfers,
  onRegisterTransfer,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form fields
  const [guiaFolio, setGuiaFolio] = useState('');
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [sourceWarehouse, setSourceWarehouse] = useState(WAREHOUSE_ZONES[0]);
  const [targetWarehouse, setTargetWarehouse] = useState(WAREHOUSE_ZONES[1]);
  const [driverOrCarrier, setDriverOrCarrier] = useState('');
  const [authorizedBy, setAuthorizedBy] = useState('Ing. Roberto Garza (Supervisor)');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const selectedProduct = products.find((p) => p.id === productId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!guiaFolio.trim()) {
      setFormError('El folio de la Guía de Traslado es obligatorio según la especificación.');
      return;
    }

    if (!productId) {
      setFormError('Seleccione el artículo a transferir.');
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      setFormError('La cantidad a transferir debe ser mayor a 0.');
      return;
    }

    if (sourceWarehouse === targetWarehouse) {
      setFormError('La bodega de origen y la bodega de destino no pueden ser iguales.');
      return;
    }

    if (!driverOrCarrier.trim()) {
      setFormError('Indique el chofer, operador de montacargas o responsable del traslado.');
      return;
    }

    if (selectedProduct && Number(quantity) > selectedProduct.stock) {
      setFormError(`Stock insuficiente para transferir. Disponible: ${selectedProduct.stock} ${selectedProduct.unit}.`);
      return;
    }

    try {
      onRegisterTransfer({
        guiaFolio: guiaFolio.trim(),
        productId,
        quantity: Number(quantity),
        sourceWarehouse,
        targetWarehouse,
        driverOrCarrier: driverOrCarrier.trim(),
        authorizedBy: authorizedBy.trim(),
        notes: notes.trim() || undefined,
      });

      setSuccessMessage(`¡Traspaso formalizado con Guía ${guiaFolio}! Movimiento de ${quantity} ${selectedProduct?.unit} registrado.`);
      setGuiaFolio('');
      setProductId('');
      setQuantity('');
      setDriverOrCarrier('');
      setNotes('');
      setShowForm(false);

      setTimeout(() => setSuccessMessage(''), 4500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError('Error al registrar transferencia.');
      }
    }
  };

  const filteredTransfers = transfers.filter(
    (t) =>
      t.guiaFolio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.sourceWarehouse.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.targetWarehouse.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700">
            <ArrowLeftRight className="w-4 h-4" />
            <span>Módulo Táctico / Supervisión</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-0.5">
            Transferencias Internas (Traspasos)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Movimiento de material entre distintas bodegas, almacenes o áreas de producción con emisión de Guía de Traslado obligatoria.
          </p>
        </div>

        <button
          onClick={() => {
            setShowForm(!showForm);
            setFormError('');
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-700 text-white rounded-xl text-xs font-semibold hover:bg-blue-800 transition shadow-xs shrink-0"
        >
          {showForm ? (
            <span>Ver Guías</span>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Emitir Guía de Traslado</span>
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

      {/* Formulario de Emisión de Guía de Traslado */}
      {showForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in duration-200">
          <div className="pb-4 mb-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>Emisión de Guía de Traslado Interno</span>
            </h3>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
              Reubicación Neutra de Stock
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
                  Folio de Guía de Traslado *
                </label>
                <input
                  type="text"
                  placeholder="ej. GUIA-TRAS-2026-017"
                  value={guiaFolio}
                  onChange={(e) => setGuiaFolio(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bodega / Almacén Origen *
                </label>
                <select
                  value={sourceWarehouse}
                  onChange={(e) => setSourceWarehouse(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  {WAREHOUSE_ZONES.map((zone) => (
                    <option key={zone} value={zone}>
                      {zone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bodega / Almacén Destino *
                </label>
                <select
                  value={targetWarehouse}
                  onChange={(e) => setTargetWarehouse(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
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
                  Artículo a Trasladar *
                </label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  required
                >
                  <option value="">-- Seleccionar producto --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.sku} · {p.name} (Stock: {p.stock} {p.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cantidad a Mover {selectedProduct ? `(${selectedProduct.unit})` : ''} *
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedProduct ? selectedProduct.stock : undefined}
                  step="any"
                  placeholder="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono font-bold"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Chofer / Operador Responsable *
                </label>
                <input
                  type="text"
                  placeholder="ej. Pedro Morales (Montacargas)"
                  value={driverOrCarrier}
                  onChange={(e) => setDriverOrCarrier(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Supervisor que Autoriza
                </label>
                <input
                  type="text"
                  value={authorizedBy}
                  onChange={(e) => setAuthorizedBy(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Observaciones de Ruta / Lote (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="ej. Traslado prioritario para cuadrilla vespertina"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                className="px-5 py-2 bg-blue-700 text-white rounded-lg text-xs font-semibold hover:bg-blue-800 transition shadow-xs flex items-center gap-1.5"
              >
                <Truck className="w-4 h-4" />
                <span>Emitir Guía y Ejecutar Traspaso</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Historial de Guías de Traslado */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Historial de Guías de Traslado</h3>
            <span className="text-xs text-slate-500">
              {filteredTransfers.length} guías emitidas y auditadas
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por guía o almacén..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Guía de Traslado</th>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Artículo / SKU</th>
                <th className="py-3 px-4">Ruta de Traslado</th>
                <th className="py-3 px-4 text-right">Cantidad</th>
                <th className="py-3 px-4">Chofer / Transporte</th>
                <th className="py-3 px-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransfers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No hay traslados registrados con ese filtro.
                  </td>
                </tr>
              ) : (
                filteredTransfers.map((tra) => (
                  <tr key={tra.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {tra.guiaFolio}
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap font-mono tabular-nums">
                      {tra.date}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{tra.productName}</div>
                      <div className="text-[11px] font-mono text-slate-400">{tra.sku}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium">{tra.sourceWarehouse}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="font-semibold text-blue-900">{tra.targetWarehouse}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-blue-800 tabular-nums">
                      {tra.quantity}
                    </td>
                    <td className="py-3 px-4 text-slate-700 text-[11px]">
                      <div className="font-medium">{tra.driverOrCarrier}</div>
                      <div className="text-[10px] text-slate-400">Aut: {tra.authorizedBy}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{tra.status}</span>
                      </span>
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
