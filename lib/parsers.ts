import qs from 'querystring';

export function formParser(data: Record<string, string>) {
    return qs.stringify(data);
}

export function jsonParser(data: object) {
    return JSON.stringify(data);
}
