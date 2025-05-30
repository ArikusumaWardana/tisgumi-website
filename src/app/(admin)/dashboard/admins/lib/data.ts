import prisma  from "../../../../../../lib/prisma";

// Function to get all admins
export async function getAdmins() {
     try {
          // Get all admins from the database
          const admins = await prisma.user.findMany({
               where: {
                    deleted_at: null,
                    role: "admin"
               },
               orderBy: {
                    created_at: "desc"
               }
          })
          // Return the admins
          return admins;
     } catch (error) {
          // If there is an error, return an empty array
          console.error("Error fetching admins:", error);
          return [];
     }
}

// Function to get a admin by id
export async function getAdminById(id: string) {
     try {
          // Get the admin by id
          const admin = await prisma.user.findFirst({
               where: {
                    id: Number.parseInt(id),
                    deleted_at: null
               }
          })
          // Return the admin
          return admin;
     } catch (error) {
          // If there is an error, return null
          console.error("Error fetching admin:", error);
          return null;
     }
}