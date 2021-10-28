import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import T from 'prop-types';
import { useMemo } from 'react';

const SPARK_LINE_WIDTH = 200;
const SPARK_LINE_HEIGHT = 32;
const SPARK_TOP_PADD = 16;
const SPARK_LINE_PADD = 4;
const LEFT_MARGIN = 42;
const SP_WD_RAT = (SPARK_LINE_WIDTH - LEFT_MARGIN - 7 * 4) / 7;

const svgWidth = `${SPARK_LINE_WIDTH}px`;
const svgHeight = `${SPARK_LINE_HEIGHT + SPARK_LINE_PADD + SPARK_TOP_PADD}px`;
const svgViewBox = `0 0 ${SPARK_LINE_WIDTH} ${
  SPARK_LINE_HEIGHT + SPARK_LINE_PADD * 2
}`;

const thresHolds = [
  1000, // 1
  3000, // 2
  5000, // 3
  7000, // 4
  10000, // 5
  30000, // 6
  60000, // 7
];

const makeDistribution = (scale, series) => {
  const distDict = series.reduce((dict, replySpeed) => {
    // eslint-disable-next-line no-param-reassign
    dict[scale(replySpeed)] = (dict[scale(replySpeed)] || 0) + 1;
    return dict;
  }, {});

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
    [1, SPARK_LINE_HEIGHT],
  );

  return distList.map(([x, count]) => ({
    x: +x,
    height: numberScale(count),
    count,
  }));
};

const BarSpark = ({ series }) => {
  const bands = useMemo(() => {
    const range = [...new Array(7).keys()].map(
      (i) => ((SPARK_LINE_WIDTH - LEFT_MARGIN) / 7) * i,
    );
    const seriesBandScale = (v) => {
      const thresholdScale = d3Scale
        .scaleThreshold()
        .domain(thresHolds)
        .range(range);

      return thresholdScale(v);
    };

    return makeDistribution(seriesBandScale, series);
  }, [series]);

  const {
    index: indexOfMax,
    xOfMax,
    heightOfMax,
  } = useMemo(
    () =>
      bands.reduce(
        (calc, band, index) => {
          if (calc.max < band.count) {
            return {
              max: band.count,
              index,
              xOfMax: band.x,
              heightOfMax: band.height,
            };
          }
          return calc;
        },
        { max: -Infinity, index: -1, xOfMax: 0, heightOfMax: 0 },
      ),
    [bands],
  );

  const tickLine = useMemo(
    () =>
      d3Shape.line()([
        [LEFT_MARGIN - 8, 12],
        [xOfMax + LEFT_MARGIN + SP_WD_RAT / 2, 12],
        [
          xOfMax + LEFT_MARGIN + SP_WD_RAT / 2,
          SPARK_LINE_HEIGHT + SPARK_TOP_PADD - heightOfMax,
        ],
      ]),
    [xOfMax, heightOfMax],
  );

  return (
    <svg width={svgWidth} height={svgHeight} viewBox={svgViewBox}>
      {bands.map((value, index) => (
        <rect
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          x={value.x + LEFT_MARGIN}
          y={SPARK_LINE_HEIGHT + SPARK_TOP_PADD - value.height}
          width={SP_WD_RAT}
          height={value.height}
          fill="#777"
        />
      ))}
      <path stroke="#888" fill="none" strokeWidth={1} d={tickLine} />
      <text
        fill="#000"
        x="0"
        y={SPARK_LINE_HEIGHT + SPARK_LINE_PADD}
        style={{ fontSize: '32px' }}
      >
        {bands[indexOfMax]?.count}
      </text>
    </svg>
  );
};

BarSpark.propTypes = {
  // seriesBandScale: T.func.isRequired,
  series: T.arrayOf(T.number.isRequired).isRequired,
};

export default BarSpark;
