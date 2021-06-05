export const INVALID_ID = {
  key: 'lesson.errors.invalid_id',
  message: 'Invalid lesson id',
};

export const NOT_FOUND = {
  key: 'lesson.errors.not_found',
  message: 'Lesson not found',
};

export const INVALID_STATUS = {
  key: 'lesson.errors.invalid_status',
  message: 'Invalid status',
};

export const INVALID_ENROLL = {
  fallback: 'errors.not_found',
  errors: [
    {
      key: 'lesson.errors.invalid_enroll',
      message: 'Requested lesson is not public or you have already enrolled',
    },
  ],
};

export const ENROLL_SUCCESS = {
  key: 'lesson.enroll_success',
  message: 'Successfully enrolled',
};
