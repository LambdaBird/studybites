import request from 'axios';

export default class Uploader {
  constructor({ config, onSuccess, onError }) {
    this.config = config;
    this.onSuccess = onSuccess;
    this.onError = onError;
  }

  async uploadFile(parent) {
    try {
      const formData = new FormData();
      const {
        files: [file],
      } = parent;
      formData.append('file', file);
      const response = await request.post(
        `${process.env.REACT_APP_SB_HOST}/api/v1/files`,
        formData,
        {
          headers: {
            ...this.config.headers,
            'content-type': 'multipart/form-data',
          },
        },
      );
      this.onSuccess(response);
    } catch (e) {
      this.onError(e);
    }
  }
}
