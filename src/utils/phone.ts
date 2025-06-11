/**
 * Formats a phone number to a consistent format
 * Rules:
 * 1. Always starts with +62
 * 2. Removes any existing country code (+ or 62 or +62)
 * 3. Removes any non-numeric characters
 * 4. Returns empty string for invalid input
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return "";

  // Remove all non-numeric characters
  let cleaned = phone.replace(/\D/g, "");

  // Remove leading zeros
  cleaned = cleaned.replace(/^0+/, "");

  // Remove country code if exists (62 or +62)
  cleaned = cleaned.replace(/^62/, "");

  // Add +62 prefix
  return `+62${cleaned}`;
}

/**
 * Formats a phone number for display (with spaces)
 * Example: +62 812 3456 7890
 */
export function formatPhoneNumberForDisplay(phone: string): string {
  const formatted = formatPhoneNumber(phone);
  if (!formatted) return "";

  // Split into groups: +62 812 3456 7890
  const groups = formatted.match(/^\+62(\d{3})(\d{4})(\d{4})$/);
  if (!groups) return formatted;

  return `+62 ${groups[1]} ${groups[2]} ${groups[3]}`;
}

/**
 * Validates if a phone number is valid according to Indonesian format
 * Rules:
 * 1. Must be numeric
 * 2. Must be between 10-13 digits (excluding country code)
 * 3. Must start with valid Indonesian prefix after country code
 */
export function isValidIndonesianPhoneNumber(phone: string): boolean {
  const formatted = formatPhoneNumber(phone);
  if (!formatted) return false;

  // Remove +62 prefix
  const number = formatted.replace(/^\+62/, "");

  // Check length (10-13 digits)
  if (number.length < 10 || number.length > 13) return false;

  // Check if starts with valid Indonesian prefix
  const validPrefixes = [
    "811",
    "812",
    "813",
    "814",
    "815",
    "816",
    "817",
    "818",
    "819", // Telkomsel
    "821",
    "822",
    "823",
    "851",
    "852",
    "853", // XL
    "855",
    "856",
    "857",
    "858", // Indosat
    "895",
    "896",
    "897",
    "898",
    "899",
  ]; // Three

  return validPrefixes.some((prefix) => number.startsWith(prefix));
}
