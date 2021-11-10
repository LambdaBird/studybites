export const isSameElementAsCreated = ({
  element,
  createdElementAttributes,
}) => {
  const realElementAttributes = [...element.attributes];
  if (realElementAttributes.length !== createdElementAttributes.length) {
    return false;
  }
  return realElementAttributes.every((attribute, i) => {
    const firstNodeValue = createdElementAttributes[i].nodeValue;
    const secondNodeValue = attribute.nodeValue;
    return firstNodeValue === secondNodeValue
      ? true
      : !!(
          firstNodeValue?.includes(secondNodeValue) ||
          secondNodeValue?.includes(firstNodeValue)
        );
  });
};
