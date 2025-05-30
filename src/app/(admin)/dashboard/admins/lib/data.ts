import prisma from "../../../../../../lib/prisma";
import { getUser } from "@/lib/auth";

// Function to get all admins
export async function getAdmins() {
  try {
    // Check user role for access control
    const { user } = await getUser();

    // If user is not superadmin, return empty array
    if (!user || user.role !== "superadmin") {
      return [];
    }

    // Get all admins from the database
    const admins = await prisma.user.findMany({
      where: {
        deleted_at: null,
        role: "admin",
      },
      orderBy: {
        created_at: "desc",
      },
    });
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
    // Check user role for access control
    const { user } = await getUser();

    // If user is not superadmin, return null
    if (!user || user.role !== "superadmin") {
      return null;
    }

    // Get the admin by id
    const admin = await prisma.user.findFirst({
      where: {
        id: Number.parseInt(id),
        deleted_at: null,
      },
    });
    // Return the admin
    return admin;
  } catch (error) {
    // If there is an error, return null
    console.error("Error fetching admin:", error);
    return null;
  }
}
