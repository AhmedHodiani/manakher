/**
 * Detects the text direction based on content language.
 * Returns 'rtl' if the content contains Arabic characters, 'ltr' otherwise.
 */

export type TextDirection = 'rtl' | 'ltr';

/**
 * Detects if a string contains Arabic characters.
 * Uses Unicode ranges for Arabic, Arabic Extended-A, Arabic Extended-B, and Arabic Supplement.
 */
export function containsArabic(text: string): boolean {
  if (!text) return false;
  
  // Unicode ranges for Arabic:
  // \u0600-\u06FF: Arabic
  // \u0750-\u077F: Arabic Supplement
  // \u08A0-\u08FF: Arabic Extended-A
  // \uFB50-\uFDFF: Arabic Presentation Forms-A
  // \uFE70-\uFEFF: Arabic Presentation Forms-B
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g;
  
  return arabicRegex.test(text);
}

/**
 * Determines the text direction based on content.
 * If the content contains Arabic characters, returns 'rtl', otherwise 'ltr'.
 */
export function getTextDirection(text: string): TextDirection {
  return containsArabic(text) ? 'rtl' : 'ltr';
}

/**
 * Determines the dominant text direction in a string.
 * Counts Arabic vs. non-Arabic characters to determine the primary direction.
 * If more than 10% of characters are Arabic, returns 'rtl'.
 */
export function getDominantTextDirection(text: string): TextDirection {
  if (!text) return 'ltr';
  
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g;
  const arabicMatches = text.match(arabicRegex) || [];
  const arabicPercentage = arabicMatches.length / text.length;
  
  // If more than 10% of the text is Arabic, treat as RTL
  return arabicPercentage > 0.1 ? 'rtl' : 'ltr';
}
