export type InvoiceStatus =
  | "draft"
  | "sent"
  | "paid"
  | "overdue"
  | "cancelled";

export interface InvoiceItem {
  id: string;
  description: string;
  qty: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  maintenanceId?: string;
  maintenanceName?: string;
  items: InvoiceItem[];
  subtotal: number;
  total: number;
  invoiceDate: string;
  dueDate: string;
  paidAt?: string | null;
  status: InvoiceStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiInvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface ApiInvoice {
  _id: string;
  invoiceNumber: string;
  client: {
    _id: string;
    name: string;
    email: string;
  };
  maintenance: {
    _id: string;
    serviceName: string;
  } | null;
  items: ApiInvoiceItem[];
  subtotal: number;
  total: number;
  invoiceDate: string;
  dueDate: string;
  paidAt: string | null;
  status: InvoiceStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoicePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface InvoiceListResponse {
  success: boolean;
  message: string;
  data: {
    invoices: ApiInvoice[];
    pagination: InvoicePagination;
  };
}

export interface InvoiceDetailResponse {
  success: boolean;
  message: string;
  data: {
    invoice: ApiInvoice;
  };
}

export interface CreateInvoiceItemRequest {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateInvoiceRequest {
  invoiceNumber: string;
  client: string;
  maintenance?: string;
  items: CreateInvoiceItemRequest[];
  invoiceDate: string;
  dueDate: string;
  status?: InvoiceStatus;
  notes?: string;
}

export interface UpdateInvoiceRequest {
  invoiceNumber?: string;
  client?: string;
  maintenance?: string;
  items?: CreateInvoiceItemRequest[];
  invoiceDate?: string;
  dueDate?: string;
  status?: InvoiceStatus;
  notes?: string;
}
