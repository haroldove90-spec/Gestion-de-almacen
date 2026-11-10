import { useState, useEffect } from 'react';
import {
  RoleId,
  ModuleId,
  Product,
  MovementRecord,
  CyclicCountItem,
  StockAdjustment,
  InternalTransfer,
  UserAccount,
  ActivitySession,
  WarehouseLocation,
} from '../types/warehouse';
import {
  SYSTEM_ROLES,
  INITIAL_PRODUCTS,
  INITIAL_MOVEMENTS,
  INITIAL_CYCLIC_COUNTS,
  INITIAL_ADJUSTMENTS,
  INITIAL_TRANSFERS,
  INITIAL_USERS,
  INITIAL_SESSIONS,
} from '../data/mockData';

const STORAGE_KEYS = {
  CURRENT_ROLE: 'borneo_current_role',
  CURRENT_MODULE: 'borneo_current_module',
  PRODUCTS: 'borneo_products_v2',
  MOVEMENTS: 'borneo_movements_v2',
  COUNTS: 'borneo_counts_v2',
  ADJUSTMENTS: 'borneo_adjustments_v2',
  TRANSFERS: 'borneo_transfers_v2',
  USERS: 'borneo_users_v2',
  SESSIONS: 'borneo_sessions_v2',
};

export function useWarehouse() {
  const [currentRole, setCurrentRole] = useState<RoleId | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_ROLE);
    return (saved as RoleId) || null;
  });

  const [currentModule, setCurrentModule] = useState<ModuleId>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_MODULE);
    return (saved as ModuleId) || 'entradas';
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [movements, setMovements] = useState<MovementRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MOVEMENTS);
      return saved ? JSON.parse(saved) : INITIAL_MOVEMENTS;
    } catch {
      return INITIAL_MOVEMENTS;
    }
  });

  const [cyclicCounts, setCyclicCounts] = useState<CyclicCountItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COUNTS);
      return saved ? JSON.parse(saved) : INITIAL_CYCLIC_COUNTS;
    } catch {
      return INITIAL_CYCLIC_COUNTS;
    }
  });

  const [adjustments, setAdjustments] = useState<StockAdjustment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADJUSTMENTS);
      return saved ? JSON.parse(saved) : INITIAL_ADJUSTMENTS;
    } catch {
      return INITIAL_ADJUSTMENTS;
    }
  });

  const [transfers, setTransfers] = useState<InternalTransfer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSFERS);
      return saved ? JSON.parse(saved) : INITIAL_TRANSFERS;
    } catch {
      return INITIAL_TRANSFERS;
    }
  });

  const [users, setUsers] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [sessions, setSessions] = useState<ActivitySession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return saved ? JSON.parse(saved) : INITIAL_SESSIONS;
    } catch {
      return INITIAL_SESSIONS;
    }
  });

  // Sync state to local storage
  useEffect(() => {
    if (currentRole) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, currentRole);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_ROLE);
    }
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_MODULE, currentModule);
  }, [currentModule]);

  // Guard: ensure current module is strictly one of the active role's allowed modules
  useEffect(() => {
    if (!currentRole) return;
    const roleObj = SYSTEM_ROLES.find((r) => r.id === currentRole);
    if (roleObj && !roleObj.allowedModules.includes(currentModule)) {
      setCurrentModule(roleObj.allowedModules[0]);
    }
  }, [currentRole, currentModule]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify(movements));
  }, [movements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COUNTS, JSON.stringify(cyclicCounts));
  }, [cyclicCounts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADJUSTMENTS, JSON.stringify(adjustments));
  }, [adjustments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSFERS, JSON.stringify(transfers));
  }, [transfers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  }, [sessions]);

  // Log an activity entry
  const logActivity = (action: string) => {
    const roleObj = SYSTEM_ROLES.find((r) => r.id === currentRole);
    const newSession: ActivitySession = {
      id: `ses-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: roleObj ? roleObj.name : 'Usuario',
      role: roleObj ? roleObj.level : 'Operativo',
      action,
      ipAddress: '192.168.1.' + Math.floor(100 + Math.random() * 50),
      device: typeof navigator !== 'undefined' ? (navigator.userAgent.includes('Mobile') ? 'Terminal Móvil PWA' : 'Workstation Desktop') : 'Dispositivo Web',
    };
    setSessions((prev) => [newSession, ...prev]);
  };

  const selectRole = (roleId: RoleId) => {
    setCurrentRole(roleId);
    const roleObj = SYSTEM_ROLES.find((r) => r.id === roleId);
    if (roleObj && roleObj.allowedModules.length > 0) {
      // Set to first allowed module
      setCurrentModule(roleObj.allowedModules[0]);
    }
    const newSession: ActivitySession = {
      id: `ses-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: roleObj ? roleObj.name : roleId,
      role: roleObj ? roleObj.level : 'Operativo',
      action: `Inicio de sesión con perfil ${roleObj?.name}`,
      ipAddress: '192.168.1.102',
      device: typeof navigator !== 'undefined' ? (navigator.userAgent.includes('Mobile') ? 'Móvil / PWA' : 'Escritorio') : 'Dispositivo Web',
    };
    setSessions((prev) => [newSession, ...prev]);
  };

  const logout = () => {
    logActivity('Cierre de sesión');
    setCurrentRole(null);
  };

  // 1. Registro de Entradas (Recepciones) - Suma (+) existencias
  const registerEntry = (params: {
    folio: string; // Orden de compra o Factura obligatoria
    productId: string;
    quantity: number;
    supplier: string;
    targetWarehouse: string;
    notes?: string;
    incidentNotes?: string;
    responsibleName?: string;
  }) => {
    const product = products.find((p) => p.id === params.productId);
    if (!product) throw new Error('Producto no encontrado');

    const previousStock = product.stock;
    const newStock = previousStock + params.quantity;
    const totalCost = params.quantity * product.cost;

    const newMovement: MovementRecord = {
      id: `mov-${Date.now()}`,
      timestamp: new Date().toISOString(),
      folio: params.folio.trim(),
      type: 'Entrada por Compra',
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      quantity: params.quantity,
      previousStock,
      resultingStock: newStock,
      unit: product.unit,
      unitCost: product.cost,
      totalCost,
      responsibleUser: params.responsibleName || 'Carlos Méndez (Almacenista)',
      responsibleRole: 'Almacenista',
      sourceWarehouse: params.supplier,
      targetWarehouse: params.targetWarehouse,
      notes: params.notes,
      incidentNotes: params.incidentNotes,
    };

    // Update product stock and last movement
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id
          ? {
              ...p,
              stock: newStock,
              lastMovementDate: new Date().toISOString(),
              daysInWarehouse: 0, // Reset days in warehouse
            }
          : p
      )
    );

    setMovements((prev) => [newMovement, ...prev]);
    logActivity(`Entrada por compra Folio: ${params.folio} (+${params.quantity} ${product.unit} de ${product.sku})`);
    return newMovement;
  };

  // 2. Registro de Salidas (Despachos) - Resta (-) existencias con validación
  const registerExit = (params: {
    folio: string; // Nota de Venta / Pedido de Entrega
    productId: string;
    quantity: number;
    destination: string;
    sourceWarehouse: string;
    notes?: string;
    responsibleName?: string;
  }) => {
    const product = products.find((p) => p.id === params.productId);
    if (!product) throw new Error('Producto no encontrado');

    if (params.quantity > product.stock) {
      throw new Error(`Stock insuficiente. Disponible: ${product.stock} ${product.unit}, Solicitado: ${params.quantity} ${product.unit}`);
    }

    const previousStock = product.stock;
    const newStock = previousStock - params.quantity;
    const totalCost = params.quantity * product.cost;

    const newMovement: MovementRecord = {
      id: `mov-${Date.now()}`,
      timestamp: new Date().toISOString(),
      folio: params.folio.trim(),
      type: 'Salida por Venta / Requisición',
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      quantity: -params.quantity,
      previousStock,
      resultingStock: newStock,
      unit: product.unit,
      unitCost: product.cost,
      totalCost,
      responsibleUser: params.responsibleName || 'Carlos Méndez (Almacenista)',
      responsibleRole: 'Almacenista',
      sourceWarehouse: params.sourceWarehouse,
      targetWarehouse: params.destination,
      notes: params.notes,
    };

    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id
          ? {
              ...p,
              stock: newStock,
              lastMovementDate: new Date().toISOString(),
            }
          : p
      )
    );

    setMovements((prev) => [newMovement, ...prev]);
    logActivity(`Salida/Despacho Folio: ${params.folio} (-${params.quantity} ${product.unit} de ${product.sku})`);
    return newMovement;
  };

  // 3. Conteo Cíclico
  const registerCyclicCount = (params: {
    productId: string;
    section: string;
    countedStock: number;
    notes?: string;
    countedBy: string;
  }) => {
    const product = products.find((p) => p.id === params.productId);
    if (!product) throw new Error('Producto no encontrado');

    const discrepancy = params.countedStock - product.stock;
    const newItem: CyclicCountItem = {
      id: `cyc-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      section: params.section,
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      unit: product.unit,
      systemStock: product.stock,
      countedStock: params.countedStock,
      discrepancy,
      status: discrepancy === 0 ? 'Verificado' : 'Discrepancia Detectada',
      countedBy: params.countedBy,
      notes: params.notes,
    };

    setCyclicCounts((prev) => [newItem, ...prev]);
    logActivity(`Conteo cíclico registrado para ${product.sku}. Discrepancia: ${discrepancy > 0 ? '+' : ''}${discrepancy} ${product.unit}`);
    return newItem;
  };

  // 4. Ajustes de Inventario (Supervisor) - Justificación obligatoria y acta
  const registerAdjustment = (params: {
    actaFolio: string; // Folio Acta de Ajuste obligatoria
    productId: string;
    type: StockAdjustment['type'];
    adjustmentQuantity: number; // (+ o -)
    justification: string; // Obligatorio
    supervisorName: string;
  }) => {
    if (!params.justification || params.justification.trim().length < 8) {
      throw new Error('La justificación obligatoria debe tener al menos 8 caracteres explicativos.');
    }

    const product = products.find((p) => p.id === params.productId);
    if (!product) throw new Error('Producto no encontrado');

    const previousStock = product.stock;
    const newStock = previousStock + params.adjustmentQuantity;
    if (newStock < 0) {
      throw new Error('El ajuste no puede dejar el stock físico en número negativo.');
    }

    const newAdjustment: StockAdjustment = {
      id: `adj-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      actaFolio: params.actaFolio.trim(),
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      type: params.type,
      adjustmentQuantity: params.adjustmentQuantity,
      justification: params.justification.trim(),
      approvedBySupervisor: params.supervisorName,
      status: 'Aprobado y Aplicado',
    };

    const newMovement: MovementRecord = {
      id: `mov-${Date.now()}`,
      timestamp: new Date().toISOString(),
      folio: params.actaFolio.trim(),
      type: 'Ajuste por Merma o Conteo',
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      quantity: params.adjustmentQuantity,
      previousStock,
      resultingStock: newStock,
      unit: product.unit,
      unitCost: product.cost,
      totalCost: Math.abs(params.adjustmentQuantity) * product.cost,
      responsibleUser: params.supervisorName,
      responsibleRole: 'Supervisor',
      sourceWarehouse: product.location.warehouseName,
      notes: `Acta: ${params.actaFolio}. Motivo: ${params.type}. Justificación: ${params.justification}`,
    };

    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id
          ? {
              ...p,
              stock: newStock,
              lastMovementDate: new Date().toISOString(),
            }
          : p
      )
    );

    setAdjustments((prev) => [newAdjustment, ...prev]);
    setMovements((prev) => [newMovement, ...prev]);
    logActivity(`Ajuste de inventario autorizado con ${params.actaFolio} (${params.adjustmentQuantity > 0 ? '+' : ''}${params.adjustmentQuantity} en ${product.sku})`);
    return newAdjustment;
  };

  // 5. Transferencias Internas (Supervisor)
  const registerTransfer = (params: {
    guiaFolio: string;
    productId: string;
    quantity: number;
    sourceWarehouse: string;
    targetWarehouse: string;
    driverOrCarrier: string;
    authorizedBy: string;
    notes?: string;
  }) => {
    const product = products.find((p) => p.id === params.productId);
    if (!product) throw new Error('Producto no encontrado');

    if (params.quantity > product.stock) {
      throw new Error(`Cantidad insuficiente para transferir. Stock disponible: ${product.stock}`);
    }

    const newTransfer: InternalTransfer = {
      id: `tra-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      guiaFolio: params.guiaFolio.trim(),
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      quantity: params.quantity,
      sourceWarehouse: params.sourceWarehouse,
      targetWarehouse: params.targetWarehouse,
      driverOrCarrier: params.driverOrCarrier,
      authorizedBy: params.authorizedBy,
      status: 'Completado',
      notes: params.notes,
    };

    const newMovement: MovementRecord = {
      id: `mov-${Date.now()}`,
      timestamp: new Date().toISOString(),
      folio: params.guiaFolio.trim(),
      type: 'Traspaso Interno',
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      quantity: params.quantity,
      previousStock: product.stock,
      resultingStock: product.stock, // Reubicación neutra
      unit: product.unit,
      unitCost: product.cost,
      totalCost: params.quantity * product.cost,
      responsibleUser: params.authorizedBy,
      responsibleRole: 'Supervisor',
      sourceWarehouse: params.sourceWarehouse,
      targetWarehouse: params.targetWarehouse,
      notes: `Guía: ${params.guiaFolio}. Chofer/Transporte: ${params.driverOrCarrier}. ${params.notes || ''}`,
    };

    setTransfers((prev) => [newTransfer, ...prev]);
    setMovements((prev) => [newMovement, ...prev]);
    logActivity(`Transferencia Interna Guía: ${params.guiaFolio} (${params.quantity} ${product.unit} de ${params.sourceWarehouse} a ${params.targetWarehouse})`);
    return newTransfer;
  };

  // 6. Catálogo Maestro de Productos
  const addProduct = (newProduct: Omit<Product, 'id' | 'lastMovementDate' | 'daysInWarehouse'>) => {
    const created: Product = {
      ...newProduct,
      id: `prod-${Date.now()}`,
      lastMovementDate: new Date().toISOString(),
      daysInWarehouse: 0,
    };
    setProducts((prev) => [created, ...prev]);
    logActivity(`Alta de nuevo artículo en Catálogo: ${created.sku} - ${created.name}`);
    return created;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    logActivity(`Actualización de datos para artículo ID: ${id}`);
  };

  const updateLocation = (productId: string, location: WarehouseLocation) => {
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, location } : p)));
    logActivity(`Reubicación física de producto: ${location.warehouseName} / ${location.binCode}`);
  };

  // 7. Gestión de Usuarios
  const addUser = (newUser: Omit<UserAccount, 'id' | 'lastLogin'>) => {
    const created: UserAccount = {
      ...newUser,
      id: `usr-${Date.now()}`,
      lastLogin: 'Nunca (Nueva cuenta)',
    };
    setUsers((prev) => [...prev, created]);
    logActivity(`Nueva cuenta de usuario creada: ${created.username} (${created.role})`);
    return created;
  };

  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === 'Activo' ? 'Inactivo' : 'Activo' } : u
      )
    );
  };

  return {
    currentRole,
    currentModule,
    setCurrentModule,
    selectRole,
    logout,
    products,
    movements,
    cyclicCounts,
    adjustments,
    transfers,
    users,
    sessions,
    registerEntry,
    registerExit,
    registerCyclicCount,
    registerAdjustment,
    registerTransfer,
    addProduct,
    updateProduct,
    updateLocation,
    addUser,
    toggleUserStatus,
  };
}
