# Contacted TypeScript and JavaScript API Library

Official Node.js SDK for the Contacted API.


[![npm version](https://badge.fury.io/js/contacted.svg)](https://badge.fury.io/js/contacted)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Get Your API Key

First, sign up and get your API key at https://contacted.io


## Installation

```bash
npm install contacted
```

## Quick Start

```javascript
const ContactedAI = require('contacted');

const contacted = new ContactedAI({
  apiKey: 'your-api-key-here'
});

// Send a message
const result = await contacted.send({
  subject: 'Thank you for signing up with us.',
  from: 'sender@example.com',
  to: 'receiver@example.com',
  prompt: 'Generate a personalized welcome email',
  data: {
    name: 'John Doe',
    link: 'https://example.com'
  }
});

console.log('Message sent:', result);

// Check message status
const status = await contacted.getMessageStatus(result.id);
console.log('Message status:', status.status);
```

## TypeScript Support

```typescript
import ContactedAI, { SendOptions } from 'contacted';

const contacted = new ContactedAI({ 
  apiKey: process.env.CONTACTED_API_KEY 
});

const options: SendOptions = {
  subject: 'Email subject line',
  from: 'sender@example.com',
  to: 'receiver@example.com',
  prompt: 'Generate email content',
  data: { name: 'John' }
};

await contacted.send(options);
```

## API Reference

### `new ContactedAI(options)`

Creates a new ContactedAI client instance.

**Parameters:**
- `apiKey` (string, required): Your ContactedAI API key
- `baseURL` (string, optional): Custom API base URL
- `timeout` (number, optional): Request timeout in milliseconds (default: 30000)

### `contacted.send(options)`

Send a message through the ContactedAI API.

**Parameters:**
- `subject` (string, required): Email subject (2-256 characters)
- `from` (string, required): Valid sender email address
- `to` (string, required): Valid receiver email address
- `prompt` (string, required): AI prompt (10-250 characters)
- `data` (object, optional): Additional data for personalization

**Validation Rules:**
- Subject must be 2-256 characters
- Email addresses must be valid format
- Prompt must be 10-250 characters
- Data keys cannot contain spaces
- Data keys must be non-empty strings

**Returns:** `Promise<SendResponse>`

### `contacted.getMessageStatus(messageId)`

Get the status of a sent message.

**Parameters:**
- `messageId` (string, required): The unique message ID returned from `send()`

**Returns:** `Promise<MessageStatusResponse>` - Message status information containing:
- `id` (string): Message ID
- `status` (string): Current status (`queued`, `sent`, `failed`)
- `message` (string): Human-readable status message
- `created_at` (string): Message creation timestamp
- `updated_at` (string): Last status update timestamp
- `sent_at` (string, optional): Delivery timestamp (when status is 'sent')
- `error_reason` (string, optional): Error description (when status is 'failed')

**Throws:** `Error` - If messageId is invalid or API error occurs

### `contacted.status()`

Check the API status and health.

**Returns:** `Promise<StatusResponse>`

## Error Handling

The SDK provides detailed error messages for validation and API errors:

```javascript
try {
  await contacted.send({
    subejct: 'test error',
    from: 'invalid-email',
    to: 'user@example.com',
    prompt: 'short'
  });
} catch (error) {
  console.error('Error:', error.message);
  // "Invalid 'from' email address format"
}
```

## Examples

### Basic Usage
```javascript
const contacted = new ContactedAI({
  apiKey: process.env.CONTACTED_API_KEY
});

const result = await contacted.send({
  subject: 'A warm welcome from my service',
  from: 'noreply@myapp.com',
  to: 'user@example.com',
  prompt: 'Create a welcome email for a new premium user',
  data: {
    username: 'john_doe',
    plan: 'premium',
    dashboardUrl: 'https://app.myservice.com'
  }
});
```

### Send and Track Message Status
```javascript
const ContactedAI = require('contacted');

const contacted = new ContactedAI({
  apiKey: 'your-api-key-here'
});

// Send message
const result = await contacted.send({
  subject: 'Your order confirmation',
  from: 'orders@mystore.com',
  to: 'customer@example.com',
  prompt: 'Generate an order confirmation email',
  data: {
    orderId: '12345',
    total: '$99.99',
    deliveryDate: '2024-01-20'
  }
});

const messageId = result.id;
console.log(`✅ Message queued with ID: ${messageId}`);

// Check status
let status = await contacted.getMessageStatus(messageId);
console.log(`📧 Status: ${status.status} - ${status.message}`);

// Poll for completion (optional)
while (status.status === 'queued') {
  await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
  status = await contacted.getMessageStatus(messageId);
  console.log(`📧 Status: ${status.status}`);
}

if (status.status === 'sent') {
  console.log(`✅ Message delivered at ${status.sent_at}`);
} else if (status.status === 'failed') {
  console.log(`❌ Message failed: ${status.error_reason}`);
}
```

### With Error Handling
```javascript
try {
  const result = await contacted.send(options);
  console.log('✅ Email sent successfully:', result.id);
  
  // Check status
  const status = await contacted.getMessageStatus(result.id);
  console.log(`📧 Current status: ${status.status}`);
  
} catch (error) {
  if (error.message.includes('Invalid')) {
    console.error('❌ Validation error:', error.message);
  } else if (error.message.includes('not found')) {
    console.error('❌ Message not found:', error.message);
  } else {
    console.error('❌ API error:', error.message);
  }
}
```

### Using async/await with TypeScript
```typescript
import ContactedAI, { SendResponse, MessageStatusResponse } from 'contacted';

const contacted = new ContactedAI({
  apiKey: process.env.CONTACTED_API_KEY!
});

async function sendAndTrack(): Promise<void> {
  try {
    const result: SendResponse = await contacted.send({
      subject: 'Welcome aboard!',
      from: 'welcome@myapp.com',
      to: 'user@example.com',
      prompt: 'Create a friendly welcome message',
      data: { firstName: 'Sarah' }
    });

    const status: MessageStatusResponse = await contacted.getMessageStatus(result.id);
    console.log(`Message ${result.id} is ${status.status}`);
  } catch (error) {
    console.error('Operation failed:', error);
  }
}
```

## License

MIT

## Support

- 📧 Email: support@contacted.io
- 🐛 Issues: [GitHub Issues](https://github.com/LawrenceGB/contacted-node/issues)
- 📖 Documentation: [contacted.gitbook.io](https://contacted.gitbook.io/docs/)