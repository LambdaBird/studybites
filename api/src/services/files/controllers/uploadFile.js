const options = {
  async onRequest(req) {
    await this.auth({ req });
  },
  async preHandler(req) {
    this.fileData = await this.file({ req });
  },
};

async function handler() {
  const {
    s3,
    fileData,
    config: { globals },
  } = this;
  await s3.putObject(process.env.S3_BUCKET, fileData.fileName, fileData.buf);
  return {
    location: `${globals.S3_URL}${fileData.fileName}`,
    name: fileData.fileName,
  };
}

export default { options, handler };
