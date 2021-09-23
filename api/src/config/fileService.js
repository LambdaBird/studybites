import { FILE_SIZE_LIMIT } from './globals';

export const fileServiceErrors = {
  FILE_ERR_NO_MULTIPART: 'errors.file_no_multipart',
  FILE_ERR_INVALID_TYPE: 'errors.file_invalid_type',
  FILE_ERR_SIZE_LIMIT: 'errors.file_size_limit',
};

export const fileServiceAllowedTypes = {
  'image/png': FILE_SIZE_LIMIT,
  'image/jpeg': FILE_SIZE_LIMIT,
  'application/msword': FILE_SIZE_LIMIT,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    FILE_SIZE_LIMIT,
  'application/vnd.ms-powerpoint': FILE_SIZE_LIMIT,
  'application/vnd.openxmlformats-officedocument.presentationml.presentation':
    FILE_SIZE_LIMIT,
  'application/vnd.ms-excel': FILE_SIZE_LIMIT,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
    FILE_SIZE_LIMIT,
  'application/epub+zip': FILE_SIZE_LIMIT,
  'application/vnd.oasis.opendocument.presentation': FILE_SIZE_LIMIT,
  'application/vnd.oasis.opendocument.spreadsheet': FILE_SIZE_LIMIT,
  'application/vnd.oasis.opendocument.text': FILE_SIZE_LIMIT,
  'application/rtf': FILE_SIZE_LIMIT,
  'text/plain': FILE_SIZE_LIMIT,
  'application/pdf': FILE_SIZE_LIMIT,
};
