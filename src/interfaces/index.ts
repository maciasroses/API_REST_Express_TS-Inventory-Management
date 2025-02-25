export interface IStore {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface IProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  sku: string;
  created_at: string;
  updated_at: string;
  stock: number;
  storeid?: string;
}

export interface IInventory {
  id: string;
  productId: string;
  storeId: string;
  quantity: number;
  minStock: number;
  created_at: string;
  updated_at: string;
}

type MovementType = "IN" | "OUT" | "TRANSFER";

export interface IMovement {
  id: string;
  productId: string;
  sourceStoreId?: string | null;
  targetStoreId?: string | null;
  quantity: number;
  timestamp: string;
  type: MovementType;
  created_at: string;
  updated_at: string;
}

export interface IStoreModel {
  getStoreById(storeId: string): Promise<IStore | null>;
}

export interface IProductModel {
  getAllProducts({
    category,
    minPrice,
    maxPrice,
    minStock,
    maxStock,
    page,
    limit,
  }: IProductSearchParams): Promise<{
    data: IProduct[];
    pagination: {
      total: number;
      page: number;
      page_size: number;
      total_pages: number;
      has_next: boolean;
      has_previous: boolean;
    };
  }>;
  getProductById(id: string): Promise<IProduct | null>;
  getProductBySku(sku: string): Promise<IProduct | null>;
  createProduct({
    name,
    description,
    category,
    price,
    sku,
  }: IProductCreateNUpdate): Promise<IProduct>;
  updateProduct(id: string, data: IProductCreateNUpdate): Promise<IProduct>;
  deleteProduct(id: string): Promise<void>;
}

export interface IProductSearchParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minStock?: number;
  maxStock?: number;
  page?: number;
  limit?: number;
}

export interface IProductCreateNUpdate {
  name: string;
  description: string;
  category: string;
  price: number;
  sku: string;
  storeId: string;
  quantity: number;
  minStock: number;
}

export interface IInventoryModel {
  getInventoryByStoreId(storeId: string): Promise<IInventory[]>;
  getStockByProductIdNStoreId(
    productId: string,
    storeId: string
  ): Promise<number>;
  transferProduct({
    productId,
    sourceStoreId,
    targetStoreId,
    quantity,
    timestamp,
  }: IInventoryTransfer): Promise<void>;
  getLowStockAlerts(): Promise<IInventory[]>;
}

export interface IInventoryTransfer {
  productId: string;
  sourceStoreId: string;
  targetStoreId: string;
  quantity: number;
  timestamp: string;
}
