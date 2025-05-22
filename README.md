# ContactedAI SDK

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
  from: 'sender@example.com',
  to: 'receiver@example.com',
  prompt: 'Generate a personalized welcome email',
  data: {
    name: 'John Doe',
    link: 'https://example.com'
  }
});

console.log('Message sent:', result);
```

## TypeScript Support

```typescript
import ContactedAI, { SendOptions } from 'contacted';

const contacted = new ContactedAI({ 
  apiKey: process.env.CONTACTED_API_KEY 
});

const options: SendOptions = {
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
- `from` (string, required): Valid sender email address
- `to` (string, required): Valid receiver email address
- `prompt` (string, required): AI prompt (10-250 characters)
- `data` (object, optional): Additional data for personalization

**Validation Rules:**
- Email addresses must be valid format
- Prompt must be 10-250 characters
- Data keys cannot contain spaces
- Data keys must be non-empty strings

**Returns:** `Promise<SendResponse>`


### `contacted.status()`

Check the API status and health.

**Returns:** `Promise<StatusResponse>`

## Error Handling

The SDK provides detailed error messages for validation and API errors:

```javascript
try {
  await contacted.send({
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

### With Error Handling
```javascript
try {
  const result = await contacted.send(options);
  console.log('✅ Email sent successfully:', result.id);
} catch (error) {
  if (error.message.includes('Invalid')) {
    console.error('❌ Validation error:', error.message);
  } else {
    console.error('❌ API error:', error.message);
  }
}
```

## License

MIT

## Support

- 📧 Email: support@contacted.io
- 🐛 Issues: [GitHub Issues](https://github.com/LawrenceGB/contacted-node/issues)
- 📖 Documentation: [contacted.gitbook.io](https://contacted.gitbook.io/docs/)