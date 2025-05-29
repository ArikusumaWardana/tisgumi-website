import prisma  from "../../../../../../lib/prisma";

export async function getCategories() {
     try {
          const categories = await prisma.categories.findMany({
               where: {
                    deleted_at: null
               },
               orderBy: {
                    created_at: "desc"
               }
          })
          return categories;
     } catch (error) {
          console.error("Error fetching categories:", error);
          return [];
     }
}