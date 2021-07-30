export class ConflictError extends Error {
  constructor(message) {
    super();
    this.name = 'ConflictError';
    this.statusCode = 409;
    this.message = message;
  }
}
