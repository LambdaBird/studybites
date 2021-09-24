import request from 'axios';

export default class Uploader {
  constructor({ config, onSuccess, onError }) {
    this.config = config;
    this.onSuccess = onSuccess;
    this.onError = onError;
  }

  async uploadFile() {
    try {
      const formData = new FormData();
      const {
        files: [file],
      } = document.querySelector('#file');
      formData.append('file', file);

      const response = await request.post('/api/v1/files', formData, {
        headers: {
          ...this.config.headers,
          'content-type': 'multipart/form-data',
        },
      });
      this.onSuccess(response);
    } catch (e) {
      this.onError(e);
    }
  }
}
