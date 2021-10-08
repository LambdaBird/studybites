import PropTypes from 'prop-types';

import * as S from './Lessonkeywords.styled';

const COLORS = [
  'magenta',
  'volcano',
  'green',
  'geekblue',
  'orange',
  'gold',
  'red',
  'cyan',
  'blue',
  'lime',
  'purple',
];

const LessonKeywords = ({ keywords }) => {
  if (!keywords || keywords.length === 0) {
    return null;
  }
  return (
    <S.TagWrapper>
      {keywords.map(({ name, id }) => (
        <S.Tag key={id} color={COLORS[id % COLORS.length]}>
          {name}
        </S.Tag>
      ))}
    </S.TagWrapper>
  );
};
LessonKeywords.propTypes = {
  keywords: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
  ),
};

export default LessonKeywords;
