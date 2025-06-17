const axios = require('axios');
const { validateSendOptions } = require('./validation');

class ContactedAI {
    constructor(options) {
        if (!options || !options.apiKey) {
            throw new Error('API key is required');
        }

        this.apiKey = options.apiKey;
        this.baseURL = options.baseURL || 'https://api.contacted.io'; // Your API URL
        this.timeout = options.timeout || 30000;

        // Setup axios instance
        this.client = axios.create({
            baseURL: this.baseURL,
            timeout: this.timeout,
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                'User-Agent': 'contacted-node/1.0.0'
            }
        });
    }

    /**
     * Send a message through the Contacted AI API
     * @param {Object} options - Send options
     * @param {string} options.subject - Email subject line
     * @param {string} options.from - Sender address
     * @param {string} options.to - Receiver address
     * @param {string} options.prompt - AI prompt (10-2000 characters)
     * @param {Object} options.data - Additional data object (optional)
     * @returns {Promise<Object>} API response
     */
    async send(options) {
        // Validate all input before making API call
        validateSendOptions(options);

        const {subject, from, to, prompt, data } = options;

        try {
            const response = await this.client.post('/send', {
                subject,
                from,
                to,
                prompt,
                data: data || {}
            });

            return response.data;
        } catch (error) {
            // Handle different error types
            if (error.response) {
                // API returned an error response
                const status = error.response.status;
                const errorMessage = error.response.data?.message || 'API request failed';

                if (status === 429) {
                    const retryAfter = error.response.data?.retry_after || 60;
                    throw new Error(`ContactedAI API Error: Rate limit exceeded. Try again in ${retryAfter} seconds.`);
                } else {
                    throw new Error(`ContactedAI API Error: ${errorMessage}`);
                }
            } else if (error.request) {
                // Network error
                throw new Error('Network error: Unable to reach ContactedAI API');
            } else {
                // Other error
                throw new Error(`Request error: ${error.message}`);
            }
        }
    }

    /**
     * Get the status of a sent message
     * @param {string} messageId - The unique message ID returned from send()
     * @returns {Promise<Object>} Message status information
     * @returns {string} returns.id - Message ID
     * @returns {string} returns.status - Current status (queued, sent, failed)
     * @returns {string} returns.message - Human-readable status message
     * @returns {string} returns.created_at - Message creation timestamp
     * @returns {string} returns.updated_at - Last status update timestamp
     * @returns {string} [returns.sent_at] - Delivery timestamp (when status is 'sent')
     * @returns {string} [returns.error_reason] - Error description (when status is 'failed')
     */
    async getMessageStatus(messageId) {
        if (!messageId) {
            throw new Error('Message ID is required');
        }

        if (typeof messageId !== 'string') {
            throw new Error('Message ID must be a string');
        }

        try {
            const response = await this.client.get('/message', {
                params: { id: messageId }
            });

            return response.data;
        } catch (error) {
            // Handle different error types
            if (error.response) {
                const status = error.response.status;
                const errorMessage = error.response.data?.message || 'API request failed';

                if (status === 404) {
                    throw new Error(`ContactedAI API Error: Message with ID '${messageId}' not found`);
                } else if (status === 401) {
                    throw new Error('ContactedAI API Error: Invalid API key');
                } else if (status === 429) {
                    const retryAfter = error.response.data?.retry_after || 60;
                    throw new Error(`ContactedAI API Error: Rate limit exceeded. Try again in ${retryAfter} seconds.`);
                } else {
                    throw new Error(`ContactedAI API Error: ${errorMessage}`);
                }
            } else if (error.request) {
                // Network error
                throw new Error('Network error: Unable to reach ContactedAI API');
            } else {
                // Other error
                throw new Error(`Request error: ${error.message}`);
            }
        }
    }

    /**
     * Check API status
     * @returns {Promise<Object>} Status information
     */
    async status() {
        try {
            const response = await this.client.get('/status');
            return response.data;
        } catch (error) {
            throw new Error(`Failed to get status: ${error.message}`);
        }
    }
}

module.exports = ContactedAI;