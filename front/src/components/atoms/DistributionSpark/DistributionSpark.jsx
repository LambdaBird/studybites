import T from 'prop-types';
import { useTranslation } from 'react-i18next';

import useSpark from './useSpark';
import useTimeTicks from './useTimeTicks';
import * as S from './styled';

const DistributionSpark = ({
  replySeries,
  timeCohortScale,
  isHeader,
  verticalPadding,
  sparkHeight,
  sparkWidth,
  ySparkScale,
}) => {
  const { t } = useTranslation();
  const { median, mean, medianLine, meanLine } = useTimeTicks({
    replySeries: replySeries || [],
    timeCohortScale,
    ySparkScale,
    verticalPadding,
    sparkHeight,
    sparkWidth,
  });

  const replyLine = useSpark({
    timeCohortScale,
    replySeries,
    ySparkScale,
    verticalPadding,
    sparkHeight,
    sparkWidth,
  });

  if (!isHeader && !replySeries?.length) {
    return <S.SeriesWrapper />;
  }

  const svgWidth = `${sparkWidth}px`;
  const svgHeight = `${sparkHeight + verticalPadding * 2}px`;
  const svgViewBox = `0 0 ${sparkWidth} ${sparkHeight + verticalPadding * 2}`;

  const Median = isHeader ? S.HeaderMedianWrapper : S.MedianWrapper;
  const Mean = isHeader ? S.HeaderMeanWrapper : S.MeanWrapper;

  return (
    <S.SeriesWrapper>
      <Median>
        <div>{isHeader ? t('teacher:lesson_funnel.median') : median}</div>
      </Median>
      <S.SparkWrapper $sparkWidth={sparkWidth}>
        {!isHeader && (
          <svg width={svgWidth} height={svgHeight} viewBox={svgViewBox}>
            <path stroke="black" fill="none" strokeWidth={1} d={replyLine} />
            <path stroke="#888" fill="none" strokeWidth={1} d={medianLine} />
            <path stroke="#888" fill="none" strokeWidth={1} d={meanLine} />
          </svg>
        )}
      </S.SparkWrapper>
      <Mean>
        <div>{isHeader ? t('teacher:lesson_funnel.mean') : mean}</div>
      </Mean>
    </S.SeriesWrapper>
  );
};

DistributionSpark.propTypes = {
  timeCohortScale: T.func.isRequired,
  replySeries: T.arrayOf(T.number),
  isHeader: T.bool,
  verticalPadding: T.number,
  sparkHeight: T.number,
  sparkWidth: T.number,
  ySparkScale: T.func,
};

const SPARK_LINE_WIDTH = 150;
const SP_WD_RAT = SPARK_LINE_WIDTH / 100;

DistributionSpark.defaultProps = {
  isHeader: false,
  verticalPadding: 5,
  sparkHeight: 10,
  sparkWidth: SPARK_LINE_WIDTH,
  ySparkScale: (v) => v * SP_WD_RAT,
};

export default DistributionSpark;
