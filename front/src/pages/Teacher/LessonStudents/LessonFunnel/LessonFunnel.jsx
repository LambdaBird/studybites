import T from 'prop-types';
import { useTranslation } from 'react-i18next';

import FunnelBite from './FunnelBite';
import { Bite } from './types';
import useFunnelScales from './useFunnelScales';
import * as S from './LessonFunnel.styled';

const LessonFunnel = ({ bites }) => {
  const { t } = useTranslation();
  const { sparkTimeScale } = useFunnelScales(bites);
  const bitesNumber = bites.length;

  return (
    <S.FunnelWrapper>
      <S.ColumnsTitle>{t('teacher:lesson_funnel.bar_title')}</S.ColumnsTitle>
      <div />
      <div />
      <S.ColumnsTitle>
        {t('teacher:lesson_funnel.content_title')}
      </S.ColumnsTitle>
      <S.ColumnsTitle>{t('teacher:lesson_funnel.spark_title')}</S.ColumnsTitle>
      {bites.map((bite, index) => (
        <FunnelBite
          key={bite.id}
          bite={bite}
          sparkTimeScale={sparkTimeScale}
          bitesNumber={bitesNumber}
          isLast={bitesNumber === index + 1}
          isFirst={!index}
        />
      ))}
    </S.FunnelWrapper>
  );
};

LessonFunnel.propTypes = {
  bites: T.arrayOf(T.shape(Bite)).isRequired,
};

export default LessonFunnel;
