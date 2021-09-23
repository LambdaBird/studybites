import * as globals from './globals';
import * as userService from './userService';
import * as lessonService from './lessonService';
import * as emailService from './emailService';
import * as courseService from './courseService';

export default {
  globals,
  userService,
  emailService,
  lessonService,
  courseService,
};

export * from './globals';
export * from './userService';
export * from './lessonService';
export * from './courseService';
export * from './emailService';
