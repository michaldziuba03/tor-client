export class TorException extends Error {
  constructor(message: string) {
    super(`[SOCKS5]: ${message}`);
  }
}

export class TorHttpException extends Error {
  constructor(message: string) {
    super(`[HTTP]: ${message}`);
  }
}
