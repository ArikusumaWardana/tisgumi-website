/**
 * Utility functions for handling currency formatting and input
 */

/**
 * Format number to Rupiah format
 * @param value - The value to format (string or number)
 * @returns Formatted string in Rupiah format
 */
export const formatToRupiah = (value: string | number): string => {
  // If value is string, remove all non-digit characters
  const number =
    typeof value === "string" ? value.replace(/\D/g, "") : value.toString();

  // Format with thousand separator using toLocaleString
  return Number(number).toLocaleString("id-ID");
};

/**
 * Handle price input change and format to Rupiah
 * @param value - The input value to format
 * @returns Formatted string in Rupiah format
 */
export const handlePriceInputChange = (value: string): string => {
  return formatToRupiah(value);
};

/**
 * Get numeric value from formatted string
 * @param formattedValue - The formatted string value
 * @returns Numeric value
 */
export const getNumericValue = (formattedValue: string): number => {
  return parseInt(formattedValue.replace(/\D/g, "")) || 0;
};
