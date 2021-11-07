import { AddressInfo, Socket, SocketConnectOpts } from "net";
import { Socks } from "./socks";

export class AgentSocket {
    private readonly writeQueue: any[] = [];

    constructor(
        private readonly socks: Socks,
    ) {
        this.socks.on('connect', () => {
            this.writeQueue.forEach(chunk => {
                this.socks.socket.write(chunk);
            })
        });

        this.socks.on('data', (chunk) => {
            console.log(chunk.toString('utf-8'));
        })
    }

    addListener(event: string, listener: (...args: any[]) => void): this;
    addListener(event: "close", listener: (hadError: boolean) => void): this;
    addListener(event: "connect", listener: () => void): this;
    addListener(event: "data", listener: (data: Buffer) => void): this;
    addListener(event: "drain", listener: () => void): this;
    addListener(event: "end", listener: () => void): this;
    addListener(event: "error", listener: (err: Error) => void): this;
    addListener(event: "lookup", listener: (err: Error, address: string, family: string | number, host: string) => void): this;
    addListener(event: "ready", listener: () => void): this;
    addListener(event: "timeout", listener: () => void): this;
    addListener(event: any, listener: any): this {
        throw new Error("Method not implemented.");
    }
    emit(event: string | symbol, ...args: any[]): boolean;
    emit(event: "close", hadError: boolean): boolean;
    emit(event: "connect"): boolean;
    emit(event: "data", data: Buffer): boolean;
    emit(event: "drain"): boolean;
    emit(event: "end"): boolean;
    emit(event: "error", err: Error): boolean;
    emit(event: "lookup", err: Error, address: string, family: string | number, host: string): boolean;
    emit(event: "ready"): boolean;
    emit(event: "timeout"): boolean;
    emit(event: any, err?: any, address?: any, family?: any, host?: any): boolean {
        throw new Error("Method not implemented.");
    }
    on(event: string, listener: (...args: any[]) => void): this;
    on(event: "close", listener: (hadError: boolean) => void): this;
    on(event: "connect", listener: () => void): this;
    on(event: "data", listener: (data: Buffer) => void): this;
    on(event: "drain", listener: () => void): this;
    on(event: "end", listener: () => void): this;
    on(event: "error", listener: (err: Error) => void): this;
    on(event: "lookup", listener: (err: Error, address: string, family: string | number, host: string) => void): this;
    on(event: "ready", listener: () => void): this;
    on(event: "timeout", listener: () => void): this;
    on(event: any, listener: any): this {
        console.log(event);
        console.log(listener);

        return this;
    }
    once(event: string, listener: (...args: any[]) => void): this;
    once(event: "close", listener: (hadError: boolean) => void): this;
    once(event: "connect", listener: () => void): this;
    once(event: "data", listener: (data: Buffer) => void): this;
    once(event: "drain", listener: () => void): this;
    once(event: "end", listener: () => void): this;
    once(event: "error", listener: (err: Error) => void): this;
    once(event: "lookup", listener: (err: Error, address: string, family: string | number, host: string) => void): this;
    once(event: "ready", listener: () => void): this;
    once(event: "timeout", listener: () => void): this;
    once(event: any, listener: any): this {
        throw new Error("Method not implemented.");
    }
    prependListener(event: string, listener: (...args: any[]) => void): this;
    prependListener(event: "close", listener: (hadError: boolean) => void): this;
    prependListener(event: "connect", listener: () => void): this;
    prependListener(event: "data", listener: (data: Buffer) => void): this;
    prependListener(event: "drain", listener: () => void): this;
    prependListener(event: "end", listener: () => void): this;
    prependListener(event: "error", listener: (err: Error) => void): this;
    prependListener(event: "lookup", listener: (err: Error, address: string, family: string | number, host: string) => void): this;
    prependListener(event: "ready", listener: () => void): this;
    prependListener(event: "timeout", listener: () => void): this;
    prependListener(event: any, listener: any): this {
        throw new Error("Method not implemented.");
    }
    prependOnceListener(event: string, listener: (...args: any[]) => void): this;
    prependOnceListener(event: "close", listener: (hadError: boolean) => void): this;
    prependOnceListener(event: "connect", listener: () => void): this;
    prependOnceListener(event: "data", listener: (data: Buffer) => void): this;
    prependOnceListener(event: "drain", listener: () => void): this;
    prependOnceListener(event: "end", listener: () => void): this;
    prependOnceListener(event: "error", listener: (err: Error) => void): this;
    prependOnceListener(event: "lookup", listener: (err: Error, address: string, family: string | number, host: string) => void): this;
    prependOnceListener(event: "ready", listener: () => void): this;
    prependOnceListener(event: "timeout", listener: () => void): this;
    prependOnceListener(event: any, listener: any): this {
        throw new Error("Method not implemented.");
    }
    removeListener(event: "close", listener: () => void): this;
    removeListener(event: "data", listener: (chunk: any) => void): this;
    removeListener(event: "end", listener: () => void): this;
    removeListener(event: "error", listener: (err: Error) => void): this;
    removeListener(event: "pause", listener: () => void): this;
    removeListener(event: "readable", listener: () => void): this;
    removeListener(event: "resume", listener: () => void): this;
    removeListener(event: string | symbol, listener: (...args: any[]) => void): this;
    removeListener(event: any, listener: any): this {
        throw new Error("Method not implemented.");
    }
    [Symbol.asyncIterator](): AsyncIterableIterator<any> {
        throw new Error("Method not implemented.");
    }
    off(eventName: string | symbol, listener: (...args: any[]) => void): this {
        throw new Error("Method not implemented.");
    }
    removeAllListeners(event?: string | symbol): this {
        throw new Error("Method not implemented.");
    }
    setMaxListeners(n: number): this {
        throw new Error("Method not implemented.");
    }
    getMaxListeners(): number {
        throw new Error("Method not implemented.");
    }
    listeners(eventName: string | symbol): Function[] {
        throw new Error("Method not implemented.");
    }
    rawListeners(eventName: string | symbol): Function[] {
        throw new Error("Method not implemented.");
    }
    listenerCount(eventName: string | symbol): number {
        throw new Error("Method not implemented.");
    }
    eventNames(): (string | symbol)[] {
        throw new Error("Method not implemented.");
    }
    write(buffer: string | Uint8Array, cb?: (err?: Error) => void): boolean;
    write(str: string | Uint8Array, encoding?: BufferEncoding, cb?: (err?: Error) => void): boolean;
    write(str: any, encoding?: any, cb?: any): boolean {
        console.log(str);
        this.writeQueue.push(str);
        return true;
    }
    connect(options: SocketConnectOpts, connectionListener?: () => void): this;
    connect(port: number, host: string, connectionListener?: () => void): this;
    connect(port: number, connectionListener?: () => void): this;
    connect(path: string, connectionListener?: () => void): this;
    connect(port: any, host?: any, connectionListener?: any): this {
        throw new Error("Method not implemented.");
    }
    setEncoding(encoding?: BufferEncoding): this {
        throw new Error("Method not implemented.");
    }
    pause(): this {
        throw new Error("Method not implemented.");
    }
    resume(): this {
        throw new Error("Method not implemented.");
    }
    setTimeout(timeout: number, callback?: () => void): this {
        throw new Error("Method not implemented.");
    }
    setNoDelay(noDelay?: boolean): this {
        throw new Error("Method not implemented.");
    }
    setKeepAlive(enable?: boolean, initialDelay?: number): this {
        throw new Error("Method not implemented.");
    }
    address(): {} | AddressInfo {
        throw new Error("Method not implemented.");
    }
    unref(): this {
        throw new Error("Method not implemented.");
    }
    ref(): this {
        throw new Error("Method not implemented.");
    }
    localAddress?: string | undefined;
    localPort?: number | undefined;
    remoteAddress?: string | undefined;
    remoteFamily?: string | undefined;
    remotePort?: number | undefined;
    end(callback?: () => void): void;
    end(buffer: string | Uint8Array, callback?: () => void): void;
    end(str: string | Uint8Array, encoding?: BufferEncoding, callback?: () => void): void;
    end(str?: any, encoding?: any, callback?: any): void {
        throw new Error("Method not implemented.");
    }
    writable: boolean = true;

