import api from '../api';

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

export const uploadFile = async ({ parent, onSuccess, onError }) => {
  try {
    const formData = new FormData();
    const {
      files: [file],
    } = parent;

    if (file) {
      formData.append('file', file);

      const response = await api.post(
        `${process.env.REACT_APP_SB_HOST}/api/v1/files`,
        formData,
        {
          headers: {
            'content-type': 'multipart/form-data',
          },
        },
      );
      onSuccess(response);
    }
  } catch (e) {
    onError(e);
  }
};

export const camelToSnakeCase = (str) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

export const setPropsInTool = (tool, props) => {
  Object.keys(props).forEach((prop) => {
    // eslint-disable-next-line no-param-reassign
    tool[prop] = props[prop];
  });
};

export const deletePropsFromTool = (tool, propsArray) => {
  // eslint-disable-next-line no-param-reassign
  propsArray.forEach((prop) => delete tool[prop]);
};

export const moveCaret = (win, charCount) => {
  const selection = win.getSelection();
  if (selection.rangeCount > 0) {
    const textNode = selection.focusNode;
    const newOffset = selection.focusOffset + charCount;
    selection.collapse(textNode, Math.min(textNode.length, newOffset));
  }
};
