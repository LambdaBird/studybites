const createDivWithClassName = ({ className, innerText = '', items = [] }) => {
  const element = document.createElement('div');
  element.classList.add(className);
  element.innerText = innerText;
  items.forEach((item) => {
    element.appendChild(item);
  });
  return element;
};

export default createDivWithClassName;
