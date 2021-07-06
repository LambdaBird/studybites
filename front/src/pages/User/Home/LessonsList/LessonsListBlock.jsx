import PropTypes from 'prop-types';
import { Skeleton } from 'antd';

import { skeletonArray } from '@sb-ui/utils/utils';
import { PAGE_SIZE } from '@sb-ui/pages/User/Lessons/LessonsList/constants';
import PublicLesson from '@sb-ui/components/lessonBlocks/Public';
import * as S from '@sb-ui/pages/User/Lessons/LessonsList/LessonsList.styled';

const LessonsListBlock = ({ isLoading, data }) => {
  if (isLoading) {
    return (
      <>
        {skeletonArray(PAGE_SIZE).map((el) => (
          <S.LessonCol key={el.id}>
            <Skeleton avatar />
          </S.LessonCol>
        ))}
      </>
    );
  }

  return (
    <>
      {data?.map((lesson) => (
        <S.LessonCol key={lesson.id}>
          <PublicLesson lesson={lesson} />
        </S.LessonCol>
      ))}
    </>
  );
};

LessonsListBlock.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.arrayOf(PropTypes.object),
};

export default LessonsListBlock;
