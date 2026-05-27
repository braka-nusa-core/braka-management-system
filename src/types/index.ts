// Global shared types
// Feature-specific types go in src/features/<feature>/types.ts

export type ID = string;

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
