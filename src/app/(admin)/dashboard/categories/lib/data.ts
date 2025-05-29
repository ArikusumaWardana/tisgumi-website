import prisma  from "../../../../../../lib/prisma";

// Function to get all categories
export async function getCategories() {
     try {
          // Get all categories from the database
          const categories = await prisma.categories.findMany({
               where: {
                    deleted_at: null
               },
               orderBy: {
                    created_at: "desc"
               }
          })
          // Return the categories
          return categories;
     } catch (error) {
          // If there is an error, return an empty array
          console.error("Error fetching categories:", error);
          return [];
     }
}

// Function to get a category by id
export async function getCategoryById(id: string) {
     try {
          // Get the category by id
          const category = await prisma.categories.findFirst({
               where: {
                    id: Number.parseInt(id),
                    deleted_at: null
               }
          })
          // Return the category
          return category;
     } catch (error) {
          // If there is an error, return null
          console.error("Error fetching category:", error);
          return null;
     }
}