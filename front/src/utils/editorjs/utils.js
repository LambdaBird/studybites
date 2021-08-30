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

export const sanitizeBlocks = {
  b: true,
  i: true,
  a: true,
  mark: true,
};
