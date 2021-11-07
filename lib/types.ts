import { HttpMethod } from "./constants";

export interface SendOptions {
    method: HttpMethod;
    data?: any;
    headers?: object;
}