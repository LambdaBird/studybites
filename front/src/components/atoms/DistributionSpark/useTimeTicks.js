import * as d3Shape from 'd3-shape';
import { useMemo } from 'react';

const findMean = (arr) =>
  arr.filter((x) => !!x).reduce((s, i) => s + i, 0) / arr.length;

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

const useTimeTicks = ({
  replySeries,
  timeCohortScale,
  ySparkScale,
  verticalPadding,
  sparkHeight,
  sparkWidth,
}) =>
  useMemo(() => {
    if (!replySeries?.length) {
      return {};
    }

    const seriesMedian = findMedian(replySeries);
    const seriesMean = findMean(replySeries);

    const xMedian = timeCohortScale(seriesMedian);
    const xMean = timeCohortScale(seriesMean);

    return {
      median: `${(seriesMedian / 1000).toFixed(2)}s`,
      mean: `${(seriesMean / 1000).toFixed(2)}s`,
      medianLine: d3Shape.line()([
        [0, 0],
        [ySparkScale(xMedian), 0],
        [ySparkScale(xMedian), verticalPadding],
      ]),
      meanLine: d3Shape.line()([
        [ySparkScale(xMean), sparkHeight + verticalPadding],
        [ySparkScale(xMean), sparkHeight + verticalPadding * 2],
        [sparkWidth, sparkHeight + verticalPadding * 2],
      ]),
    };
  }, [
    replySeries,
    timeCohortScale,
    sparkHeight,
    verticalPadding,
    ySparkScale,
    sparkWidth,
  ]);

export default useTimeTicks;
