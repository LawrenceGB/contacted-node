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
            prompt: "Generate a personalized welcome email for the user", // 10+ chars
            data: {
                "name": "John Doe",
                "plan": "premium",
                "link": "https://dashboard.example.com"
            }
        });

        console.log('Message sent successfully:', result);

        // Get account info
        const account = await contacted.getAccount();
        console.log('Account info:', account);

    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function validationExamples() {
    const contacted = new ContactedAI({ apiKey: "test-key" });

    // These will throw validation errors BEFORE hitting your API:

    try {
        await contacted.send({
            from: "invalid-email",
            to: "user@example.com",
            prompt: "Generate email"
        });
    } catch (error) {
        console.log('❌ Email validation:', error.message);
        // "Invalid "from" email address format"
    }

    try {
        await contacted.send({
            from: "sender@example.com",
            to: "receiver@example.com",
            prompt: "short" // Less than 10 characters
        });
    } catch (error) {
        console.log('❌ Prompt validation:', error.message);
        // "Prompt must be at least 10 characters long"
    }

    try {
        await contacted.send({
            from: "sender@example.com",
            to: "receiver@example.com",
            prompt: "This is a valid prompt with enough characters",
            data: {
                "key with space": "invalid key" // Keys can't have spaces
            }
        });
    } catch (error) {
        console.log('❌ Data validation:', error.message);
        // "Data keys cannot contain spaces"
    }

    console.log('✅ All validation examples completed');
}

example();
validationExamples();


