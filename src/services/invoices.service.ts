import { AxiosError } from "axios";
import { apiClient } from "@/lib/axios";
import type {
  ApiInvoice,
  CreateInvoiceRequest,
  Invoice,
  InvoiceDetailResponse,
  InvoiceListResponse,
  InvoicePagination,
  UpdateInvoiceRequest,
} from "@/types/invoice";

function mapInvoice(invoice: ApiInvoice): Invoice {
  return {
    id: invoice._id,
    invoiceNumber: invoice.invoiceNumber,
    clientId: invoice.client._id,
    clientName: invoice.client.name,
    clientEmail: invoice.client.email,
    maintenanceId: invoice.maintenance?._id ?? undefined,
    maintenanceName: invoice.maintenance?.serviceName ?? undefined,
    items: invoice.items.map((item, index) => ({
      id: `${invoice._id}-${index}`,
      description: item.description,
      qty: item.quantity,
      unitPrice: item.unitPrice,
      amount: item.amount,
    })),
    subtotal: invoice.subtotal,
    total: invoice.total,
    invoiceDate: invoice.invoiceDate,
    dueDate: invoice.dueDate,
    paidAt: invoice.paidAt,
    status: invoice.status,
    notes: invoice.notes,
    createdAt: invoice.createdAt,
    updatedAt: invoice.updatedAt,
  };
}

function extractErrorMessage(error: unknown, fallback: string) {
  if (error instanceof AxiosError) {
    const responseMessage =
      (error.response?.data as { message?: string } | undefined)?.message;

    return responseMessage ?? error.message ?? fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export async function getInvoices() {
  try {
    const response = await apiClient.get<InvoiceListResponse>("/invoices");

    return {
      invoices: response.data.data.invoices.map(mapInvoice),
      pagination: response.data.data.pagination satisfies InvoicePagination,
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to fetch invoices"));
  }
}

export async function getInvoiceById(id: string) {
  try {
    const response = await apiClient.get<InvoiceDetailResponse>(`/invoices/${id}`);
    return mapInvoice(response.data.data.invoice);
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to fetch invoice"));
  }
}

export async function createInvoice(payload: CreateInvoiceRequest) {
  try {
    const response = await apiClient.post<InvoiceDetailResponse>("/invoices", payload);
    return mapInvoice(response.data.data.invoice);
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to create invoice"));
  }
}

export async function updateInvoice(id: string, payload: UpdateInvoiceRequest) {
  try {
    const response = await apiClient.patch<InvoiceDetailResponse>(
      `/invoices/${id}`,
      payload
    );
    return mapInvoice(response.data.data.invoice);
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to update invoice"));
  }
}

export async function deleteInvoice(id: string) {
  try {
    await apiClient.delete(`/invoices/${id}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to delete invoice"));
  }
}

export async function markInvoiceAsPaid(id: string) {
  try {
    const response = await apiClient.post<InvoiceDetailResponse>(
      `/invoices/${id}/mark-as-paid`
    );
    return mapInvoice(response.data.data.invoice);
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to mark invoice as paid"));
  }
}
