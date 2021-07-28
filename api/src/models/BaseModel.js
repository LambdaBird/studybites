import objection from 'objection';

import { globalErrors as errors } from '../config';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from '../validation/errors';

export default class BaseModel extends objection.Model {
  static query(trx) {
    return super.query(trx).onError(({ constructor, data: { error } = {} }) => {
      if (typeof error === 'object') {
        throw new error.constructor(error.message);
      }
      switch (constructor) {
        case objection.DBError:
          throw new Error(errors.GLOBAL_ERR_INTERNAL_SERVER_ERROR);
        case objection.DataError:
          throw new BadRequestError(error || errors.GLOBAL_ERR_DATA_ERROR);
        case objection.CheckViolationError:
          throw new BadRequestError(error || errors.GLOBAL_ERR_CHECK_VIOLATION);
        case objection.ForeignKeyViolationError:
          throw new ConflictError(error || errors.GLOBAL_ERR_FOREIGN_VIOLATION);
        case objection.NotNullViolationError:
          throw new BadRequestError(
            error || errors.GLOBAL_ERR_NOT_NULL_VIOLATION,
          );
        case objection.UniqueViolationError:
          throw new ConflictError(error || errors.GLOBAL_ERR_UNIQUE_VIOLATION);
        case objection.NotFoundError:
          throw new NotFoundError(error || errors.GLOBAL_ERR_NOT_FOUND);
        case objection.ValidationError:
          throw new BadRequestError(
            error || errors.GLOBAL_ERR_VALIDATION_ERROR,
          );
        default:
          throw new Error(errors.GLOBAL_ERR_INTERNAL_SERVER_ERROR);
      }
    });
  }
}
