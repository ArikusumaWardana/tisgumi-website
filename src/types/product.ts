import { Product, Categories } from "@prisma/client";

// Standard Product with Category relation type
export type ProductWithCategory = Product & {
  category: Categories;
};
