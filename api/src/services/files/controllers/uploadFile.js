const options = {
  async onRequest(req) {
    await this.auth({ req });
  },
  async preHandler(req) {
    this.file = await this.handleFile(req);
  },
};

// TODO: move to init
const policy = {
  Statement: [
    {
      Action: ['s3:GetBucketLocation'],
      Effect: 'Allow',
      Principal: {
        AWS: ['*'],
      },
      Resource: ['arn:aws:s3:::storage'],
    },
    {
      Action: ['s3:GetObject'],
      Effect: 'Allow',
      Principal: {
        AWS: ['*'],
      },
      Resource: ['arn:aws:s3:::storage/*'],
    },
  ],
  Version: '2012-10-17',
};

async function handler() {
  const {
    s3,
    file,
    config: { globals },
  } = this;

  // TODO: move to init
  const buckets = await s3.listBuckets();
  if (!buckets.length) {
    await s3.makeBucket(process.env.S3_BUCKET);
  }
  await s3.setBucketPolicy(process.env.S3_BUCKET, JSON.stringify(policy));

  await s3.putObject(process.env.S3_BUCKET, file.fileName, file.buf);

  return { location: `${globals.S3_URL}${file.fileName}` };
}

export default { options, handler };
