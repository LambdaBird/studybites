export const Roles = {
  SUPER_ADMIN: 'SuperAdmin',
  TEACHER: 'Teacher',
};

export const allowedImageTypes = ['image/png', 'image/jpeg'];

export const allowedTypes = [
  ...allowedImageTypes,
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/epub+zip',
  'application/vnd.oasis.opendocument.presentation',
  'application/vnd.oasis.opendocument.spreadsheet',
  'application/vnd.oasis.opendocument.text',
  'application/rtf',
  'text/plain',
  'application/pdf',
];
