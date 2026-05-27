export type MaintenanceStatus = "active" | "paused" | "expired" | "cancelled";
export type BillingType = "monthly" | "yearly";

export interface MaintenanceClientSummary {
  id: string;
  name: string;
  email: string;
}

export interface MaintenanceContract {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  serviceName: string;
  billingType: BillingType;
  price: number;
  startDate: string;
  nextDueDate: string;
  status: MaintenanceStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiMaintenanceContract {
  _id: string;
  client: {
    _id: string;
    name: string;
    email: string;
  };
  serviceName: string;
  billingType: BillingType;
  price: number;
  startDate: string;
  nextDueDate: string;
  status: MaintenanceStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenancePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface MaintenanceListResponse {
  success: boolean;
  message: string;
  data: {
    contracts: ApiMaintenanceContract[];
    pagination: MaintenancePagination;
  };
}

export interface MaintenanceDetailResponse {
  success: boolean;
  message: string;
  data: {
    contract: ApiMaintenanceContract;
  };
}

export interface CreateMaintenanceRequest {
  client: string;
  serviceName: string;
  billingType: BillingType;
  price: number;
  startDate: string;
  nextDueDate: string;
  status?: MaintenanceStatus;
  notes?: string;
}

export interface UpdateMaintenanceRequest {
  client?: string;
  serviceName?: string;
  billingType?: BillingType;
  price?: number;
  startDate?: string;
  nextDueDate?: string;
  status?: MaintenanceStatus;
  notes?: string;
}
