export class AuthorizationError extends Error {
  constructor(message) {
    super();
    this.name = 'AuthorizationError';
    this.statusCode = 401;
    this.message = message;
  }
}
