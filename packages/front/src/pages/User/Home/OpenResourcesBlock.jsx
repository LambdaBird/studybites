import { Skeleton } from 'antd';
import PropTypes from 'prop-types';

import PublicResource from '@sb-ui/components/resourceBlocks/Public';
import { PAGE_SIZE } from '@sb-ui/pages/User/Lessons/ResourcesList/constants';
import * as S from '@sb-ui/pages/User/Lessons/ResourcesList/ResourcesList.styled';
import { skeletonArray } from '@sb-ui/utils/utils';

const OpenResourcesBlock = ({ isLoading, error, data, isCourse = false }) => {
  if (isLoading && !error) {
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
      {data?.map((resource) => (
        <S.LessonCol key={resource.id}>
          <PublicResource resource={resource} isCourse={isCourse} />
        </S.LessonCol>
      ))}
    </>
  );
};

OpenResourcesBlock.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  error: PropTypes.object,
  data: PropTypes.arrayOf(PropTypes.object),
  isCourse: PropTypes.bool,
};

export default OpenResourcesBlock;
