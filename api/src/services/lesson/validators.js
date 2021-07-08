import * as yup from 'yup';

import {
  propertyLengthError,
  propertyTypeError,
  requiredPropertyError,
} from '../../validation/helpers';
import { INVALID_ID, INVALID_STATUS } from './constants';

const nameValidatorPost = yup
  .string()
  .typeError(propertyTypeError('lesson', 'name', 'string'))
  .required(requiredPropertyError('lesson', 'name'));

const descriptionValidator = yup
  .string()
  .typeError(propertyTypeError('lesson', 'description', 'string'));

const statusValidator = yup
  .string()
  .typeError(propertyTypeError('lesson', 'status', 'string'))
  .oneOf(['Draft', 'Public', 'Private', 'Archived'], INVALID_STATUS);

const lessonValidatorPost = yup
  .object()
  .typeError(propertyTypeError('lesson', 'lesson', 'object'))
  .required(requiredPropertyError('lesson', 'lesson'))
  .shape({
    name: nameValidatorPost,
    description: descriptionValidator,
    status: statusValidator,
  });

const blocksValidator = yup
  .array()
  .typeError(propertyTypeError('lesson', 'blocks', 'array'));

const nameValidatorPut = yup
  .string()
  .typeError(propertyTypeError('lesson', 'name', 'string'));

const lessonValidatorPut = yup
  .object()
  .typeError(propertyTypeError('lesson', 'lesson', 'object'))
  .shape({
    name: nameValidatorPut,
    description: descriptionValidator,
    status: statusValidator,
  });

const actionValidator = yup
  .string()
  .typeError(propertyTypeError('lesson', 'action', 'string'))
  .required(requiredPropertyError('lesson', 'action'));

const blockIdValidator = yup
  .string()
  .typeError(propertyTypeError('lesson', 'blockId', 'string'));

const revisionValidator = yup
  .string()
  .typeError(propertyTypeError('lesson', 'revision', 'string'));

const dataValidator = yup
  .object({
    question: yup.string(),
    answers: yup.array(),
    response: yup
      .array()
      .required(requiredPropertyError('lesson', 'response'))
      .typeError(propertyTypeError('lesson', 'response', 'array'))
      .min(1, propertyLengthError('lesson', 'response')),
  })
  .typeError(propertyTypeError('lesson', 'data', 'object'))
  .default(null)
  .nullable();

export const postBodyValidator = yup.object({
  lesson: lessonValidatorPost,
  blocks: blocksValidator,
});

export const putBodyValidator = yup.object({
  lesson: lessonValidatorPut,
  blocks: blocksValidator,
});

export const learnBodyValidator = yup.object({
  action: actionValidator,
  blockId: blockIdValidator,
  revision: revisionValidator,
  data: dataValidator,
});

export const validateId = (paramId) => {
  const id = parseInt(paramId, 10);

  if (!id) {
    throw new yup.ValidationError(INVALID_ID);
  }

  return id;
};
