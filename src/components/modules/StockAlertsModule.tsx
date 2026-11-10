import React, { useState } from 'react';
import { Product } from '../../types/warehouse';
import { 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle,
  PackageCheck,
  Building,
  RefreshCw
} from 'lucide-react';

interface StockAlertsModuleProps {
  products: Product[];
  onNavigateToEntries?: () => void;
  onNavigateToTransfers?: () => void;
}

export const StockAlertsModule: React.FC<StockAlertsModuleProps> = ({
  products,
  onNavigateToEntries,
  onNavigateToTransfers,
}) => {
  const [activeTab, setActiveTab] = useState<'reorden' | 'permanencia'>('reorden');

  // 1. Productos en punto de reorden (stock actual <= stock mínimo)
  const reorderProducts = products.filter((p) => p.stock <= p.minStock);

  // 2. Productos con exceso de permanencia (>60 días sin rotación o en almacén)
  const stagnantProducts = products.filter((p) => p.daysInWarehouse >= 60);

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700">
            <AlertTriangle className="w-4 h-4" />
            <span>Módulo Táctico / Supervisión</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-0.5">
            Gestión de Alertas de Stock
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Monitoreo preventivo de productos en punto de reorden (stock mínimo crítico) y artículos con exceso de permanencia.
          </p>
        </div>

        {/* Indicadores numéricos */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Reorden: <strong>{reorderProducts.length}</strong></span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Permanencia: <strong>{stagnantProducts.length}</strong></span>
          </div>
        </div>
      </div>

      {/* Tabs segmentadas */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('reorden')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'reorden'
              ? 'bg-white text-rose-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <span>Punto de Reorden ({reorderProducts.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('permanencia')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'permanencia'
              ? 'bg-white text-amber-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-600" />
          <span>Exceso de Permanencia ({stagnantProducts.length})</span>
        </button>
      </div>

      {/* Vista 1: Punto de Reorden (Stock Mínimo) */}
      {activeTab === 'reorden' && (
        <div className="space-y-4">
          {reorderProducts.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
              <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">Inventario Óptimo</h3>
              <p className="text-xs text-slate-500 mt-1">Todos los artículos se encuentran por encima de su nivel de seguridad mínimo.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reorderProducts.map((p) => {
                const deficit = p.minStock - p.stock;
                const percentOfMin = Math.round((p.stock / p.minStock) * 100);

                return (
                  <div
                    key={p.id}
                    className="bg-white p-5 rounded-2xl border border-rose-200/90 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-mono font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          {p.sku}
                        </span>
                        <span className="text-xs font-bold text-rose-700 bg-rose-100/60 px-2 py-0.5 rounded">
                          Stock Crítico ({percentOfMin}%)
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900">{p.name}</h3>
                      <div className="text-xs text-slate-500 mt-1">
                        {p.location.warehouseName} · {p.location.binCode}
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl text-center">
                        <div>
                          <div className="text-[10px] text-slate-400">Existencia Actual</div>
                          <div className="text-base font-mono font-bold text-rose-700 tabular-nums">
                            {p.stock} {p.unit}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400">Punto de Reorden</div>
                          <div className="text-base font-mono font-bold text-slate-700 tabular-nums">
                            {p.minStock} {p.unit}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400">Déficit a Comprar</div>
                          <div className="text-base font-mono font-bold text-amber-700 tabular-nums">
                            +{deficit} {p.unit}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">
                        Costo estimado reposición: ${(deficit * p.cost).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                      </span>

                      {onNavigateToEntries && (
                        <button
                          onClick={onNavigateToEntries}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition"
                        >
                          <span>Generar Recepción</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Vista 2: Exceso de Permanencia */}
      {activeTab === 'permanencia' && (
        <div className="space-y-4">
          {stagnantProducts.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
              <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">Rotación Adecuada</h3>
              <p className="text-xs text-slate-500 mt-1">No hay insumos con más de 60 días detenidos en almacén.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stagnantProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white p-5 rounded-2xl border border-amber-200/90 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-mono font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {p.sku}
                      </span>
                      <span className="text-xs font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-700" />
                        <span>{p.daysInWarehouse} días sin rotación</span>
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">{p.name}</h3>
                    <div className="text-xs text-slate-500 mt-1">
                      Ubicación: {p.location.warehouseName} ({p.location.binCode})
                    </div>

                    <div className="mt-4 p-3 bg-amber-50/50 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Existencia inmovilizada:</span>
                        <span className="font-mono font-bold text-slate-900">{p.stock} {p.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Capital retenido:</span>
                        <span className="font-mono font-bold text-amber-900">
                          ${(p.stock * p.cost).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Último movimiento registrado:</span>
                        <span className="font-mono text-slate-700">{p.lastMovementDate.substring(0, 10)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-amber-800 font-medium">
                      Recomendación: Programar traspaso o uso en naves de cultivo
                    </span>

                    {onNavigateToTransfers && (
                      <button
                        onClick={onNavigateToTransfers}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 text-white rounded-lg text-xs font-semibold hover:bg-blue-800 transition"
                      >
                        <span>Traspasar a Nave</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
