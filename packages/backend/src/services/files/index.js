import fp from 'fastify-plugin';
import * as Minio from 'minio';

import { router } from './routes';
import { file } from './hooks/file';

const minio = new Minio.Client({
  endPoint: process.env.S3_HOST,
  port: +process.env.S3_PORT,
  useSSL: false,
  accessKey: process.env.S3_ACCESS_KEY,
  secretKey: process.env.S3_SECRET_KEY,
});

const filesService = (instance, opts, done) => {
  instance.addContentTypeParser('multipart', (req, _, next) => {
    req.raw.multipart = true;
    next();
  });
  instance.decorate('s3', minio);
  instance.decorate('file', file);
  instance.register(router, opts);
  done();
};

export default fp(filesService);
