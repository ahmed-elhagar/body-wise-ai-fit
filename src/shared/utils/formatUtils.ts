// Shared Formatting Utilities
// Common formatting functions used across all features

// Number formatting
export const formatUtils = {
  // Format numbers with locale support
  formatNumber(value: number, options?: {
    decimals?: number;
    locale?: string;
    currency?: string;
    percentage?: boolean;
  }): string {
    const { decimals = 2, locale = 'en-US', currency, percentage } = options || {};
    
    if (percentage) {
      return new Intl.NumberFormat(locale, {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }).format(value / 100);
    }
    
    if (currency) {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }).format(value);
    }
    
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  },

  // Format calories with proper units
  formatCalories(calories: number): string {
    if (calories >= 1000) {
      return `${this.formatNumber(calories / 1000, { decimals: 1 })}k cal`;
    }
    return `${Math.round(calories)} cal`;
  },

  // Format macros (protein, carbs, fat)
  formatMacros(grams: number, unit = 'g'): string {
    if (grams >= 1000) {
      return `${this.formatNumber(grams / 1000, { decimals: 1 })}k${unit}`;
    }
    return `${Math.round(grams)}${unit}`;
  },

  // Format weight with units
  formatWeight(weight: number, unit = 'kg'): string {
    return `${this.formatNumber(weight, { decimals: 1 })} ${unit}`;
  },

  // Format height with units
  formatHeight(height: number, unit = 'cm'): string {
    if (unit === 'ft') {
      const feet = Math.floor(height / 12);
      const inches = height % 12;
      return `${feet}' ${Math.round(inches)}"`;
    }
    return `${Math.round(height)} ${unit}`;
  },

  // Format duration (in minutes)
  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours}h`;
    }
    
    return `${hours}h ${remainingMinutes}m`;
  },

  // Format file size
  formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${this.formatNumber(size, { decimals: unitIndex === 0 ? 0 : 1 })} ${units[unitIndex]}`;
  },

  // Format percentage
  formatPercentage(value: number, total: number): string {
    if (total === 0) return '0%';
    const percentage = (value / total) * 100;
    return `${Math.round(percentage)}%`;
  },

  // Format phone number
  formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    
    if (cleaned.length === 11 && cleaned[0] === '1') {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    
    return phone; // Return original if can't format
  },

  // Format credit count
  formatCredits(credits: number): string {
    if (credits >= 1000000) {
      return `${this.formatNumber(credits / 1000000, { decimals: 1 })}M`;
    }
    if (credits >= 1000) {
      return `${this.formatNumber(credits / 1000, { decimals: 1 })}K`;
    }
    return credits.toString();
  },

  // Format streak count
  formatStreak(days: number): string {
    if (days === 0) return '0 days';
    if (days === 1) return '1 day';
    return `${days} days`;
  },

  // Format name with proper casing
  formatName(name: string): string {
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  },

  // Format email for display (truncate if too long)
  formatEmail(email: string, maxLength = 25): string {
    if (email.length <= maxLength) return email;
    
    const [local, domain] = email.split('@');
    const availableLocal = maxLength - domain.length - 4; // -4 for '@' and '...'
    
    if (availableLocal <= 3) {
      return `...@${domain}`;
    }
    
    return `${local.slice(0, availableLocal)}...@${domain}`;
  },

  // Format text for truncation
  truncateText(text: string, maxLength: number, suffix = '...'): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - suffix.length) + suffix;
  },

  // Format list items
  formatList(items: string[], conjunction = 'and'): string {
    if (items.length === 0) return '';
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
    
    const last = items[items.length - 1];
    const rest = items.slice(0, -1);
    return `${rest.join(', ')}, ${conjunction} ${last}`;
  },

  // Format initials
  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  },

  // Format search query highlight
  highlightSearchTerm(text: string, searchTerm: string): string {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  },

  // Format JSON for display
  formatJSON(obj: any, indent = 2): string {
    try {
      return JSON.stringify(obj, null, indent);
    } catch (error) {
      return '[Invalid JSON]';
    }
  },

  // Format URL for display
  formatUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return url;
    }
  },

  // Format version number
  formatVersion(version: string): string {
    // Remove 'v' prefix if present
    const cleanVersion = version.replace(/^v/, '');
    
    // Split into parts and pad with zeros if needed
    const parts = cleanVersion.split('.');
    while (parts.length < 3) {
      parts.push('0');
    }
    
    return `v${parts.join('.')}`;
  },

  // Format error message for user display
  formatErrorMessage(error: Error | string): string {
    const message = typeof error === 'string' ? error : error.message;
    
    // Capitalize first letter and add period if missing
    const formatted = message.charAt(0).toUpperCase() + message.slice(1);
    return formatted.endsWith('.') ? formatted : `${formatted}.`;
  },

  // Format boolean for display
  formatBoolean(value: boolean, options?: { trueText?: string; falseText?: string }): string {
    const { trueText = 'Yes', falseText = 'No' } = options || {};
    return value ? trueText : falseText;
  }
}; 