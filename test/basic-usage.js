const ContactedAI = require('../src/index');

async function example() {
    // Initialize the client
    const contacted = new ContactedAI({
        apiKey: process.env.CONTACTED_API_KEY || "your-api-key-here"
    });

    try {
        // Send a message (your exact API!)
        const result = await contacted.send({
            from: "sender@example.com",
            to: "receiver@example.com",
            prompt: "Generate a personalized welcome email",
            data: {
                "name": "John Doe",
                "plan": "premium",
                "link": "https://dashboard.example.com"
            }
        });

        console.log('Message sent successfully:', result);



    } catch (error) {
        console.error('Error:', error.message);
    }
}

example();

// ====================================
// test/contacted.test.js
const ContactedAI = require('../src/index');

describe('ContactedAI SDK', () => {
    let contacted;

    beforeEach(() => {
        contacted = new ContactedAI({
            apiKey: 'test-api-key'
        });
    });

    test('should initialize with API key', () => {
        expect(contacted.apiKey).toBe('test-api-key');
    });

    test('should throw error without API key', () => {
        expect(() => {
            new ContactedAI({});
        }).toThrow('API key is required');
    });

    test('should validate required fields in send()', async () => {
        await expect(contacted.send({
            to: 'test@example.com',
            prompt: 'test'
            // missing 'from'
        })).rejects.toThrow('Both "from" and "to" addresses are required');
    });

    test('should validate prompt in send()', async () => {
        await expect(contacted.send({
            from: 'sender@example.com',
            to: 'receiver@example.com'
            // missing 'prompt'
        })).rejects.toThrow('Prompt is required');
    });
});

