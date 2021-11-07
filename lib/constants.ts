export enum HttpMethod {
    POST = 'POST',
    GET = 'GET'
}

export const ALLOWED_PROTOCOLS = ['http:', 'https:'];

export enum MimeTypes {
    JSON = 'application/json',
    HTML = 'text/html',
    FORM = 'application/x-www-form-urlencoded',
}

export function getSocksError(status: number) {
    switch(status) {
        case 0x01:
            return 'General failure';
        case 0x02:
            return 'Connection not allowed by ruleset';
        case 0x03:
            return 'Network unreachable';
        case 0x04:
            return 'Host unreachable';
        case 0x05:
            return 'Connection refused by destination host';
        case 0x06:
            return 'TTL expired';
        case 0x07:
            return 'Command not supported / protocol error';
        case 0x08:
            return 'Address type not supported';
        default:
            return 'Unknown SOCKS response status';
    }
}