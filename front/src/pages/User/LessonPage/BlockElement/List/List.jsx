import PropTypes from 'prop-types';
import { BlockElementProps } from '../utils';

const List = ({ content }) => {
  const { style, items } = content.data;
  if (style === 'ordered') {
    return (
      <ol>
        {items.map((item, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <li key={index}>{item}</li>
        ))}
      </ol>
    );
  }

  if (style === 'unordered') {
    return (
      <ul>
        {items.map((item, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  }
  return null;
};

List.propTypes = {
  ...BlockElementProps,
  content: {
    ...BlockElementProps.content,
    data: PropTypes.shape({
      style: PropTypes.string,
      items: PropTypes.arrayOf(PropTypes.string),
    }),
  },
};

export default List;
