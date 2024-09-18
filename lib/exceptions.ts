export class TorHttpException extends Error {
  constructor(message: string) {
    super(`[HTTP]: ${message}`);
  }
}
