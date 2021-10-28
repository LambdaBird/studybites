import { message, Rate } from 'antd';
import T from 'prop-types';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';

import { BLOCKS_TYPE_LIST_RATED } from '@sb-ui/pages/Teacher/LessonStudents/LessonResults/ResultItem/constants';
import { putReview } from '@sb-ui/utils/api/v1/teacher';

import { getTitleAndIcon } from './getTitleAndIcon';
import * as S from './ResulItem.styled';

const convertRateToCorrectness = (star) => star * 0.2;
const convertCorrectnessToRate = (correctness) => correctness / 0.2;

const ResultItem = ({
  id,
  lessonId,
  icons,
  block,
  correctness,
  time,
  showCircle,
}) => {
  const { t } = useTranslation(['teacher', 'editorjs']);
  const { icon, title } = useMemo(
    () => getTitleAndIcon(icons, block, t),
    [icons, block, t],
  );

  const blockTime = useMemo(
    () =>
      t('lesson_students_results.short_seconds', {
        time: (time / 1000).toFixed(1),
      }),
    [t, time],
  );

  const updateReviewMutation = useMutation(putReview, {
    onSuccess: () => {
      message.success({
        content: t('lesson_students_results.grade.success'),
        duration: 2,
      });
    },
    onError: () => {
      message.error({
        content: t('lesson_students_results.grade.error'),
        duration: 2,
      });
    },
  });

  const handleChangeRate = useCallback(
    (number) => {
      updateReviewMutation.mutate({
        correctness: convertRateToCorrectness(number),
        resultId: id,
        lessonId,
      });
    },
    [id, lessonId, updateReviewMutation],
  );

  const handleRateWrapper = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const showRate = useMemo(
    () => BLOCKS_TYPE_LIST_RATED.includes(block.type),
    [block.type],
  );

  return (
    <S.RowResult>
      <S.IconWrapper>
        <S.Icon>{icon}</S.Icon>
        <S.IconTitle>{title}</S.IconTitle>
      </S.IconWrapper>
      <S.Time>{blockTime}</S.Time>
      <S.Correctness>
        {showRate && (
          <S.RateWrapper onClick={handleRateWrapper}>
            <Rate
              onChange={handleChangeRate}
              allowHalf
              defaultValue={convertCorrectnessToRate(correctness)}
              character={({ index }) => index + 1}
            />
          </S.RateWrapper>
        )}
        {showCircle && !showRate && (
          <div
            style={{
              marginLeft: '1rem',
            }}
          >
            {correctness === 1 ? (
              <CheckCircleTwoTone twoToneColor="#52c41a" />
            ) : (
              <CloseCircleTwoTone twoToneColor="#F5222D" />
            )}
          </div>
        )}
      </S.Correctness>
    </S.RowResult>
  );
};

ResultItem.propTypes = {
  id: T.string,
  icons: T.shape({}),
  lessonId: T.number,
  block: T.shape({
    blockId: T.string,
    type: T.string,
  }),
  correctness: T.number,
  time: T.number,
  showCircle: T.bool,
};

export default ResultItem;
