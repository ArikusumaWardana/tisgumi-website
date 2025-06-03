import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function customerSeeder() {
     
     await prisma.customer.createMany({
          data: [
               {
                    code: "CUS-001",
                    name: "Yusuf",
                    phone: "6281234567890",
                    status: "active",
                    created_at: new Date(),
                    updated_at: new Date(),
               },
               {
                    code: "CUS-002",
                    name: "Budi",
                    phone: "6281234567890",
                    status: "active",
                    created_at: new Date(),
                    updated_at: new Date(),
               },
               {
                    code: "CUS-003",
                    name: "Sukri",
                    phone: "6281234567890",
                    status: "active",
                    created_at: new Date(),
                    updated_at: new Date(),
               },
               {
                    code: "CUS-004",
                    name: "Dedi",
                    phone: "6281234567890",
                    status: "active",
                    created_at: new Date(),
                    updated_at: new Date(),
               },
               {
                    code: "CUS-005",
                    name: "Eko",
                    phone: "6281234567890",
                    status: "active",
                    created_at: new Date(),
                    updated_at: new Date(),
               },
               {
                    code: "CUS-006",
                    name: "Fajar",
                    phone: "6281234567890",
                    status: "active",
                    created_at: new Date(),
                    updated_at: new Date(),
               },
               {
                    code: "CUS-007",
                    name: "Galih",
                    phone: "6281234567890",
                    status: "active",
                    created_at: new Date(),
                    updated_at: new Date(),
               },
               {
                    code: "CUS-008",
                    name: "Hari",
                    phone: "6281234567890",
                    status: "active",
                    created_at: new Date(),
                    updated_at: new Date(),
               },
               {
                    code: "CUS-009",
                    name: "Iwan",
                    phone: "6281234567890",
                    status: "active",
                    created_at: new Date(),
                    updated_at: new Date(),
               },
               {
                    code: "CUS-010",
                    name: "Joko",
                    phone: "6281234567890",
                    status: "active",
                    created_at: new Date(),
                    updated_at: new Date(),
               }
          ]
     })

}