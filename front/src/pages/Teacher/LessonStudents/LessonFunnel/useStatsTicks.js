import * as d3Shape from 'd3-shape';
import { useMemo } from 'react';

import {
  SP_WD_RAT,
  SPARK_LINE_HEIGHT,
  SPARK_LINE_PADD,
  SPARK_LINE_WIDTH,
} from './consts';

const findMean = (arr) => arr.reduce((s, i) => s + i, 0) / arr.length;

const findMedian = (arr) => {
  const sorted = [...arr].sort((a, b) => a - b);
  if (sorted.length % 2) {
    return findMean([
      sorted[Math.floor(sorted.length / 2)],
      sorted[Math.ceil(sorted.length / 2)],
    ]);
  }

  return sorted[Math.floor(sorted.length / 2)];
};

const useStatsTicks = (replySeries, sparkTimeScale) =>
  useMemo(() => {
    if (!replySeries) {
      return {};
    }

    const seriesMedian = findMedian(replySeries);
    const seriesMean = findMean(replySeries);

    const xMedian = sparkTimeScale(seriesMedian);
    const xMean = sparkTimeScale(seriesMean);

    return {
      median: `${(seriesMedian / 1000).toFixed(2)}s`,
      mean: `${(seriesMean / 1000).toFixed(2)}s`,
      medianLine: d3Shape.line()([
        [0, 0],
        [xMedian * SP_WD_RAT, 0],
        [xMedian * SP_WD_RAT, SPARK_LINE_HEIGHT],
      ]),
      meanLine: d3Shape.line()([
        [xMean * SP_WD_RAT, SPARK_LINE_PADD * 2],
        [xMean * SP_WD_RAT, SPARK_LINE_HEIGHT + SPARK_LINE_PADD * 2],
        [SPARK_LINE_WIDTH, SPARK_LINE_HEIGHT + SPARK_LINE_PADD * 2],
      ]),
    };
  }, [replySeries, sparkTimeScale]);

export default useStatsTicks;
