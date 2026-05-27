import { AxiosError } from "axios";
import { apiClient } from "@/lib/axios";
import type {
  ApiMaintenanceContract,
  CreateMaintenanceRequest,
  MaintenanceContract,
  MaintenanceDetailResponse,
  MaintenanceListResponse,
  MaintenancePagination,
  UpdateMaintenanceRequest,
} from "@/types/maintenance";

function mapContract(contract: ApiMaintenanceContract): MaintenanceContract {
  return {
    id: contract._id,
    clientId: contract.client._id,
    clientName: contract.client.name,
    clientEmail: contract.client.email,
    serviceName: contract.serviceName,
    billingType: contract.billingType,
    price: contract.price,
    startDate: contract.startDate,
    nextDueDate: contract.nextDueDate,
    status: contract.status,
    notes: contract.notes,
    createdAt: contract.createdAt,
    updatedAt: contract.updatedAt,
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

export async function getMaintenanceContracts() {
  try {
    const response = await apiClient.get<MaintenanceListResponse>("/maintenance");

    return {
      contracts: response.data.data.contracts.map(mapContract),
      pagination: response.data.data.pagination satisfies MaintenancePagination,
    };
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, "Failed to fetch maintenance contracts")
    );
  }
}

export async function getMaintenanceContractById(id: string) {
  try {
    const response = await apiClient.get<MaintenanceDetailResponse>(
      `/maintenance/${id}`
    );
    return mapContract(response.data.data.contract);
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, "Failed to fetch maintenance contract")
    );
  }
}

export async function createMaintenanceContract(
  payload: CreateMaintenanceRequest
) {
  try {
    const response = await apiClient.post<MaintenanceDetailResponse>(
      "/maintenance",
      payload
    );
    return mapContract(response.data.data.contract);
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, "Failed to create maintenance contract")
    );
  }
}

export async function updateMaintenanceContract(
  id: string,
  payload: UpdateMaintenanceRequest
) {
  try {
    const response = await apiClient.patch<MaintenanceDetailResponse>(
      `/maintenance/${id}`,
      payload
    );
    return mapContract(response.data.data.contract);
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, "Failed to update maintenance contract")
    );
  }
}

export async function deleteMaintenanceContract(id: string) {
  try {
    await apiClient.delete(`/maintenance/${id}`);
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, "Failed to delete maintenance contract")
    );
  }
}
