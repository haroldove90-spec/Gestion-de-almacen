import React, { useState } from 'react';
import { Product, MovementRecord } from '../../types/warehouse';
import { 
  BarChart3, 
  Download, 
  Printer, 
  DollarSign, 
  TrendingUp, 
  PieChart, 
  FileSpreadsheet,
  Building,
  Layers
} from 'lucide-react';

interface ReportsModuleProps {
  products: Product[];
  movements: MovementRecord[];
}

export const ReportsModule: React.FC<ReportsModuleProps> = ({
  products,
  movements,
}) => {
  const [reportType, setReportType] = useState<'valuacion' | 'rotacion' | 'movimientos'>('valuacion');

  // Cálculos de Valuación
  const totalValuation = products.reduce((acc, p) => acc + p.stock * p.cost, 0);
  const totalPhysicalUnits = products.reduce((acc, p) => acc + p.stock, 0);

  // Valuación por Categoría
  const valuationByCategory = products.reduce((acc, p) => {
    const current = acc[p.category] || { totalCost: 0, totalUnits: 0, itemsCount: 0 };
    acc[p.category] = {
      totalCost: current.totalCost + p.stock * p.cost,
      totalUnits: current.totalUnits + p.stock,
      itemsCount: current.itemsCount + 1,
    };
    return acc;
  }, {} as Record<string, { totalCost: number; totalUnits: number; itemsCount: number }>);

  // Valuación por Almacén / Bodega
  const valuationByWarehouse = products.reduce((acc, p) => {
    const wh = p.location.warehouseName;
    const current = acc[wh] || { totalCost: 0, totalUnits: 0 };
    acc[wh] = {
      totalCost: current.totalCost + p.stock * p.cost,
      totalUnits: current.totalUnits + p.stock,
    };
    return acc;
  }, {} as Record<string, { totalCost: number; totalUnits: number }>);

  // Exportar a CSV (Excel)
  const handleExportCSV = () => {
    let csvContent = '';

    if (reportType === 'valuacion') {
      csvContent = 'SKU,Producto,Categoria,Unidad,Existencia,Costo_Unitario_MXN,Valuacion_Total_MXN,Almacen,Posicion\n';
      products.forEach((p) => {
        const val = p.stock * p.cost;
        csvContent += `"${p.sku}","${p.name}","${p.category}","${p.unit}",${p.stock},${p.cost.toFixed(2)},${val.toFixed(2)},"${p.location.warehouseName}","${p.location.binCode}"\n`;
      });
    } else {
      csvContent = 'Folio,Fecha,Tipo_Movimiento,SKU,Producto,Cantidad,Stock_Resultante,Responsable,Almacen,Notas\n';
      movements.forEach((m) => {
        csvContent += `"${m.folio}","${m.timestamp}","${m.type}","${m.sku}","${m.productName}",${m.quantity},${m.resultingStock},"${m.responsibleUser}","${m.sourceWarehouse || m.targetWarehouse || ''}","${m.notes || ''}"\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `InvernaderoFutura_${reportType}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:m-0 print:p-0">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700">
            <BarChart3 className="w-4 h-4" />
            <span>Nivel Estratégico / Dirección</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-0.5">
            Reportes y Valuación de Existencias
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Reporte de existencias valorizadas en almacén, rotación de inventarios y exportación de movimientos a Excel/PDF.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold hover:bg-emerald-800 transition shadow-xs"
            title="Descargar archivo compatible con Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-300 text-slate-700 bg-white rounded-xl text-xs font-medium hover:bg-slate-50 transition"
            title="Imprimir o guardar como PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir / PDF</span>
          </button>
        </div>
      </div>

      {/* Tarjetas KPI de Valuación Total */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Valor Total del Inventario</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-slate-900 tabular-nums">
            ${totalValuation.toLocaleString('es-MX', { minimumFractionDigits: 2 })} <span className="text-xs font-normal text-slate-500 font-sans">MXN</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Calculado en base al costo unitario base
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Existencias Físicas Totales</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-slate-900 tabular-nums">
            {totalPhysicalUnits.toLocaleString('es-MX')} <span className="text-xs font-normal text-slate-500 font-sans">unidades</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Distribuidas en {products.length} artículos del catálogo
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Tasa Media de Rotación</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-slate-900 tabular-nums">
            28.4 <span className="text-xs font-normal text-slate-500 font-sans">días ciclo</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            Nivel saludable para operación agrícola
          </div>
        </div>
      </div>

      {/* Desglose por Categoría y por Bodega */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Por Categoría */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-emerald-600" />
            <span>Valuación por Categoría de Insumos</span>
          </h3>

          <div className="space-y-3">
            {Object.entries(valuationByCategory).map(([catName, data]) => {
              const percent = totalValuation > 0 ? (data.totalCost / totalValuation) * 100 : 0;

              return (
                <div key={catName} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{catName}</span>
                    <span className="font-mono font-bold text-slate-900 tabular-nums">
                      ${data.totalCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN ({percent.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {data.itemsCount} productos · {data.totalUnits} unidades en existencias
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Por Almacén / Bodega */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-600" />
            <span>Distribución de Capital por Bodega</span>
          </h3>

          <div className="space-y-3">
            {Object.entries(valuationByWarehouse).map(([whName, data]) => {
              const percent = totalValuation > 0 ? (data.totalCost / totalValuation) * 100 : 0;

              return (
                <div key={whName} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 truncate">{whName}</span>
                    <span className="font-mono font-bold text-blue-900 tabular-nums">
                      ${data.totalCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>{data.totalUnits} unidades físicas</span>
                    <span>{percent.toFixed(1)}% del valor total</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabla detallada de Existencias Valorizadas */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200/90 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Detalle de Existencias Valorizadas por SKU</h3>
          <span className="text-xs text-slate-500">{products.length} artículos evaluados</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Artículo</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4 text-right">Existencia</th>
                <th className="py-3 px-4 text-right">Costo Base</th>
                <th className="py-3 px-4 text-right">Valuación Total</th>
                <th className="py-3 px-4">Almacén Asignado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => {
                const itemVal = p.stock * p.cost;
                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {p.sku}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {p.name}
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-[11px]">
                      {p.category}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {p.stock} <span className="text-[10px] font-normal text-slate-400">{p.unit}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600 tabular-nums">
                      ${p.cost.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-extrabold text-emerald-800 tabular-nums">
                      ${itemVal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-[11px]">
                      {p.location.warehouseName} ({p.location.binCode})
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
