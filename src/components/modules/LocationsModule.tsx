import React, { useState } from 'react';
import { Product, WarehouseLocation } from '../../types/warehouse';
import { 
  MapPin, 
  Search, 
  Edit3, 
  Check, 
  X, 
  Layers, 
  Boxes,
  Building,
  Navigation
} from 'lucide-react';
import { WAREHOUSE_ZONES } from '../../data/mockData';

interface LocationsModuleProps {
  products: Product[];
  onUpdateLocation: (productId: string, location: WarehouseLocation) => void;
}

export const LocationsModule: React.FC<LocationsModuleProps> = ({
  products,
  onUpdateLocation,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('Todos');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Edit state
  const [editZone, setEditZone] = useState('');
  const [editAisle, setEditAisle] = useState('');
  const [editRack, setEditRack] = useState('');
  const [editShelf, setEditShelf] = useState('');
  const [editBinCode, setEditBinCode] = useState('');

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.binCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.aisle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesZone = selectedZone === 'Todos' || p.location.warehouseName === selectedZone;

    return matchesSearch && matchesZone;
  });

  const handleStartEdit = (p: Product) => {
    setEditingProductId(p.id);
    setEditZone(p.location.warehouseName);
    setEditAisle(p.location.aisle);
    setEditRack(p.location.rack);
    setEditShelf(p.location.shelf);
    setEditBinCode(p.location.binCode);
  };

  const handleSaveEdit = (productId: string) => {
    onUpdateLocation(productId, {
      id: `loc-${Date.now()}`,
      warehouseName: editZone,
      aisle: editAisle,
      rack: editRack,
      shelf: editShelf,
      binCode: editBinCode || `${editAisle.slice(0, 1).toUpperCase()}-${editRack.slice(-2)}-${editShelf.slice(0, 2)}`,
    });
    setEditingProductId(null);
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#087DCD]">
            <MapPin className="w-4 h-4" />
            <span>Módulo Operativo</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-0.5">
            Ubicaciones, Racks y Tarimas
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Asignación y consulta rápida del lugar físico de guardado (área de planta, pasillo, tarima/rack, estante y código de posición).
          </p>
        </div>

        {/* Zona resumen */}
        <div className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
          <Boxes className="w-4 h-4 text-[#087DCD] shrink-0" />
          <span>{products.length} artículos ubicados en planta</span>
        </div>
      </div>

      {/* Filtros rápidos por Bodega / Zona */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Área:</span>
          <button
            onClick={() => setSelectedZone('Todos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedZone === 'Todos'
                ? 'bg-black text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Todas las Áreas
          </button>
          {WAREHOUSE_ZONES.map((zone) => (
            <button
              key={zone}
              onClick={() => setSelectedZone(zone)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedZone === zone
                  ? 'bg-[#087DCD] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {zone}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por SKU, pasillo o bin code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087DCD]"
          />
        </div>
      </div>

      {/* Grilla de Ubicaciones Físicas y Racks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((p) => {
          const isEditing = editingProductId === p.id;

          return (
            <div
              key={p.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-bold text-[#087DCD] bg-[#087DCD]/10 px-2 py-0.5 rounded-md border border-[#087DCD]/20">
                    {p.sku}
                  </span>
                  <span className="text-xs font-bold text-slate-900 font-mono tabular-nums">
                    {p.stock} {p.unit}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug mb-3">
                  {p.name}
                </h3>

                {isEditing ? (
                  <div className="space-y-2 pt-2 border-t border-slate-100 animate-in fade-in">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500">Área de Planta</label>
                      <select
                        value={editZone}
                        onChange={(e) => setEditZone(e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                      >
                        {WAREHOUSE_ZONES.map((z) => (
                          <option key={z} value={z}>{z}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500">Pasillo</label>
                        <input
                          type="text"
                          value={editAisle}
                          onChange={(e) => setEditAisle(e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500">Tarima / Rack</label>
                        <input
                          type="text"
                          value={editRack}
                          onChange={(e) => setEditRack(e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500">Estante / Nivel</label>
                        <input
                          type="text"
                          value={editShelf}
                          onChange={(e) => setEditShelf(e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500">Código Bin</label>
                        <input
                          type="text"
                          value={editBinCode}
                          onChange={(e) => setEditBinCode(e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{p.location.warehouseName}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{p.location.aisle}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{p.location.rack} · {p.location.shelf}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1 font-mono text-xs font-bold text-slate-900">
                  <span className="text-[10px] text-slate-400 font-sans font-normal">Posición:</span>
                  <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-800">{p.location.binCode}</span>
                </div>

                {isEditing ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleSaveEdit(p.id)}
                      className="p-1.5 bg-[#087DCD] text-white rounded-lg hover:bg-[#0667a9] transition"
                      title="Guardar ubicación"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEditingProductId(null)}
                      className="p-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition"
                      title="Cancelar"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleStartEdit(p)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-700 hover:text-[#087DCD] hover:bg-[#087DCD]/10 rounded-lg transition"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Reubicar</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
