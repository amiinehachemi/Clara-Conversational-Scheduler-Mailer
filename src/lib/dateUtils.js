/**
 * Utility functions for date handling in the AI appointment system
 */

/**
 * Get current date information for AI context
 * @returns {Object} Current date information
 */
export function getCurrentDateInfo() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // getMonth() returns 0-11, so add 1
  const currentDay = now.getDate();
  const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD format
  
  // Calculate tomorrow's date
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDate = tomorrow.toISOString().split('T')[0];
  
  // Calculate next week's date (7 days from now)
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextWeekDate = nextWeek.toISOString().split('T')[0];
  
  // Get month name
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentMonthName = monthNames[now.getMonth()];
  
  return {
    currentYear,
    currentMonth,
    currentDay,
    currentDate,
    currentMonthName,
    tomorrowDate,
    nextWeekDate,
    timestamp: now.toISOString()
  };
}

/**
 * Format date for display
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string} Formatted date string
 */
export function formatDateForDisplay(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Get relative date (tomorrow, next week, etc.) based on current date
 * @param {string} relativeDate - 'tomorrow', 'next week', etc.
 * @returns {string} Date in YYYY-MM-DD format
 */
export function getRelativeDate(relativeDate) {
  const dateInfo = getCurrentDateInfo();
  
  switch (relativeDate.toLowerCase()) {
    case 'today':
      return dateInfo.currentDate;
    case 'tomorrow':
      return dateInfo.tomorrowDate;
    case 'next week':
      return dateInfo.nextWeekDate;
    default:
      return dateInfo.currentDate;
  }
}
