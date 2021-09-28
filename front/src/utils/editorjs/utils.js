import request from 'axios';

export const createInput = ({
  readOnly = false,
  wrapper,
  name,
  placeholder,
  classList = [],
}) => {
  const input = document.createElement('input');
  // eslint-disable-next-line no-param-reassign
  wrapper.elements[name] = input;
  input.placeholder = placeholder;
  input.classList.add(...classList);
  if (readOnly) {
    input.disabled = true;
  }
  return input;
};

export const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const stripHTML = (html) => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

export const createElementFromHTML = (htmlString) => {
  const div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
};

export const sanitizeBlocks = {
  b: true,
  i: true,
  a: true,
  mark: true,
};

export class Uploader {
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
        `${process.env.SB_HOST}/api/v1/files`,
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
