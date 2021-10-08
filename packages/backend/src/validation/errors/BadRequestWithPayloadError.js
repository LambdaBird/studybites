import { BadRequestError } from './BadRequestError';

export class BadRequestWithPayloadError extends BadRequestError {
  constructor(message, payload) {
    super(message);
    this.name = 'BadRequestWithPayloadError';
    this.payload = payload;
  }
}
