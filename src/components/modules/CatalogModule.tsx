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
  AlertCircle
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
  const [category, setCategory] = useState<Product['category']>('Garrafones y Envases');
  const [unit, setUnit] = useState<Product['unit']>('Pieza');
  const [cost, setCost] = useState<number | ''>('');
  const [stock, setStock] = useState<number | ''>(0);
  const [minStock, setMinStock] = useState<number | ''>(50);
  const [maxStock, setMaxStock] = useState<number | ''>(500);
  const [warehouseZone, setWarehouseZone] = useState(WAREHOUSE_ZONES[0]);
  const [aisle, setAisle] = useState('Pasillo A');
  const [rack, setRack] = useState('Tarima T-01');
  const [shelf, setShelf] = useState('Nivel 1');
  const [binCode, setBinCode] = useState('A-T01-N1');

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
    setSku(`BOR-${category.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`);
    setBarcode(`750302480${Math.floor(1000 + Math.random() * 9000)}`);
    setName('');
    setCost('');
    setStock(0);
    setMinStock(50);
    setMaxStock(500);
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
      onAddProduct({
        sku: sku.trim(),
        barcode: barcode.trim() || `750302480${Math.floor(1000 + Math.random() * 9000)}`,
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
          binCode: binCode || 'A-T01-N1',
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
          <div className="flex items-center gap-2 text-xs font-semibold text-[#087DCD]">
            <PackageCheck className="w-4 h-4" />
            <span>Nivel Estratégico / Dirección</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-0.5">
            Catálogo Maestro de Productos y Presentaciones
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Administración de garrafones, botellas pet, tapas herméticas, sellos termoencogibles y consumibles de purificación.
          </p>
        </div>

        <button
          onClick={handleNew}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#087DCD] text-white rounded-xl text-xs font-semibold hover:bg-[#0667a9] transition shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Artículo</span>
        </button>
      </div>

      {successMessage && (
        <div className="flex items-center gap-3 p-4 bg-[#087DCD]/10 border border-[#087DCD]/30 text-slate-900 rounded-xl text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 text-[#087DCD] shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Formulario Modal / En línea */}
      {showForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in duration-200">
          <div className="pb-4 mb-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Boxes className="w-4 h-4 text-[#087DCD]" />
              <span>{editingProduct ? 'Editar Artículo de Catálogo' : 'Alta de Nuevo Artículo / Presentación'}</span>
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
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#087DCD]"
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
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-[#087DCD]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Categoría del Insumo / Producto *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Product['category'])}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087DCD] bg-white"
                >
                  <option value="Garrafones y Envases">Garrafones y Envases</option>
                  <option value="Tapas, Sellos y Empaque">Tapas, Sellos y Empaque</option>
                  <option value="Botellas Pet y Presentaciones Menores">Botellas Pet y Presentaciones Menores</option>
                  <option value="Químicos y Consumibles de Filtración">Químicos y Consumibles de Filtración</option>
                  <option value="Refacciones y Equipamiento de Purificación">Refacciones y Equipamiento de Purificación</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Descripción Completa del Artículo *
              </label>
              <input
                type="text"
                placeholder="ej. Garrafón 19 Litros Policarbonato Grado Alimenticio Azul"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087DCD]"
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
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087DCD] bg-white"
                >
                  <option value="Pieza">Pieza</option>
                  <option value="Caja">Caja</option>
                  <option value="Paquete">Paquete</option>
                  <option value="Rollo">Rollo</option>
                  <option value="Saco 25kg">Saco 25kg</option>
                  <option value="Garrafa 20L">Garrafa 20L</option>
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
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-[#087DCD] font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Stock Mínimo (Punto Reorden)
                </label>
                <input
                  type="number"
                  min="0"
                  value={minStock}
                  onChange={(e) => setMinStock(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-[#087DCD]"
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
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-[#087DCD]"
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
                className="px-5 py-2 bg-[#087DCD] text-white rounded-lg text-xs font-semibold hover:bg-[#0667a9] transition shadow-xs"
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
            <h3 className="text-sm font-bold text-slate-900">Artículos y Presentaciones en Catálogo</h3>
            <span className="text-xs text-slate-500">
              {filteredProducts.length} productos registrados
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por SKU, descripción o código..."
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
                <th className="py-3 px-4">SKU / Código</th>
                <th className="py-3 px-4">Artículo / Presentación</th>
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
                    No se encontraron productos con ese criterio.
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
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-700 hover:text-[#087DCD] hover:bg-[#087DCD]/10 rounded-lg transition"
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