    _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null) => void): void {
        throw new Error("Method not implemented.");
    }
    _destroy(error: Error | null, callback: (error: Error | null) => void): void {
        throw new Error("Method not implemented.");
    }
    _final(callback: (error?: Error | null) => void): void {
        throw new Error("Method not implemented.");
    }
    setDefaultEncoding(encoding: BufferEncoding): this {
        throw new Error("Method not implemented.");
    }
    cork(): void {
        console.log('Cork');
    }
    uncork(): void {
        console.log('Uncork');
    }
    _read(size: number): void {
        throw new Error("Method not implemented.");
    }
    read(size?: number) {
        throw new Error("Method not implemented.");
    }
    isPaused(): boolean {
        throw new Error("Method not implemented.");
    }
    unpipe(destination?: NodeJS.WritableStream): this {
        throw new Error("Method not implemented.");
    }
    unshift(chunk: any, encoding?: BufferEncoding): void {
        throw new Error("Method not implemented.");
    }
    wrap(stream: NodeJS.ReadableStream): this {
        throw new Error("Method not implemented.");
    }
    push(chunk: any, encoding?: BufferEncoding): boolean {
        throw new Error("Method not implemented.");
    }
    destroy(error?: Error): void {
        throw new Error("Method not implemented.");
    }
    pipe<T extends NodeJS.WritableStream>(destination: T, options?: { end?: boolean | undefined; }): T {
        throw new Error("Method not implemented.");
    }
}