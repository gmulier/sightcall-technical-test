/**
 * CSRF token utility for Django API requests
 * 
 * Extracts CSRF token from browser cookies for secure API calls
 */

/**
 * Get CSRF token from cookies
 * 
 * @returns CSRF token string or empty string if not found
 */
export const getCsrfToken = (): string => {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'csrftoken') return value;
  }
  return '';
}; 