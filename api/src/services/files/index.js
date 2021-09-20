import fp from 'fastify-plugin';
import * as Minio from 'minio';

import { router } from './routes';

const minio = new Minio.Client({
  endPoint: process.env.S3_HOST,
  port: +process.env.S3_PORT,
  useSSL: false,
  accessKey: process.env.S3_ACCESS_KEY,
  secretKey: process.env.S3_SECRET_KEY,
});

const filesService = (instance, opts, done) => {
  instance.decorate('s3', minio);
  instance.register(router, opts);
  done();
};

export default fp(filesService);
