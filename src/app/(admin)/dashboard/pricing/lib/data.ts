import prisma from "../../../../../../lib/prisma";

// Function to get all customers who have custom product pricings
export async function getCustomersWithPricing() {
  try {
    // Get customers who have custom product pricings
    const customers = await prisma.customer.findMany({
      where: {
        deleted_at: null,
        custom_prices: {
          some: {
            deleted_at: null,
          },
        },
      },
      include: {
        custom_prices: {
          where: {
            deleted_at: null,
          },
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
    // Return the customers with custom pricing count
    return customers.map((customer) => ({
      ...customer,
      custom_pricing_count: customer.custom_prices.length,
    }));
  } catch (error) {
    // If there is an error, return an empty array
    console.error("Error fetching customers with custom pricing:", error);
    return [];
  }
}

// Function to get customer pricing details by customer id
export async function getCustomerPricingDetails(customerId: string) {
  try {
    // Get customer with all custom pricing details
    const customer = await prisma.customer.findFirst({
      where: {
        id: Number.parseInt(customerId),
        deleted_at: null,
      },
      include: {
        custom_prices: {
          where: {
            deleted_at: null,
          },
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
          orderBy: {
            created_at: "desc",
          },
        },
      },
    });
    // Return the customer with pricing details
    return customer;
  } catch (error) {
    // If there is an error, return null
    console.error("Error fetching customer pricing details:", error);
    return null;
  }
}

// Function to get all custom product pricings (keep for backward compatibility)
export async function getCustomProductPricings() {
  try {
    // Get all custom product pricings from the database
    const customProductPricings = await prisma.customProductPricing.findMany({
      where: {
        deleted_at: null,
      },
      include: {
        customer: true,
        product: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    // Return the custom product pricings
    return customProductPricings;
  } catch (error) {
    // If there is an error, return an empty array
    console.error("Error fetching custom product pricings:", error);
    return [];
  }
}

// Function to get a custom product pricing by id
export async function getCustomProductPricingById(id: string) {
  try {
    // Get the custom product pricing by id
    const customProductPricing = await prisma.customProductPricing.findFirst({
      where: {
        id: Number.parseInt(id),
        deleted_at: null,
      },
      include: {
        customer: true,
        product: true,
      },
    });
    // Return the custom product pricing
    return customProductPricing;
  } catch (error) {
    // If there is an error, return null
    console.error("Error fetching custom product pricing:", error);
    return null;
  }
}
