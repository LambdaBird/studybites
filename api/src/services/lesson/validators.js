import * as yup from 'yup';

import {
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

const blocksValidator = yup
  .array()
  .typeError(propertyTypeError('lesson', 'blocks', 'array'))
  .of(
    yup.object().shape({
      revisionId: yup
        .string()
        .typeError(propertyTypeError('lesson', 'revisionId', 'string'))
        .required(requiredPropertyError('lesson', 'revisionId')),
      content: yup
        .object()
        .typeError(propertyTypeError('lesson', 'content', 'object')),
      type: yup
        .string()
        .typeError(propertyTypeError('lesson', 'type', 'string')),
      answer: yup
        .object()
        .typeError(propertyTypeError('lesson', 'answer', 'object')),
      weight: yup
        .number()
        .typeError(propertyTypeError('lesson', 'weight', 'number')),
    }),
  );

const nameValidatorPatch = yup
  .string()
  .typeError(propertyTypeError('lesson', 'name', 'string'));

export const postBodyValidator = yup.object({
  name: nameValidatorPost,
  description: descriptionValidator,
  status: statusValidator,
  blocks: blocksValidator,
});

export const patchBodyValidator = yup.object({
  name: nameValidatorPatch,
  description: descriptionValidator,
  status: statusValidator,
});

export const validateId = (paramId) => {
  const id = parseInt(paramId, 10);

  if (!id) {
    throw new yup.ValidationError(INVALID_ID);
  }

  return id;
};
