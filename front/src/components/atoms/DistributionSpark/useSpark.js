import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import { useMemo } from 'react';

const makeDistribution = ({
  scale,
  series,
  cohortsNumber = 10,
  ySparkScale,
  verticalPadding,
  sparkHeight,
}) => {
  const distDict = series.reduce((dict, replySpeed) => {
    // eslint-disable-next-line no-param-reassign
    dict[scale(replySpeed)] = (dict[scale(replySpeed)] || 0) + 1;

    return dict;
  }, Object.fromEntries([...new Array(cohortsNumber).keys()].map((index) => [index * (100 / cohortsNumber), 0])));

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
    [sparkHeight + verticalPadding, verticalPadding],
  );

  return distList.map(([x, y]) => [ySparkScale(+x), numberScale(y)]);
};

const makeLine = ({
  timeCohortScale,
  replySeries,
  ySparkScale,
  verticalPadding,
  sparkHeight,
  sparkWidth,
}) => {
  const dist = makeDistribution({
    scale: timeCohortScale,
    series: replySeries,
    ySparkScale,
    verticalPadding,
    sparkHeight,
  });

  return d3Shape.line().curve(d3Shape.curveBasis)([
    [0, sparkHeight + verticalPadding],
    [dist[0][0] - 1, sparkHeight + verticalPadding],
    ...dist,
    [dist[dist.length - 1][0] + 1, sparkHeight + verticalPadding],
    [sparkWidth, sparkHeight + verticalPadding],
  ]);
};

const useSpark = ({
  timeCohortScale,
  replySeries,
  ySparkScale,
  verticalPadding,
  sparkHeight,
  sparkWidth,
}) =>
  useMemo(() => {
    if (!replySeries?.length) {
      return '';
    }

    return makeLine({
      timeCohortScale,
      replySeries,
      ySparkScale,
      verticalPadding,
      sparkHeight,
      sparkWidth,
    });
  }, [
    timeCohortScale,
    replySeries,
    ySparkScale,
    verticalPadding,
    sparkHeight,
    sparkWidth,
  ]);

export default useSpark;
