import React, { useState } from 'react';
import { Product, MovementRecord } from '../../types/warehouse';
import { 
  ScrollText, 
  Search, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Shuffle, 
  Sliders
} from 'lucide-react';

interface KardexModuleProps {
  products: Product[];
  movements: MovementRecord[];
}

export const KardexModule: React.FC<KardexModuleProps> = ({
  products,
  movements,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  // Filter movements
  const filteredMovements = movements.filter((m) => {
    const matchesProduct = selectedProductId === 'all' || m.productId === selectedProductId;
    const matchesType = typeFilter === 'all' || m.type === typeFilter;
    const matchesSearch =
      m.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.responsibleUser.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesProduct && matchesType && matchesSearch;
  });

  const getMovementBadge = (type: MovementRecord['type']) => {
    switch (type) {
      case 'Entrada por Compra':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#087DCD] bg-[#087DCD]/10 px-2 py-0.5 rounded border border-[#087DCD]/20">
            <ArrowDownLeft className="w-3 h-3 text-[#087DCD]" />
            <span>Entrada Compra</span>
          </span>
        );
      case 'Salida por Venta / Requisición':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            <ArrowUpRight className="w-3 h-3 text-rose-600" />
            <span>Salida Despacho</span>
          </span>
        );
      case 'Ajuste por Merma o Conteo':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            <Sliders className="w-3 h-3 text-amber-600" />
            <span>Ajuste / Merma</span>
          </span>
        );
      case 'Traspaso Interno':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            <Shuffle className="w-3 h-3 text-slate-700" />
            <span>Traspaso Andén</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#087DCD]">
            <ScrollText className="w-4 h-4" />
            <span>Trazabilidad de Planta</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-0.5">
            Kardex de Producto y Movimientos
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Historial cronológico completo de entradas, salidas, saldos físicos de garrafones e insumos con folio y usuario responsable.
          </p>
        </div>

        {/* Resumen rápido */}
        <div className="text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 shrink-0">
          Total de registros en bitácora: <span className="font-mono font-bold text-slate-900">{movements.length}</span>
        </div>
      </div>

      {/* Selector de Producto Individual o Vista General */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <div className="w-full sm:w-72">
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Filtrar por Artículo Específico
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087DCD] bg-white"
            >
              <option value="all">-- Todos los Artículos (Vista Global) --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.sku} · {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-48">
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Tipo de Movimiento
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087DCD] bg-white"
            >
              <option value="all">Todos los Tipos</option>
              <option value="Entrada por Compra">Entradas por Compra</option>
              <option value="Salida por Venta / Requisición">Salidas por Venta / Ruta</option>
              <option value="Ajuste por Merma o Conteo">Ajustes / Mermas</option>
              <option value="Traspaso Interno">Traspasos Internos</option>
            </select>
          </div>
        </div>

        <div className="w-full md:w-64 self-end">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar folio o usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087DCD]"
            />
          </div>
        </div>
      </div>

      {/* Tarjeta de Resumen del Producto Seleccionado */}
      {selectedProduct && (
        <div className="bg-[#087DCD]/10 border border-[#087DCD]/20 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-[#087DCD] bg-white px-2 py-0.5 rounded border border-[#087DCD]/30">
                {selectedProduct.sku}
              </span>
              <span className="text-xs text-slate-600">{selectedProduct.category}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">{selectedProduct.name}</h3>
            <div className="text-xs text-slate-600 mt-1 flex flex-wrap gap-x-4 gap-y-1">
              <span>Ubicación: <strong>{selectedProduct.location.binCode}</strong></span>
              <span>Costo base: <strong>${selectedProduct.cost.toFixed(2)} MXN</strong></span>
              <span>Punto de reorden: <strong>{selectedProduct.minStock} {selectedProduct.unit}</strong></span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 text-right shrink-0">
            <div className="text-xs text-slate-500">Saldo Físico Actual en Planta</div>
            <div className="text-2xl font-mono font-extrabold text-black tabular-nums">
              {selectedProduct.stock}{' '}
              <span className="text-xs font-sans font-normal text-slate-500">{selectedProduct.unit}</span>
            </div>
            <div className="text-[11px] text-[#087DCD] font-semibold mt-0.5">
              Valuación: ${(selectedProduct.stock * selectedProduct.cost).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
            </div>
          </div>
        </div>
      )}

      {/* Tabla Cronológica de Kardex */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Fecha y Hora</th>
                <th className="py-3 px-4">Folio de Respaldo</th>
                <th className="py-3 px-4">Tipo Movimiento</th>
                <th className="py-3 px-4">Artículo / SKU</th>
                <th className="py-3 px-4 text-right">Entrada (+)</th>
                <th className="py-3 px-4 text-right">Salida (-)</th>
                <th className="py-3 px-4 text-right">Saldo Físico</th>
                <th className="py-3 px-4">Responsable</th>
                <th className="py-3 px-4">Detalle / Justificación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMovements.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No se registran movimientos para los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredMovements.map((mov) => {
                  const isEntry = mov.type === 'Entrada por Compra';
                  const isExit = mov.type === 'Salida por Venta / Requisición';
                  const isPositiveAdjustment = mov.type === 'Ajuste por Merma o Conteo' && mov.quantity > 0;
                  const isNegativeAdjustment = mov.type === 'Ajuste por Merma o Conteo' && mov.quantity < 0;

                  return (
                    <tr key={mov.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap font-mono tabular-nums">
                        {mov.timestamp.replace('T', ' ').substring(0, 16)}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {mov.folio}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {getMovementBadge(mov.type)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 truncate max-w-xs">{mov.productName}</div>
                        <div className="text-[11px] font-mono text-slate-400">{mov.sku}</div>
                      </td>
                      {/* Entrada (+) */}
                      <td className="py-3 px-4 text-right font-mono font-bold text-[#087DCD] tabular-nums">
                        {isEntry || isPositiveAdjustment ? `+${Math.abs(mov.quantity)}` : '-'}
                      </td>
                      {/* Salida (-) */}
                      <td className="py-3 px-4 text-right font-mono font-bold text-rose-700 tabular-nums">
                        {isExit || isNegativeAdjustment ? `-${Math.abs(mov.quantity)}` : '-'}
                      </td>
                      {/* Saldo Resultante */}
                      <td className="py-3 px-4 text-right font-mono font-extrabold text-slate-900 tabular-nums">
                        {mov.resultingStock} {mov.unit}
                      </td>
                      <td className="py-3 px-4 text-slate-700 whitespace-nowrap text-[11px]">
                        <div className="font-medium text-slate-800">{mov.responsibleUser}</div>
                        <div className="text-[10px] text-slate-400">{mov.responsibleRole}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 text-[11px] max-w-xs truncate" title={mov.notes}>
                        {mov.notes || mov.incidentNotes || 'Sin notas adicionales'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
