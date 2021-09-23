import Busboy from 'busboy';

import {
  FILE_SIZE_LIMIT,
  fileServiceAllowedTypes,
  fileServiceErrors,
} from '../../../config';
import { BadRequestError } from '../../../validation/errors';

export async function file({ req }) {
  return new Promise((resolve, reject) => {
    if (!req.raw.multipart) {
      reject(new BadRequestError(fileServiceErrors.FILE_ERR_NO_MULTIPART));
    }

    const busboy = new Busboy({
      headers: req.headers,
      limits: {
        files: 1,
        fileSize: FILE_SIZE_LIMIT,
      },
    });
    const ctx = {
      buf: [],
      encoding: null,
      fileSize: 0,
      fileName: null,
      fileType: null,
    };

    busboy.on('file', (_, dataStream, fileName, encoding, mimetype) => {
      if (!fileServiceAllowedTypes.includes(mimetype)) {
        reject(new BadRequestError(fileServiceErrors.FILE_ERR_INVALID_TYPE));
      }

      ctx.encoding = encoding;
      ctx.fileName = `${Date.now()}-${fileName}`;
      ctx.fileType = mimetype;

      dataStream.on('data', (data) => {
        ctx.buf.push(data);
        ctx.fileSize += data.length;
      });

      dataStream.on('limit', () => {
        reject(new BadRequestError(fileServiceErrors.FILE_ERR_SIZE_LIMIT));
      });
    });

    busboy.on('finish', () => {
      ctx.buf = Buffer.concat(ctx.buf);
      resolve(ctx);
    });

    busboy.on('error', (e) => {
      reject(e);
    });

    req.raw.pipe(busboy);
  });
}
