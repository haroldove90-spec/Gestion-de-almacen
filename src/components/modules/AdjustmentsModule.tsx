import React, { useState } from 'react';
import { Product, StockAdjustment } from '../../types/warehouse';
import { 
  Scale, 
  Plus, 
  FileCheck, 
  AlertCircle, 
  CheckCircle2, 
  Search,
  ShieldCheck,
  FileSignature
} from 'lucide-react';

interface AdjustmentsModuleProps {
  products: Product[];
  adjustments: StockAdjustment[];
  onRegisterAdjustment: (params: {
    actaFolio: string;
    productId: string;
    type: StockAdjustment['type'];
    adjustmentQuantity: number;
    justification: string;
    supervisorName: string;
  }) => void;
}

export const AdjustmentsModule: React.FC<AdjustmentsModuleProps> = ({
  products,
  adjustments,
  onRegisterAdjustment,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form fields
  const [actaFolio, setActaFolio] = useState('');
  const [productId, setProductId] = useState('');
  const [type, setType] = useState<StockAdjustment['type']>('Merma por caducidad/humedad');
  const [direction, setDirection] = useState<'resta' | 'suma'>('resta');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [justification, setJustification] = useState('');
  const [supervisorName, setSupervisorName] = useState('Ing. Roberto Garza (Jefe de Bodega)');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const selectedProduct = products.find((p) => p.id === productId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!actaFolio.trim()) {
      setFormError('El folio del Acta de Ajuste es obligatorio.');
      return;
    }

    if (!productId) {
      setFormError('Seleccione el artículo a ajustar.');
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      setFormError('La cantidad del ajuste debe ser un número positivo.');
      return;
    }

    if (!justification.trim() || justification.trim().length < 10) {
      setFormError('Justificación obligatoria: Debe ingresar una causa detallada de al menos 10 caracteres.');
      return;
    }

    const netQuantity = direction === 'resta' ? -Number(quantity) : Number(quantity);

    if (selectedProduct && selectedProduct.stock + netQuantity < 0) {
      setFormError(`El ajuste no puede dejar el stock físico en número negativo. Stock actual: ${selectedProduct.stock}`);
      return;
    }

    try {
      onRegisterAdjustment({
        actaFolio: actaFolio.trim(),
        productId,
        type,
        adjustmentQuantity: netQuantity,
        justification: justification.trim(),
        supervisorName: supervisorName.trim(),
      });

      setSuccessMessage(`¡Acta de Ajuste ${actaFolio} formalizada y aplicada! Impacto neto: ${netQuantity > 0 ? '+' : ''}${netQuantity} ${selectedProduct?.unit}.`);
      setActaFolio('');
      setProductId('');
      setQuantity('');
      setJustification('');
      setShowForm(false);

      setTimeout(() => setSuccessMessage(''), 4500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError('Error al registrar el ajuste.');
      }
    }
  };

  const filteredAdjustments = adjustments.filter(
    (a) =>
      a.actaFolio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.justification.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700">
            <Scale className="w-4 h-4" />
            <span>Módulo Táctico / Supervisión</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-0.5">
            Ajustes de Inventario y Mermas
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Autorización formal de mermas, pérdidas, productos dañados o correcciones de conteo con justificación obligatoria y acta foliada.
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
            <span>Ver Actas</span>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Emitir Acta de Ajuste</span>
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

      {/* Formulario de Emisión de Acta de Ajuste */}
      {showForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in duration-200">
          <div className="pb-4 mb-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileSignature className="w-4 h-4 text-blue-600" />
              <span>Emisión de Acta Formal de Ajuste de Existencias</span>
            </h3>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
              Autorización Táctica Requerida
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
                  Folio de Acta de Ajuste *
                </label>
                <input
                  type="text"
                  placeholder="ej. ACTA-AJU-043"
                  value={actaFolio}
                  onChange={(e) => setActaFolio(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                  required
                />
                <span className="text-[10px] text-slate-400">Documento legal de respaldo interno</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tipo / Causal de Ajuste *
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as StockAdjustment['type'])}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  <option value="Merma por caducidad/humedad">Merma por caducidad / humedad</option>
                  <option value="Daño en maniobra">Producto dañado en maniobra</option>
                  <option value="Corrección por conteo cíclico">Corrección por conteo cíclico</option>
                  <option value="Faltante no justificado">Faltante o merma no justificada</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Supervisor Responsable *
                </label>
                <input
                  type="text"
                  value={supervisorName}
                  onChange={(e) => setSupervisorName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Artículo / Producto a Ajustar *
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

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sentido
                  </label>
                  <select
                    value={direction}
                    onChange={(e) => setDirection(e.target.value as 'resta' | 'suma')}
                    className="w-full px-2 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white font-semibold"
                  >
                    <option value="resta">Disminución (-)</option>
                    <option value="suma">Incremento (+)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cantidad {selectedProduct ? `(${selectedProduct.unit})` : ''} *
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    placeholder="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-2 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono font-bold"
                    required
                  />
                </div>
              </div>
            </div>

            {selectedProduct && quantity && Number(quantity) > 0 && (
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center justify-between">
                <span>
                  <strong>Ajuste resultante en kardex:</strong> De {selectedProduct.stock} a{' '}
                  {direction === 'resta' ? selectedProduct.stock - Number(quantity) : selectedProduct.stock + Number(quantity)}{' '}
                  {selectedProduct.unit}
                </span>
                <span className="font-mono font-bold">
                  Impacto neto: {direction === 'resta' ? '-' : '+'}{quantity} {selectedProduct.unit}
                </span>
              </div>
            )}

            {/* Justificación obligatoria */}
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                Justificación Formal Obligatoria * (Mínimo 10 caracteres)
              </label>
              <textarea
                rows={3}
                placeholder="Explique las causas técnicas del ajuste: número de lote, causa física del daño, reporte de inspección fitosanitaria, etc."
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
              <span className="text-[10px] text-slate-400">
                La justificación quedará anexada formalmente a la auditoría del kardex.
              </span>
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
                <ShieldCheck className="w-4 h-4" />
                <span>Firmar y Autorizar Acta de Ajuste</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Historial de Actas de Ajuste */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Actas de Ajuste y Mermas Autorizadas</h3>
            <span className="text-xs text-slate-500">
              {filteredAdjustments.length} resoluciones formales con justificación
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por acta, producto o motivo..."
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
                <th className="py-3 px-4">Folio de Acta</th>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Artículo / SKU</th>
                <th className="py-3 px-4">Tipo de Causal</th>
                <th className="py-3 px-4 text-right">Ajuste Neto</th>
                <th className="py-3 px-4">Justificación Registrada</th>
                <th className="py-3 px-4">Autorizado Por</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAdjustments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No se han registrado actas de ajuste con ese criterio.
                  </td>
                </tr>
              ) : (
                filteredAdjustments.map((adj) => (
                  <tr key={adj.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {adj.actaFolio}
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap font-mono tabular-nums">
                      {adj.date}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{adj.productName}</div>
                      <div className="text-[11px] font-mono text-slate-400">{adj.sku}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <span className="text-[11px] font-medium text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                        {adj.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold tabular-nums">
                      <span className={adj.adjustmentQuantity > 0 ? 'text-emerald-700' : 'text-rose-700'}>
                        {adj.adjustmentQuantity > 0 ? `+${adj.adjustmentQuantity}` : adj.adjustmentQuantity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-[11px] max-w-xs">
                      {adj.justification}
                    </td>
                    <td className="py-3 px-4 text-slate-700 text-[11px]">
                      <div className="flex items-center gap-1 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{adj.approvedBySupervisor}</span>
                      </div>
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
