import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function adminSeeder() {
     await prisma.user.createMany({
          data: [
               {
                    email: "admin@admin.com",
                    code: "admin",
                    name: "Admin",
                    phone: "+6281234567890",
                    password: await bcrypt.hash("1234567890", 12),
                    role: "superadmin",
                    created_at: new Date(),
                    updated_at: new Date(),
               },
               {
                    email: "kasir@kasir.com",
                    code: "kasir",
                    name: "Kasir",
                    phone: "+6281234567890",
                    password: await bcrypt.hash("0987654321", 12),
                    role: "admin",
                    created_at: new Date(),
                    updated_at: new Date(),
               }
          ],
     })
}