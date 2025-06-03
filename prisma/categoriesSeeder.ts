import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function categoriesSeeder() {

     await prisma.categories.createMany({
          data: [
               {
                   code: "CAT-001",
                   name: "Makanan",
                   created_at: new Date(),
                   updated_at: new Date(),
               },
               {
                    code: "CAT-002",
                    name: "Minuman",
                    created_at: new Date(),
                    updated_at: new Date(),
               }
          ]
     })

}