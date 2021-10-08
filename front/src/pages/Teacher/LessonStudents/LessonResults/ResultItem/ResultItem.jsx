import T from 'prop-types';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';

import { getTitleAndIcon } from './getTitleAndIcon';
import * as S from './ResulItem.styled';

const ResultItem = ({ icons, block, correctness, time, showCircle }) => {
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

  return (
    <S.RowResult>
      <S.IconWrapper>
        <S.Icon>{icon}</S.Icon>
        <S.IconTitle>{title}</S.IconTitle>
      </S.IconWrapper>
      <S.Time>{blockTime}</S.Time>
      <S.Correctness>
        {showCircle && (
          <>
            {correctness === 1 ? (
              <CheckCircleTwoTone twoToneColor="#52c41a" />
            ) : (
              <CloseCircleTwoTone twoToneColor="#F5222D" />
            )}
          </>
        )}
      </S.Correctness>
    </S.RowResult>
  );
};

ResultItem.propTypes = {
  icons: T.shape({}),
  block: T.shape({}),
  correctness: T.number,
  time: T.number,
  showCircle: T.bool,
};

export default ResultItem;
