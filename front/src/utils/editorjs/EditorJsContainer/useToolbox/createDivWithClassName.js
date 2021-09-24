const createDivWithClassName = (className) => {
  const element = document.createElement('div');
  element.classList.add(className);
  return element;
};

export default createDivWithClassName;
