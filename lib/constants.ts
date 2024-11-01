export enum HttpMethod {
    POST = 'POST',
    GET = 'GET',
    DELETE = 'DELETE',
    PUT = 'PUT',
    PATCH = 'PATCH',
}

export const ALLOWED_PROTOCOLS = ['http:', 'https:'];

export enum MimeTypes {
    JSON = 'application/json',
    HTML = 'text/html',
    FORM = 'application/x-www-form-urlencoded',
}

export const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; rv:109.0) Gecko/20100101 Firefox/115.0',
}
