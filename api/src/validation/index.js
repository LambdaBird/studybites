import fp from 'fastify-plugin';

import config from '../../config';

import {
  error4xx,
  error5xx,
  lessonIdParam,
  lessonSearch,
  userSearch,
  lessonStatus,
} from './schemas';
import errorHandler from './errorHandler';

export default fp((instance, opts, next) => {
  instance.decorate('config', config);

  instance.addSchema({
    $id: 'paramsLessonId',
    ...lessonIdParam,
  });

  instance.addSchema({
    $id: 'lessonSearch',
    ...lessonSearch,
  });

  instance.addSchema({
    $id: 'userSearch',
    ...userSearch,
  });

  instance.addSchema({
    $id: '4xx',
    error4xx,
  });

  instance.addSchema({
    $id: '5xx',
    error5xx,
  });

  instance.addSchema({
    $id: 'lessonStatus',
    ...lessonStatus,
  });

  instance.setErrorHandler(errorHandler);

  return next();
});
