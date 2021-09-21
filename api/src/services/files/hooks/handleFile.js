import Busboy from 'busboy';

export async function handleFile(req) {
  return new Promise((resolve, reject) => {
    const busboy = new Busboy({ headers: req.headers });

    const ctx = {
      buf: [],
      fileSize: 0,
      fileName: null,
      type: null,
    };

    busboy.on('file', (fieldName, file, filename, encoding, mimetype) => {
      ctx.fileName = filename;
      ctx.type = mimetype;

      file.on('data', (data) => {
        ctx.buf.push(data);
        ctx.fileSize += data.length;
      });
    });
    busboy.on('error', (e) => {
      reject(e);
    });
    busboy.on('finish', () => {
      ctx.buf = Buffer.concat(ctx.buf);
      resolve(ctx);
    });

    req.raw.pipe(busboy);
  });
}
