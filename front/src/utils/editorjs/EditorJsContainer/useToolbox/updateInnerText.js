const updateInnerText = ({ parentNode, text, selector }) => {
  const element = parentNode.querySelector(selector);
  if (element) {
    element.innerText = text;
  }
};

export default updateInnerText;
