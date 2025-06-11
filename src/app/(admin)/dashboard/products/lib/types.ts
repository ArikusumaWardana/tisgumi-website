// Shared types for products feature
export interface ProductWithCategory {
  id: number;
  code: string;
  name: string;
  default_price: number;
  status: string;
  category_id: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  category: {
    id: number;
    code: string;
    name: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
  };
}
