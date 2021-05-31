/* eslint-disable max-classes-per-file */
export class UniqueViolationError extends Error {
  constructor(errors) {
    super();
    this.name = 'UniqueViolationError';
    this.errors = errors;
  }
}

export class AuthorizationError extends Error {
  constructor(errors) {
    super();
    this.name = 'AuthorizationError';
    this.errors = errors;
  }
}

export class NotFoundError extends Error {
  constructor(errors) {
    super();
    this.name = 'NotFoundError';
    this.errors = errors;
  }
}

export class BadRequestError extends Error {
  constructor(errors) {
    super();
    this.name = 'BadRequestError';
    this.errors = errors;
  }
}
