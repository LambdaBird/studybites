import objection from 'objection';

import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from '../validation/errors';

export default class BaseModel extends objection.Model {
  static query(trx) {
    return super.query(trx).onError(({ constructor, data: { error } }) => {
      if (typeof error === 'object') {
        throw new error.constructor(error.message);
      }
      switch (constructor) {
        case objection.DBError:
          throw new Error('internal');
        case objection.DataError:
          throw new BadRequestError(error || 'bad data');
        case objection.CheckViolationError:
          throw new BadRequestError(error || 'constraint violation');
        case objection.ForeignKeyViolationError:
          throw new ConflictError(error || 'foreign key violation');
        case objection.NotNullViolationError:
          throw new BadRequestError(error || 'not null violation');
        case objection.UniqueViolationError:
          throw new ConflictError(error || 'uniquie violdation');
        case objection.NotFoundError:
          throw new NotFoundError(error || 'not found');
        case objection.ValidationError:
          throw new BadRequestError(error || 'validation');
        default:
          throw new Error('internal');
      }
    });
  }
}
