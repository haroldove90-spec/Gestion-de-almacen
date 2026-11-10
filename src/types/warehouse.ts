export type RoleId = 'almacenista' | 'supervisor' | 'administrador' | 'auditor';

export interface UserRole {
  id: RoleId;
  name: string;
  shortName: string;
  level: 'Nivel Operativo' | 'Nivel Táctico' | 'Nivel Estratégico' | 'Nivel Auditoría';
  description: string;
  allowedModules: ModuleId[];
  color: string;
}

export type ModuleId =
  | 'entradas'
  | 'salidas'
  | 'ubicaciones'
  | 'conteo'
  | 'ajustes'
  | 'kardex'
  | 'alertas'
  | 'transferencias'
  | 'catalogo'
  | 'reportes'
  | 'usuarios';

export interface WarehouseLocation {
  id: string;
  warehouseName: string; // ej. Almacén Central Insumos, Bodega Invernadero Norte, etc.
  aisle: string; // Pasillo (A, B, C...)
  rack: string; // Anaquel / Rack (R-01, R-02...)
  shelf: string; // Estante / Nivel (N-1, N-2, N-3...)
  binCode: string; // ej. A-01-N2
}

export interface Product {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  category: 'Semillas y Plántulas' | 'Fertilizantes y Nutrientes' | 'Sustratos y Enmiendas' | 'Riego y Tuberías' | 'Material de Empaque' | 'Herramientas y EPP';
  unit: 'Kilogramo' | 'Litro' | 'Saco 50kg' | 'Pieza' | 'Charola 200 cav' | 'Rollo 100m';
  cost: number; // Costo base unitario en $ MXN
  stock: number; // Existencia física total actual
  minStock: number; // Punto de reorden
  maxStock: number;
  location: WarehouseLocation;
  lastMovementDate: string; // ISO date
  daysInWarehouse: number; // Exceso de permanencia (>60 días en alerta)
}

export type MovementType =
  | 'Entrada por Compra'
  | 'Salida por Venta / Requisición'
  | 'Ajuste por Merma o Conteo'
  | 'Traspaso Interno';

export interface MovementRecord {
  id: string;
  timestamp: string;
  folio: string; // Folio obligatorio de respaldo (ej. OC-2026-084, NV-4091, ACTA-042, GUIA-015)
  type: MovementType;
  productId: string;
  productName: string;
  sku: string;
  quantity: number; // Positivo para entrada/ajuste positivo, negativo para salida
  previousStock: number;
  resultingStock: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  responsibleUser: string;
  responsibleRole: string;
  sourceWarehouse?: string;
  targetWarehouse?: string;
  notes?: string;
  incidentNotes?: string; // Para faltantes o daños en recepción
}

export interface CyclicCountItem {
  id: string;
  date: string;
  section: string;
  productId: string;
  productName: string;
  sku: string;
  unit: string;
  systemStock: number;
  countedStock: number;
  discrepancy: number; // countedStock - systemStock
  status: 'Verificado' | 'Discrepancia Detectada' | 'Ajuste Solicitado';
  countedBy: string;
  notes?: string;
}

export interface StockAdjustment {
  id: string;
  date: string;
  actaFolio: string; // Folio de acta de ajuste
  productId: string;
  productName: string;
  sku: string;
  type: 'Merma por caducidad/humedad' | 'Daño en maniobra' | 'Corrección por conteo cíclico' | 'Faltante no justificado';
  adjustmentQuantity: number; // Puede ser negativo o positivo
  justification: string; // Obligatorio
  approvedBySupervisor: string;
  status: 'Aprobado y Aplicado' | 'Pendiente de Revisión';
}

export interface InternalTransfer {
  id: string;
  date: string;
  guiaFolio: string; // Guía de Traslado obligatoria
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  sourceWarehouse: string;
  targetWarehouse: string;
  driverOrCarrier: string;
  authorizedBy: string;
  status: 'Completado' | 'En Tránsito';
  notes?: string;
}

export interface UserAccount {
  id: string;
  username: string;
  fullName: string;
  role: RoleId;
  email: string;
  status: 'Activo' | 'Inactivo';
  lastLogin: string;
  assignedWarehouse: string;
}

export interface ActivitySession {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  ipAddress: string;
  device: string;
}
