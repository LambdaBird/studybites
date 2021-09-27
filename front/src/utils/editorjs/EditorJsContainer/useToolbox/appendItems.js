const appendItems = ({ node, items = [] }) => {
  items.forEach((item) => {
    node?.appendChild(item);
  });
};

export default appendItems;
