/**
 * Validates email format
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validates prompt according to backend schema
 * @param {any} prompt
 * @throws {Error} If validation fails
 */
function validatePrompt(prompt) {
    // Check if prompt exists (required)
    if (prompt === undefined || prompt === null) {
        throw new Error('Prompt is required');
    }

    // Check if prompt is a string
    if (typeof prompt !== 'string') {
        throw new Error('Prompt must be a string');
    }

    // Check length (10-250 characters)
    if (prompt.length < 10) {
        throw new Error('Prompt must be at least 10 characters long');
    }

    if (prompt.length > 250) {
        throw new Error('Prompt must be no more than 250 characters long');
    }
}

/**
 * Validates data object according to backend schema
 * @param {any} data
 * @throws {Error} If validation fails
 */
function validateData(data) {
    // Data is optional, so null/undefined is fine
    if (data === null || data === undefined) {
        return;
    }

    // Check if data is an object
    if (typeof data !== 'object' || Array.isArray(data)) {
        throw new Error('Data must be an object');
    }

    // Check all keys and values
    for (const [key, value] of Object.entries(data)) {
        // Check that key is a non-empty string
        if (typeof key !== 'string' || key.trim() === '') {
            throw new Error('All data keys must be non-empty strings');
        }

        // Check if key contains spaces
        if (/\s/.test(key)) {
            throw new Error('Data keys cannot contain spaces');
        }

        // Values can be any type as mentioned in your UI comment
        // "Don't worry about types" - so no validation on values needed
    }
}

/**
 * Validates email addresses
 * @param {string} from
 * @param {string} to
 * @throws {Error} If validation fails
 */
function validateEmails(from, to) {
    // Check required fields
    if (!from || !to) {
        throw new Error('Both "from" and "to" email addresses are required');
    }

    // Check if they are strings
    if (typeof from !== 'string' || typeof to !== 'string') {
        throw new Error('Email addresses must be strings');
    }

    // Validate email format
    if (!isValidEmail(from)) {
        throw new Error('Invalid "from" email address format');
    }

    if (!isValidEmail(to)) {
        throw new Error('Invalid "to" email address format');
    }
}

/**
 * Main validation function for send options
 * @param {Object} options
 * @throws {Error} If any validation fails
 */
function validateSendOptions(options) {
    if (!options || typeof options !== 'object') {
        throw new Error('Send options must be an object');
    }

    const { from, to, prompt, data } = options;

    // Validate emails
    validateEmails(from, to);

    // Validate prompt
    validatePrompt(prompt);

    // Validate data
    validateData(data);
}

module.exports = {
    validateSendOptions,
    validatePrompt,
    validateData,
    validateEmails,
    isValidEmail
};