import { useState, useEffect } from "react";

interface Customer {
  id: number;
  code: string;
  name: string;
}

interface Product {
  id: number;
  code: string;
  name: string;
  default_price: number;
}

interface CachedData {
  customers: Customer[];
  products: Product[];
  timestamp: number;
}

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;
const CACHE_KEY = "orders_form_data";

export function useCachedFormData() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [usingCache, setUsingCache] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Check if we have valid cached data
        const cached = localStorage.getItem(CACHE_KEY);
        const now = Date.now();

        if (cached) {
          const cachedData: CachedData = JSON.parse(cached);
          const isValidCache = now - cachedData.timestamp < CACHE_DURATION;

          if (
            isValidCache &&
            cachedData.customers.length > 0 &&
            cachedData.products.length > 0
          ) {
            console.log("Using cached data for form");
            setCustomers(cachedData.customers);
            setProducts(cachedData.products);
            setUsingCache(true);
            setIsLoading(false);
            return;
          }
        }

        // Fetch fresh data if no valid cache
        console.log("Fetching fresh data for form");
        const [customersResponse, productsResponse] = await Promise.all([
          fetch("/api/customers"),
          fetch("/api/products"),
        ]);

        if (!customersResponse.ok || !productsResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const [customersData, productsData] = await Promise.all([
          customersResponse.json(),
          productsResponse.json(),
        ]);

        // Validate data
        if (Array.isArray(customersData) && Array.isArray(productsData)) {
          setCustomers(customersData);
          setProducts(productsData);

          // Cache the data
          const cacheData: CachedData = {
            customers: customersData,
            products: productsData,
            timestamp: now,
          };
          localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
          setUsingCache(false);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (error) {
        console.error("Error loading form data:", error);
        // Fallback: try to use any cached data even if expired
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const cachedData: CachedData = JSON.parse(cached);
          setCustomers(cachedData.customers || []);
          setProducts(cachedData.products || []);
          setUsingCache(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const invalidateCache = () => {
    localStorage.removeItem(CACHE_KEY);
  };

  return {
    customers,
    products,
    isLoading,
    usingCache,
    invalidateCache,
  };
}
