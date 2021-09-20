import Busboy from 'busboy';

const options = {};

function handleFile(req) {
  const busboy = new Busboy({ headers: req.headers });
  const ctx = {
    buf: [],
    fileSize: 0,
    fileName: null,
    type: null,
  };
  return new Promise((resolve, reject) => {
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

async function handler(req) {
  try {
    const { s3 } = this;

    const file = await handleFile(req);
    await s3.putObject(process.env.S3_BUCKET, file.fileName, file.buf);

    return { status: 'ok' };
  } catch (e) {
    console.log({ e });
    return { status: 'not ok' };
  }
}

export default { options, handler };
