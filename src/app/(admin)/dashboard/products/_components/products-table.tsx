import { getProductsPaginated } from "../lib/data";
import { ProductsTableClient } from "./products-table-client";

interface ProductsTableProps {
  page: number;
  limit: number;
  search: string;
}

export async function ProductsTable(props: ProductsTableProps) {
  const { page, limit, search } = props;

  try {
    const result = await getProductsPaginated({ page, limit, search });
    const { data, pagination } = result;

    return (
      <ProductsTableClient
        data={data}
        pagination={pagination}
        search={search}
      />
    );
  } catch (error) {
    console.error("Error in ProductsTable:", error);
    return (
      <div className="p-4 text-center text-red-500">
        Error loading products. Please try again.
      </div>
    );
  }
}
