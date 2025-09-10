import DOMPurify from 'dompurify';

/**
 * SECURITY: Input sanitization utility using DOMPurify
 * Removes HTML tags, scripts, and validates against suspicious patterns
 */
export const sanitizeInput = (input: string, maxLength = 200): string => {
    if (!input) return '';
    
    // Remove all HTML tags and scripts, keeping only text
    const cleaned = DOMPurify.sanitize(input, { 
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: []
    });
    
    // Additional validation for suspicious patterns
    const suspiciousPatterns = [
        /javascript:/gi,
        /data:\s*text\/html/gi,
        /vbscript:/gi,
        /<script/gi,
        /on\w+\s*=/gi
    ];
    
    const hasSuspiciousContent = suspiciousPatterns.some(pattern => pattern.test(cleaned));
    if (hasSuspiciousContent) {
        console.warn('Suspicious content detected and sanitized:', input);
        return cleaned.replace(/[<>'"&;()[\]{}]/g, '');
    }
    
    return cleaned.trim().slice(0, maxLength);
};

/**
 * Sanitize email addresses with additional validation
 */
export const sanitizeEmail = (email: string): string => {
    const cleanEmail = sanitizeInput(email, 254);
    
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
        console.warn('Invalid email format detected:', email);
        return '';
    }
    
    return cleanEmail;
};

/**
 * Sanitize usernames with specific character restrictions
 */
export const sanitizeUsername = (username: string): string => {
    const cleanUsername = sanitizeInput(username, 50);
    
    // Only allow alphanumeric characters, underscores, and hyphens
    const validUsername = cleanUsername.replace(/[^a-zA-Z0-9_-]/g, '');
    
    return validUsername;
};

/**
 * Sanitize book titles and other content fields
 */
export const sanitizeContent = (content: string, maxLength = 500): string => {
    return sanitizeInput(content, maxLength);
};

/**
 * Validate and sanitize message content for chat systems
 */
export const sanitizeChatMessage = (message: string): string => {
    const cleanMessage = sanitizeInput(message, 1000);
    
    // Additional validation for chat messages
    if (cleanMessage.length === 0) {
        throw new Error('Message cannot be empty');
    }
    
    // Prevent messages that are only whitespace or special characters
    if (!/[a-zA-Z0-9]/.test(cleanMessage)) {
        throw new Error('Message must contain valid characters');
    }
    
    return cleanMessage;
};

/**
 * Comprehensive input validation for user profiles
 */
export const validateUserInput = {
    email: sanitizeEmail,
    username: sanitizeUsername,
    content: sanitizeContent,
    chatMessage: sanitizeChatMessage,
    general: sanitizeInput
};