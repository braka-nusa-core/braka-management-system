import { AxiosError } from "axios";
import { apiClient } from "@/lib/axios";
import type {
  ApiProgressProject,
  ApiProgressProjectDetail,
  CreateProgressRequest,
  ProgressAdminProject,
  ProgressDetailResponse,
  ProgressListResponse,
  ProgressPagination,
  PublicProgressProject,
  PublicProgressResponse,
  UpdateProgressRequest,
} from "@/types/progress";

function mapMilestones(
  milestones: Array<{ title: string; completed: boolean }>
): ProgressAdminProject["milestones"] {
  return milestones.map((milestone, index) => ({
    id: `ms-${index}`,
    title: milestone.title,
    description: undefined,
    status: milestone.completed ? "completed" : "pending",
    completed: milestone.completed,
  }));
}

function mapAdminProject(
  project: ApiProgressProject | ApiProgressProjectDetail
): ProgressAdminProject {
  return {
    id: project._id,
    clientId: project.client._id,
    clientName: project.client.name,
    clientEmail: project.client.email,
    projectName: project.projectName,
    status: project.status,
    progress: project.progress,
    description: project.description,
    milestones: mapMilestones(project.milestones),
    publicToken: project.publicToken,
    lastUpdated: project.lastUpdated,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}

function mapPublicProject(
  data: PublicProgressResponse["data"]
): PublicProgressProject {
  return {
    clientName: data.clientName,
    projectName: data.projectName,
    status: data.status,
    progress: data.progress,
    description: data.description,
    lastUpdated: data.lastUpdated,
    milestones: data.milestones.map((milestone, index) => ({
      id: `ms-${index}`,
      title: milestone.title,
      description: undefined,
      status: milestone.completed ? "completed" : "pending",
      completed: milestone.completed,
    })),
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

export async function getProgressProjects() {
  try {
    const response = await apiClient.get<ProgressListResponse>("/progress");
    return {
      projects: response.data.data.projects.map(mapAdminProject),
      pagination: response.data.data.pagination satisfies ProgressPagination,
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to fetch progress projects"));
  }
}

export async function getProgressProjectById(id: string) {
  try {
    const response = await apiClient.get<ProgressDetailResponse>(`/progress/${id}`);
    return mapAdminProject(response.data.data.project);
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to fetch progress project"));
  }
}

export async function createProgressProject(payload: CreateProgressRequest) {
  try {
    const response = await apiClient.post<ProgressDetailResponse>("/progress", payload);
    return mapAdminProject(response.data.data.project);
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to create progress project"));
  }
}

export async function updateProgressProject(
  id: string,
  payload: UpdateProgressRequest
) {
  try {
    const response = await apiClient.patch<ProgressDetailResponse>(
      `/progress/${id}`,
      payload
    );
    return mapAdminProject(response.data.data.project);
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to update progress project"));
  }
}

export async function deleteProgressProject(id: string) {
  try {
    await apiClient.delete(`/progress/${id}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to delete progress project"));
  }
}

export async function regenerateProgressToken(id: string) {
  try {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      data: { publicToken: string };
    }>(`/progress/${id}/regenerate-token`);
    return response.data.data.publicToken;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to regenerate public token"));
  }
}

export async function getPublicProgressByToken(token: string) {
  try {
    const response = await apiClient.get<PublicProgressResponse>(
      `/progress/public/${token}`
    );
    return mapPublicProject(response.data.data);
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to fetch public progress"));
  }
}
