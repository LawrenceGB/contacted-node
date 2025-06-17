const {
    validateSendOptions,
    validatePrompt,
    validateData,
    validateEmails,
    isValidEmail,
    validateSubject
} = require('../src/validation');

describe('Email Validation', () => {
    test('should validate correct email formats', () => {
        expect(isValidEmail('test@example.com')).toBe(true);
        expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
        expect(isValidEmail('test+label@example.org')).toBe(true);
    });

    test('should reject invalid email formats', () => {
        expect(isValidEmail('invalid-email')).toBe(false);
        expect(isValidEmail('test@')).toBe(false);
        expect(isValidEmail('@example.com')).toBe(false);
        expect(isValidEmail('test..test@example.com')).toBe(false);
        expect(isValidEmail('test@example')).toBe(false);
    });

    test('should validate required email fields', () => {
        expect(() => validateEmails('', 'test@example.com'))
            .toThrow('Both "from" and "to" email addresses are required');

        expect(() => validateEmails('test@example.com', ''))
            .toThrow('Both "from" and "to" email addresses are required');
    });

    test('should validate email format in validateEmails', () => {
        expect(() => validateEmails('invalid-email', 'test@example.com'))
            .toThrow('Invalid "from" email address format');

        expect(() => validateEmails('test@example.com', 'invalid-email'))
            .toThrow('Invalid "to" email address format');
    });
});

describe('Subject Validation', () => {
    test('should validate subject is required', () => {
        expect(() => validateSubject(undefined))
            .toThrow('Subject is required');

        expect(() => validateSubject(null))
            .toThrow('Subject is required');
    });

    test('should validate subject is a string', () => {
        expect(() => validateSubject(123))
            .toThrow('Subject must be a string');

        expect(() => validateSubject({}))
            .toThrow('Subject must be a string');

        expect(() => validateSubject([]))
            .toThrow('Subject must be a string');

        expect(() => validateSubject(true))
            .toThrow('Subject must be a string');
    });

    test('should validate subject length', () => {
        expect(() => validateSubject('a'))
            .toThrow('Subject must be at least 2 characters long');

        expect(() => validateSubject(''))
            .toThrow('Subject must be at least 2 characters long');

        const longSubject = 'a'.repeat(257);
        expect(() => validateSubject(longSubject))
            .toThrow('Subject must be no more than 256 characters long');
    });

    test('should accept valid subjects', () => {
        expect(() => validateSubject('Hi')).not.toThrow();
        expect(() => validateSubject('Hello there')).not.toThrow();
        expect(() => validateSubject('Meeting Tomorrow')).not.toThrow();

        // Test exactly at boundaries
        expect(() => validateSubject('ab')).not.toThrow(); // exactly 2 chars
        expect(() => validateSubject('a'.repeat(256))).not.toThrow(); // exactly 256 chars
    });
});

describe('Prompt Validation', () => {
    test('should validate prompt is required', () => {
        expect(() => validatePrompt(undefined))
            .toThrow('Prompt is required');

        expect(() => validatePrompt(null))
            .toThrow('Prompt is required');
    });

    test('should validate prompt is a string', () => {
        expect(() => validatePrompt(123))
            .toThrow('Prompt must be a string');

        expect(() => validatePrompt({}))
            .toThrow('Prompt must be a string');
    });

    test('should validate prompt length', () => {
        expect(() => validatePrompt('short'))
            .toThrow('Prompt must be at least 10 characters long');

        const longPrompt = 'a'.repeat(2001);
        expect(() => validatePrompt(longPrompt))
            .toThrow('Prompt must be no more than 2000 characters long');
    });

    test('should accept valid prompts', () => {
        expect(() => validatePrompt('This is a valid prompt with enough characters'))
            .not.toThrow();
    });
});

describe('Data Validation', () => {
    test('should allow optional data', () => {
        expect(() => validateData(undefined)).not.toThrow();
        expect(() => validateData(null)).not.toThrow();
    });

    test('should validate data is an object', () => {
        expect(() => validateData('string'))
            .toThrow('Data must be an object');

        expect(() => validateData([]))
            .toThrow('Data must be an object');

        expect(() => validateData(123))
            .toThrow('Data must be an object');
    });

    test('should validate data keys are strings', () => {
        expect(() => validateData({ '': 'value' }))
            .toThrow('All data keys must be non-empty strings');

        expect(() => validateData({ '   ': 'value' }))
            .toThrow('All data keys must be non-empty strings');
    });

    test('should validate data keys have no spaces', () => {
        expect(() => validateData({ 'key with space': 'value' }))
            .toThrow('Data keys cannot contain spaces');

        expect(() => validateData({ 'key\twith\ttab': 'value' }))
            .toThrow('Data keys cannot contain spaces');
    });

    test('should accept valid data objects', () => {
        expect(() => validateData({
            name: 'John Doe',
            age: 30,
            active: true,
            link: 'https://example.com'
        })).not.toThrow();
    });
});

describe('Complete Send Options Validation', () => {
    const validOptions = {
        from: 'sender@example.com',
        to: 'receiver@example.com',
        subject: 'Meeting Tomorrow',
        prompt: 'This is a valid prompt with enough characters',
        data: {
            name: 'John',
            link: 'https://example.com'
        }
    };

    test('should validate complete valid options', () => {
        expect(() => validateSendOptions(validOptions)).not.toThrow();
    });

    test('should fail on missing subject', () => {
        const { subject, ...optionsWithoutSubject } = validOptions;
        expect(() => validateSendOptions(optionsWithoutSubject))
            .toThrow('Subject is required');
    });

    test('should fail on invalid subject type', () => {
        expect(() => validateSendOptions({
            ...validOptions,
            subject: 123
        })).toThrow('Subject must be a string');
    });

    test('should fail on subject too short', () => {
        expect(() => validateSendOptions({
            ...validOptions,
            subject: 'a'
        })).toThrow('Subject must be at least 2 characters long');
    });

    test('should fail on subject too long', () => {
        expect(() => validateSendOptions({
            ...validOptions,
            subject: 'a'.repeat(257)
        })).toThrow('Subject must be no more than 256 characters long');
    });

    test('should fail on invalid email', () => {
        expect(() => validateSendOptions({
            ...validOptions,
            from: 'invalid-email'
        })).toThrow('Invalid "from" email address format');
    });

    test('should fail on invalid prompt', () => {
        expect(() => validateSendOptions({
            ...validOptions,
            prompt: 'short'
        })).toThrow('Prompt must be at least 10 characters long');
    });

    test('should fail on invalid data', () => {
        expect(() => validateSendOptions({
            ...validOptions,
            data: { 'key with space': 'value' }
        })).toThrow('Data keys cannot contain spaces');
    });

    test('should work without data field', () => {
        const { data, ...optionsWithoutData } = validOptions;
        expect(() => validateSendOptions(optionsWithoutData)).not.toThrow();
    });

    test('should accept minimum valid subject', () => {
        expect(() => validateSendOptions({
            ...validOptions,
            subject: 'Hi'
        })).not.toThrow();
    });

    test('should accept maximum valid subject', () => {
        expect(() => validateSendOptions({
            ...validOptions,
            subject: 'a'.repeat(256)
        })).not.toThrow();
    });
});