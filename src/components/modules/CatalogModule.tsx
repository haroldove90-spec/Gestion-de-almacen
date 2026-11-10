import React, { useState } from 'react';
import { Product } from '../../types/warehouse';
import { 
  PackageCheck, 
  Plus, 
  Search, 
  Barcode, 
  Edit3, 
  Boxes, 
  CheckCircle2, 
  AlertCircle,
  Tag
} from 'lucide-react';
import { WAREHOUSE_ZONES } from '../../data/mockData';

interface CatalogModuleProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id' | 'lastMovementDate' | 'daysInWarehouse'>) => void;
  onUpdateProduct: (id: string, updates: Partial<Product>) => void;
}

export const CatalogModule: React.FC<CatalogModuleProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form fields
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Product['category']>('Fertilizantes y Nutrientes');
  const [unit, setUnit] = useState<Product['unit']>('Saco 50kg');
  const [cost, setCost] = useState<number | ''>('');
  const [stock, setStock] = useState<number | ''>(0);
  const [minStock, setMinStock] = useState<number | ''>(20);
  const [maxStock, setMaxStock] = useState<number | ''>(100);
  const [warehouseZone, setWarehouseZone] = useState(WAREHOUSE_ZONES[0]);
  const [aisle, setAisle] = useState('Pasillo A');
  const [rack, setRack] = useState('Rack R-01');
  const [shelf, setShelf] = useState('Nivel 1');
  const [binCode, setBinCode] = useState('A-01-N1');

  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleStartEdit = (p: Product) => {
    setEditingProduct(p);
    setSku(p.sku);
    setBarcode(p.barcode);
    setName(p.name);
    setCategory(p.category);
    setUnit(p.unit);
    setCost(p.cost);
    setStock(p.stock);
    setMinStock(p.minStock);
    setMaxStock(p.maxStock);
    setWarehouseZone(p.location.warehouseName);
    setAisle(p.location.aisle);
    setRack(p.location.rack);
    setShelf(p.location.shelf);
    setBinCode(p.location.binCode);
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingProduct(null);
    setSku(`INV-${category.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`);
    setBarcode(`750105530${Math.floor(1000 + Math.random() * 9000)}`);
    setName('');
    setCost('');
    setStock(0);
    setMinStock(20);
    setMaxStock(100);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!sku.trim() || !name.trim()) {
      setFormError('El SKU y la descripción del producto son obligatorios.');
      return;
    }

    if (cost === '' || Number(cost) < 0) {
      setFormError('El costo base debe ser un valor numérico igual o mayor a 0.');
      return;
    }

    if (editingProduct) {
      // Update
      onUpdateProduct(editingProduct.id, {
        sku: sku.trim(),
        barcode: barcode.trim(),
        name: name.trim(),
        category,
        unit,
        cost: Number(cost),
        minStock: Number(minStock) || 10,
        maxStock: Number(maxStock) || 100,
        location: {
          id: editingProduct.location.id,
          warehouseName: warehouseZone,
          aisle,
          rack,
          shelf,
          binCode,
        },
      });

      setSuccessMessage(`Artículo ${sku} actualizado con éxito en el Catálogo Maestro.`);
    } else {
      // Add
      onAddProduct({
        sku: sku.trim(),
        barcode: barcode.trim() || `750105530${Math.floor(1000 + Math.random() * 9000)}`,
        name: name.trim(),
        category,
        unit,
        cost: Number(cost),
        stock: Number(stock) || 0,
        minStock: Number(minStock) || 10,
        maxStock: Number(maxStock) || 100,
        location: {
          id: `loc-${Date.now()}`,
          warehouseName: warehouseZone,
          aisle,
          rack,
          shelf,
          binCode: binCode || 'A-01-N1',
        },
      });

      setSuccessMessage(`Nuevo artículo ${sku} registrado en el Catálogo Maestro.`);
    }

    setShowForm(false);
    setEditingProduct(null);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.barcode.includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700">
            <PackageCheck className="w-4 h-4" />
            <span>Nivel Estratégico / Administración</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-0.5">
            Catálogo Maestro de Productos
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Administración de artículos: SKU, código de barras, categorías agrícolas, unidades de medida y costos base.
          </p>
        </div>

        <button
          onClick={handleNew}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-700 text-white rounded-xl text-xs font-semibold hover:bg-amber-800 transition shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Artículo</span>
        </button>
      </div>

      {successMessage && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Formulario Modal / En línea */}
      {showForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in duration-200">
          <div className="pb-4 mb-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Boxes className="w-4 h-4 text-amber-600" />
              <span>{editingProduct ? 'Editar Artículo de Catálogo' : 'Alta de Nuevo Artículo'}</span>
            </h3>
            <span className="text-xs font-mono font-bold text-slate-500">{sku}</span>
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
                  Código Interno / SKU *
                </label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Código de Barras (EAN-13)
                </label>
                <div className="relative">
                  <Barcode className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Categoría del Insumo *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Product['category'])}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 bg-white"
                >
                  <option value="Semillas y Plántulas">Semillas y Plántulas</option>
                  <option value="Fertilizantes y Nutrientes">Fertilizantes y Nutrientes</option>
                  <option value="Sustratos y Enmiendas">Sustratos y Enmiendas</option>
                  <option value="Riego y Tuberías">Riego y Tuberías</option>
                  <option value="Material de Empaque">Material de Empaque</option>
                  <option value="Herramientas y EPP">Herramientas y EPP</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Descripción Completa del Artículo *
              </label>
              <input
                type="text"
                placeholder="ej. Nitrato de Potasio Cristalino Alta Pureza (Saco 25kg)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Unidad de Medida *
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as Product['unit'])}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 bg-white"
                >
                  <option value="Kilogramo">Kilogramo</option>
                  <option value="Litro">Litro</option>
                  <option value="Saco 50kg">Saco 50kg</option>
                  <option value="Pieza">Pieza</option>
                  <option value="Charola 200 cav">Charola 200 cav</option>
                  <option value="Rollo 100m">Rollo 100m</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Costo Base Unitario ($ MXN) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={cost}
                  onChange={(e) => setCost(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-amber-600 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Stock Mínimo (Reorden)
                </label>
                <input
                  type="number"
                  min="0"
                  value={minStock}
                  onChange={(e) => setMinStock(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Stock Máximo
                </label>
                <input
                  type="number"
                  min="0"
                  value={maxStock}
                  onChange={(e) => setMaxStock(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                }}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-700 text-white rounded-lg text-xs font-semibold hover:bg-amber-800 transition shadow-xs"
              >
                {editingProduct ? 'Guardar Cambios' : 'Registrar en Catálogo'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla del Catálogo Maestro */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Artículos Registrados en el Sistema</h3>
            <span className="text-xs text-slate-500">
              {filteredProducts.length} productos en catálogo
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por SKU, nombre o código..."
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
                <th className="py-3 px-4">SKU / Código</th>
                <th className="py-3 px-4">Artículo</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4">Unidad</th>
                <th className="py-3 px-4 text-right">Costo Base</th>
                <th className="py-3 px-4 text-right">Stock Físico</th>
                <th className="py-3 px-4 text-right">Punto Reorden</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No se encontraron productos.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      <div>{p.sku}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{p.barcode}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{p.name}</div>
                      <div className="text-[11px] text-slate-400">{p.location.warehouseName} ({p.location.binCode})</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-[11px]">
                      {p.category}
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-[11px]">
                      {p.unit}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-800 tabular-nums">
                      ${p.cost.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold tabular-nums">
                      <span className={p.stock <= p.minStock ? 'text-rose-600' : 'text-slate-900'}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600 tabular-nums">
                      {p.minStock}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleStartEdit(p)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-700 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Editar</span>
                      </button>
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
