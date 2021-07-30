export class NotFoundError extends Error {
  constructor(message) {
    super();
    this.name = 'NotFoundError';
    this.statusCode = 404;
    this.message = message;
  }
}
