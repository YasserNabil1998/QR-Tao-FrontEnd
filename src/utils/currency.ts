/**
 * Utility functions for currency formatting
 */

/**
 * Formats a number as currency with dollar sign
 * @param amount - The amount to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted currency string (e.g., "$123.45")
 */
export const formatCurrency = (
    amount: number | string,
    decimals: number = 2
): string => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) return "$0.00";
    return `$${numAmount.toFixed(decimals)}`;
};

/**
 * Formats a number as currency with dollar sign and thousands separator
 * @param amount - The amount to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted currency string with commas (e.g., "$1,234.56")
 */
export const formatCurrencyWithCommas = (
    amount: number | string,
    decimals: number = 2
): string => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) return "$0.00";
    return `$${numAmount.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    })}`;
};

/**
 * Gets the currency symbol
 * @returns Currency symbol (always "$")
 */
export const getCurrencySymbol = (): string => {
    return "$";
};
