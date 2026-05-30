export type ClientStatus = "active" | "inactive" | "prospect";

export interface Client {
  id: string;
  companyName: string;
  picName: string;
  email: string;
  phone: string;
  address: string;
  status: ClientStatus;
  totalProjects: number;
  notes?: string;
  joinedAt: string;
  updatedAt: string;
  progressToken?: string;
}

export interface ClientsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiClient {
  _id: string;
  name: string;
  picName: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
  status: ClientStatus;
  totalProjects?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ClientsResponse {
  success: boolean;
  message: string;
  data: {
    clients: ApiClient[];
    pagination: ClientsPagination;
  };
}

export interface ClientDetailResponse {
  success: boolean;
  message: string;
  data: {
    client: ApiClient;
  };
}

export interface CreateClientRequest {
  name: string;
  picName: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
  status?: ClientStatus;
}

export interface UpdateClientRequest {
  name?: string;
  picName?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  status?: ClientStatus;
}
