import { Tag } from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { LessonType } from '@sb-ui/components/resourceBlocks/types';
import { LESSONS_EDIT } from '@sb-ui/utils/paths';

const MAX_DISPLAYED_LESSONS = 4;

const LessonsTags = ({ lessons }) => {
  const { t } = useTranslation('teacher');
  if (!lessons || lessons?.length === 0) {
    return t('students.table.no_lessons');
  }

  return (
    <div>
      {lessons?.slice(0, MAX_DISPLAYED_LESSONS)?.map(({ id }) => (
        <Tag>
          <Link to={LESSONS_EDIT.replace(':id', id)}>{id}</Link>
        </Tag>
      ))}
    </div>
  );
};

LessonsTags.propTypes = {
  lessons: PropTypes.arrayOf(LessonType),
};

export default LessonsTags;
