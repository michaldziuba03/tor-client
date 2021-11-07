import qs from 'qs';

export function formParser(data: object) {
    return qs.stringify(data);
}

export function jsonParser(data: object) {
    return JSON.stringify(data);
}