// Shared types for pricing feature
export interface CustomerWithPricing {
  id: number;
  code: string;
  name: string;
  phone: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  custom_prices: Array<unknown>;
  custom_pricing_count: number;
}
 