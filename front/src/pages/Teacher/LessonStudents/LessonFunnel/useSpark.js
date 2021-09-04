import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import { useMemo } from 'react';

import {
  SP_WD_RAT,
  SPARK_LINE_HEIGHT,
  SPARK_LINE_PADD,
  SPARK_LINE_WIDTH,
} from './consts';

const makeDistribution = (scale, series) => {
  const distDict = series.reduce(
    (dict, replySpeed) => {
      // eslint-disable-next-line no-param-reassign
      dict[scale(replySpeed)] = (dict[scale(replySpeed)] || 0) + 1;
      return dict;
    },
    {
      0: 0,
      10: 0,
      20: 0,
      30: 0,
      40: 0,
      50: 0,
      60: 0,
      70: 0,
      80: 0,
      90: 0,
      100: 0,
    },
  );

  const distList = Object.entries(distDict);

  const domain = distList.reduce(
    ({ min, max }, [, replyCount]) => ({
      min: Math.min(replyCount, min),
      max: Math.max(replyCount, max),
    }),
    { min: Infinity, max: -Infinity },
  );

  const numberScale = d3Scale.scaleLinear(
    [0, domain.max],
    [SPARK_LINE_HEIGHT + SPARK_LINE_PADD, SPARK_LINE_PADD],
  );

  return distList.map(([x, y]) => [+x * SP_WD_RAT, numberScale(y)]);
};

const makeLine = (sparkTimeScale, replySeries) => {
  const dist = makeDistribution(sparkTimeScale, replySeries);

  return d3Shape.line().curve(d3Shape.curveBasis)([
    [0, SPARK_LINE_HEIGHT + SPARK_LINE_PADD],
    [dist[0][0] - 1, SPARK_LINE_HEIGHT + SPARK_LINE_PADD],
    ...dist,
    [dist[dist.length - 1][0] + 1, SPARK_LINE_HEIGHT + SPARK_LINE_PADD],
    [SPARK_LINE_WIDTH, SPARK_LINE_HEIGHT + SPARK_LINE_PADD],
  ]);
};

const useSpark = (replySeries, sparkTimeScale) =>
  useMemo(() => {
    if (!replySeries || !replySeries.length) {
      return '';
    }

    return makeLine(sparkTimeScale, replySeries);
  }, [replySeries, sparkTimeScale]);

export default useSpark;
