/**
 * Date formatting utilities for the AI Tutorials application
 * 
 * These functions provide consistent date formatting throughout the app
 * using US locale formatting for better consistency.
 */

/**
 * Format a date string to display only the date (no time)
 * 
 * @param dateString - ISO date string from the API
 * @returns Formatted date string in US format (e.g., "Jun 14, 2025")
 */
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Format a date string to display both date and time
 * 
 * @param dateString - ISO date string from the API
 * @returns Formatted datetime string in US format (e.g., "Jun 14, 2025 at 5:58 PM")
 */
export const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}; 