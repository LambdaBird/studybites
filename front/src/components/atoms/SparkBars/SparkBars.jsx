import * as d3Scale from 'd3-scale';
import T from 'prop-types';
import { useMemo } from 'react';

const SPARK_LINE_HEIGHT = 80;
const SPARK_V_PADDING = 10;
const BAND_PADDING = 2;

const SparkBars = ({ groups, ticks }) => {
  const bandWidth = useMemo(() => {
    const groupsCount = groups.length;

    return Math.floor((100 - groupsCount * BAND_PADDING) / groupsCount);
  }, [groups]);

  const bands = useMemo(() => {
    const domainMax = groups.reduce(
      (max, { value }) => Math.max(max, value),
      -Infinity,
    );

    const heightScale = d3Scale.scaleLinear(
      [1, domainMax],
      [2, SPARK_LINE_HEIGHT],
    );

    return groups.map((group) => ({
      ...group,
      height: heightScale(group.value),
    }));
  }, [groups]);

  return (
    <svg width="100%" height="100%">
      {bands.map(({ height, order, title }) => (
        <rect
          key={order}
          x={`${+order * (bandWidth + BAND_PADDING)}%`}
          y={`${SPARK_LINE_HEIGHT + SPARK_V_PADDING - height}%`}
          width={`${bandWidth}%`}
          height={`${height}%`}
          fill="#777"
          title={title}
        />
      ))}
      {ticks}
    </svg>
  );
};

SparkBars.propTypes = {
  groups: T.arrayOf(
    T.shape({
      title: T.string,
      value: T.number,
      order: T.string,
    }),
  ).isRequired,
  ticks: T.node,
};

SparkBars.defaultProps = {
  ticks: null,
};

export default SparkBars;
