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
     * @param {string} options.prompt - AI prompt (10-250 characters)
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
                const errorMessage = error.response.data?.message || 'API request failed';
                throw new Error(`ContactedAI API Error: ${errorMessage}`);
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