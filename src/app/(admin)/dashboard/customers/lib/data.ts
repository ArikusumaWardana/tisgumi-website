import prisma  from "../../../../../../lib/prisma";

// Function to get all customers
export async function getCustomers() {
     try {
          // Get all customers from the database
          const customers = await prisma.customer.findMany({
               where: {
                    deleted_at: null
               },
               orderBy: {
                    created_at: "desc"
               }
          })
          // Return the customers
          return customers;
     } catch (error) {
          // If there is an error, return an empty array
          console.error("Error fetching customers:", error);
          return [];
     }
}

// Function to get a customer by id
export async function getCustomerById(id: string) {
     try {
          // Get the customer by id
          const customer = await prisma.customer.findFirst({
               where: {
                    id: Number.parseInt(id),
                    deleted_at: null
               }
          })
          // Return the customer
          return customer;
     } catch (error) {
          // If there is an error, return null
          console.error("Error fetching customer:", error);
          return null;
     }
}