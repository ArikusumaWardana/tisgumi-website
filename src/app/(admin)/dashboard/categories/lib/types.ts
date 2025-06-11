// Shared types for categories feature
export interface Category {
  id: number;
  code: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}
