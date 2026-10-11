/**
 * @fileOverview ForgeOS Memory Privacy Firewall
 * Detects and scrubs PII (Personally Identifiable Information) from prompt contexts.
 */

export class PIIDetector {
  private static PII_PATTERNS = {
    email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    phone: /(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g,
    ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
    credit_card: /\b(?:\d[ -]*?){13,16}\b/g,
    api_key: /(?:key|api|auth|secret|token)[-_\s]*[=:]\s*[a-zA-Z0-9]{16,}/gi,
  };

  /**
   * Detects and replaces sensitive data with placeholders.
   */
  static scrubContext(text: string): { scrubbedText: string; detections: string[] } {
    let scrubbedText = text;
    const detections: string[] = [];

    Object.entries(this.PII_PATTERNS).forEach(([type, pattern]) => {
      const matches = scrubbedText.match(pattern);
      if (matches) {
        detections.push(...matches.map(m => `[${type.toUpperCase()}]`));
        scrubbedText = scrubbedText.replace(pattern, `[REDACTED_${type.toUpperCase()}]`);
      }
    });

    return { scrubbedText, detections };
  }

  /**
   * Validates if a context is safe for inference.
   */
  static isSafe(text: string): boolean {
    return !Object.values(this.PII_PATTERNS).some(pattern => pattern.test(text));
  }
}
