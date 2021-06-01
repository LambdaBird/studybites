import fastify from 'fastify';

import db, {
  ERROR_MISSING_FIELDS,
  ERROR_INVALID_ARRAY,
} from '../../src/plugins/objectionModel';

const app = fastify();

describe('Test the plugin registration:', () => {
  test('should throw an error if no connection provided', () => {
    app.register(db, {
      models: [],
    });

    app.after((err) => {
      expect(err).toEqual(new Error(ERROR_MISSING_FIELDS));
    });
  });

  test('should throw an error if no models provided', () => {
    app.register(db, {
      connection: 'DB_CONNECTION',
    });

    app.after((err) => {
      expect(err).toEqual(new Error(ERROR_MISSING_FIELDS));
    });
  });

  test('should throw an error if models is not an array', () => {
    app.register(db, {
      connection: 'DB_CONNECTION',
      models: 'model',
    });

    app.after((err) => {
      expect(err).toEqual(new Error(ERROR_INVALID_ARRAY));
    });
  });

  test('should throw an error if models array length is less than 1', () => {
    app.register(db, {
      connection: 'DB_CONNECTION',
      models: [],
    });

    app.after((err) => {
      expect(err).toEqual(new Error(ERROR_INVALID_ARRAY));
    });
  });
});
