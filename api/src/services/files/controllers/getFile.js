const options = {
  schema: {
    params: {
      type: 'object',
      properties: {
        fileName: { type: 'string' },
      },
      required: ['fileName'],
    },
  },
};

async function handler(req) {
  const { s3 } = this;

  const fileLocation = await s3.presignedGetObject(
    process.env.S3_BUCKET,
    req.params.fileName,
  );

  return { location: fileLocation };
}

export default { options, handler };
