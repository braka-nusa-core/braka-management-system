export type ProjectStatus =
  | "planning"
  | "design"
  | "development"
  | "revision"
  | "testing"
  | "completed";

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  status: "completed" | "in_progress" | "pending";
  date?: string;
  completed?: boolean;
}

export interface ProgressAdminProject {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  projectName: string;
  status: ProjectStatus;
  progress: number;
  description?: string;
  milestones: Milestone[];
  publicToken: string;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicProgressProject {
  clientName: string;
  projectName: string;
  status: ProjectStatus;
  progress: number;
  description?: string;
  lastUpdated: string;
  milestones: Milestone[];
}

export interface ApiProgressProject {
  _id: string;
  client: {
    _id: string;
    name: string;
    email: string;
  };
  projectName: string;
  status: ProjectStatus;
  progress: number;
  description?: string;
  milestones: Array<{ title: string; completed: boolean }>;
  publicToken: string;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiProgressProjectDetail {
  _id: string;
  client: {
    _id: string;
    name: string;
    email: string;
  };
  projectName: string;
  status: ProjectStatus;
  progress: number;
  description?: string;
  milestones: Array<{ title: string; completed: boolean }>;
  publicToken: string;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProgressPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProgressListResponse {
  success: boolean;
  message: string;
  data: {
    projects: ApiProgressProject[];
    pagination: ProgressPagination;
  };
}

export interface ProgressDetailResponse {
  success: boolean;
  message: string;
  data: {
    project: ApiProgressProjectDetail;
  };
}

export interface PublicProgressResponse {
  success: boolean;
  message: string;
  data: {
    clientName: string;
    projectName: string;
    status: ProjectStatus;
    progress: number;
    description?: string;
    lastUpdated: string;
    milestones: Array<{ title: string; completed: boolean }>;
  };
}

export interface CreateProgressRequest {
  client: string;
  projectName: string;
  status?: ProjectStatus;
  progress?: number;
  description?: string;
  milestones?: Array<{ title: string; completed: boolean }>;
}

export interface UpdateProgressRequest {
  client?: string;
  projectName?: string;
  status?: ProjectStatus;
  progress?: number;
  description?: string;
  milestones?: Array<{ title: string; completed: boolean }>;
}
