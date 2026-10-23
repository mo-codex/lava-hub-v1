/**
 * Core utility functions for Lava Hub platform
 */

/**
 * Combines conditional class names into a clean string.
 */
export function cn(...inputs: (string | boolean | undefined | null)[]): string {
  return inputs.filter(Boolean).join(' ');
}

/**
 * Formats a UTC timestamp into Africa/Mogadishu display time (EAT, UTC+3).
 */
export function formatMogadishuTime(
  dateInput: string | Date,
  options?: {
    includeTime?: boolean;
    format?: 'full' | 'short' | 'timeOnly';
  }
): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  const timeZone = 'Africa/Mogadishu';
  const includeTime = options?.includeTime ?? true;
  const format = options?.format ?? 'full';

  if (format === 'timeOnly') {
    return new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short',
    }).format(date);
  }

  if (format === 'short') {
    return new Intl.DateTimeFormat('en-US', {
      timeZone,
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      ...(includeTime
        ? { hour: 'numeric', minute: '2-digit', hour12: true, timeZoneName: 'short' }
        : {}),
    }).format(date);
  }

  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...(includeTime
      ? { hour: 'numeric', minute: '2-digit', hour12: true, timeZoneName: 'short' }
      : {}),
  }).format(date);
}

/**
 * Normalizes an email address (trims whitespace, converts to lowercase).
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Neutralizes spreadsheet formula injection in CSV cells.
 * Prepends a single quote if the value begins with =, +, -, or @.
 */
export function sanitizeCsvCell(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) {
    return '';
  }
  const str = String(value);
  if (/^[=+\-@\t\r]/.test(str)) {
    return `'${str}`;
  }
  return str;
}

/**
 * Atomically computes remaining seats with a floor of 0.
 */
export function calculateRemainingSeats(capacity: number, confirmedCount: number): number {
  if (capacity <= 0) return 0;
  return Math.max(0, capacity - confirmedCount);
}
