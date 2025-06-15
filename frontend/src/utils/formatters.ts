/**
 * Formatting utilities for the AI Tutorials application
 * 
 * This file contains date, duration, and data formatting functions
 * for consistent presentation throughout the app.
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

/**
 * Convert duration from system ticks to human-readable format
 * 
 * @param ticks - Duration in system ticks (10,000,000 ticks = 1 second)
 * @returns Formatted duration string (e.g., "07:01")
 */
export const formatDuration = (ticks: number): string => {
  const seconds = Math.floor(ticks / 10000000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Extract the most common language from transcript phrases
 * 
 * @param phrases - Array of conversation phrases with locale information
 * @returns Most common language code or 'N/A' if none found
 */
export const getLanguage = (phrases: any[]): string => {
  if (!phrases.length) return 'N/A';
  const locales = phrases.map(p => p.locale).filter(Boolean);
  const mostCommon = locales.reduce((acc, locale) => {
    acc[locale] = (acc[locale] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  return Object.keys(mostCommon).sort((a, b) => mostCommon[b] - mostCommon[a])[0] || 'N/A';
};

/**
 * Calculate average confidence score from transcript phrases
 * 
 * @param phrases - Array of conversation phrases with confidence scores
 * @returns Average confidence as a decimal (0-1)
 */
export const getAverageConfidence = (phrases: any[]): number => {
  if (!phrases.length) return 0;
  const confidences = phrases.map(p => p.confidence).filter(c => c !== undefined);
  return confidences.length ? (confidences.reduce((a, b) => a + b, 0) / confidences.length) : 0;
}; 