import T from 'prop-types';
import { useTranslation } from 'react-i18next';

import { SPARK_LINE_HEIGHT, SPARK_LINE_PADD, SPARK_LINE_WIDTH } from './consts';
import { ReplySeries } from './types';
import useSpark from './useSpark';
import useStatsTicks from './useStatsTicks';
import * as S from './LessonFunnel.styled';

const ResolveSpark = ({ replySeries, sparkTimeScale, isStart }) => {
  const { t } = useTranslation();
  const { median, mean, medianLine, meanLine } = useStatsTicks(
    replySeries || [],
    sparkTimeScale,
  );

  const replyLine = useSpark(replySeries, sparkTimeScale);

  if (!isStart && !replySeries?.length) {
    return <S.SeriesWrapper />;
  }

  const svgWidth = `${SPARK_LINE_WIDTH}px`;
  const svgHeight = `${SPARK_LINE_HEIGHT + SPARK_LINE_PADD * 2}px`;
  const svgViewBox = `0 0 ${SPARK_LINE_WIDTH} ${
    SPARK_LINE_HEIGHT + SPARK_LINE_PADD * 2
  }`;

  return (
    <S.SeriesWrapper>
      <S.MedianWrapper isTop={!isStart}>
        <div>{isStart ? t('teacher:lesson_funnel.median') : median}</div>
      </S.MedianWrapper>
      <S.SparkWrapper>
        {!isStart && (
          <svg width={svgWidth} height={svgHeight} viewBox={svgViewBox}>
            <path stroke="black" fill="none" strokeWidth={1} d={replyLine} />
            <path stroke="#888" fill="none" strokeWidth={1} d={medianLine} />
            <path stroke="#888" fill="none" strokeWidth={1} d={meanLine} />
          </svg>
        )}
      </S.SparkWrapper>
      <S.MeanWrapper>
        <div>{isStart ? t('teacher:lesson_funnel.mean') : mean}</div>
      </S.MeanWrapper>
    </S.SeriesWrapper>
  );
};

ResolveSpark.propTypes = {
  sparkTimeScale: T.func.isRequired,
  replySeries: ReplySeries,
  isStart: T.bool.isRequired,
};

export default ResolveSpark;
