export class BadRequestError extends Error {
  constructor(message) {
    super();
    this.name = 'BadRequestError';
    this.statusCode = 400;
    this.message = message;
  }
}
