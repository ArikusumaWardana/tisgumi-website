import prisma from "../../../../../../lib/prisma";

// Function to get all products
export async function getProducts() {
  try {
    // Get all products from the database with category relation
    const products = await prisma.product.findMany({
      where: {
        deleted_at: null,
      },
      include: {
        category: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    // Return the products
    return products;
  } catch (error) {
    // If there is an error, return an empty array
    console.error("Error fetching products:", error);
    return [];
  }
}

// Function to get a product by id
export async function getProductById(id: string) {
  try {
    // Get the product by id with category relation
    const product = await prisma.product.findFirst({
      where: {
        id: Number.parseInt(id),
        deleted_at: null,
      },
      include: {
        category: true,
      },
    });
    // Return the product
    return product;
  } catch (error) {
    // If there is an error, return null
    console.error("Error fetching product:", error);
    return null;
  }
}
