import { AxiosError } from "axios";
import { apiClient } from "@/lib/axios";
import type {
  ApiClient,
  Client,
  ClientDetailResponse,
  ClientsPagination,
  ClientsResponse,
  CreateClientRequest,
  UpdateClientRequest,
} from "@/types/client";

function mapClient(client: ApiClient): Client {
  return {
    id: client._id,
    companyName: client.name,
    picName: client.picName,
    email: client.email,
    phone: client.phone,
    address: client.address,
    status: client.status,
    totalProjects: client.totalProjects ?? 0,
    notes: client.notes,
    joinedAt: client.createdAt,
    updatedAt: client.updatedAt,
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

export async function getClients() {
  try {
    const response = await apiClient.get<ClientsResponse>("/clients");

    return {
      clients: response.data.data.clients.map(mapClient),
      pagination: response.data.data.pagination satisfies ClientsPagination,
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to fetch clients"));
  }
}

export async function getClientById(id: string) {
  try {
    const response = await apiClient.get<ClientDetailResponse>(`/clients/${id}`);
    return mapClient(response.data.data.client);
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to fetch client"));
  }
}

export async function createClient(payload: CreateClientRequest) {
  try {
    const response = await apiClient.post<ClientDetailResponse>("/clients", payload);
    return mapClient(response.data.data.client);
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to create client"));
  }
}

export async function updateClient(id: string, payload: UpdateClientRequest) {
  try {
    const response = await apiClient.patch<ClientDetailResponse>(`/clients/${id}`, payload);
    return mapClient(response.data.data.client);
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to update client"));
  }
}

export async function deleteClient(id: string) {
  try {
    await apiClient.delete(`/clients/${id}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to delete client"));
  }
}
