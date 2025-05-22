export interface ContactedAIOptions {
    apiKey: string;
    baseURL?: string;
    timeout?: number;
}

export interface SendOptions {
    from: string;
    to: string;
    prompt: string;
    data?: Record<string, any>;
}

export interface SendResponse {
    id: string;
    status: string;
    message?: string;
    [key: string]: any;
}

export interface AccountInfo {
    id: string;
    email: string;
    plan: string;
    usage: {
        current: number;
        limit: number;
    };
    [key: string]: any;
}

export interface StatusResponse {
    status: string;
    version: string;
    uptime: number;
    [key: string]: any;
}

export declare class ContactedAI {
    constructor(options: ContactedAIOptions);

    send(options: SendOptions): Promise<SendResponse>;
    getAccount(): Promise<AccountInfo>;
    status(): Promise<StatusResponse>;
}

export default ContactedAI;