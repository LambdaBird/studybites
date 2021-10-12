// eslint-disable-next-line import/no-extraneous-dependencies
import * as d3Random from 'd3-random';

import {
  interactiveTypesBlocks,
  staticTypesBlocks,
} from '@sb-ui/utils/api/config';

const getCoef = (mi, ma) => mi + Math.random() * (ma - mi);
const getMinCoef = (i, bitesCount) => {
  switch (i) {
    case Math.floor(bitesCount / 2):
    case bitesCount - 1:
      return 0.2;
    default:
      return 0.8;
  }
};

const countLanded = (a, i, bitesCount, initialLanded) =>
  Math.min(
    Math.round(a[i - 1].landed * getCoef(getMinCoef(i, bitesCount), 1)),
    i ? a[i - 1].landed : initialLanded,
  );

export const getReplySeries = ({ landed, blocks }, i) =>
  i
    ? new Array(landed)
        .fill(1)
        .map(() => {
          const r1 = d3Random.randomNormal(
            100 * blocks.length + 1000 + 5000 * (i % 3),
            1000,
          );
          const r2 = d3Random.randomNormal(100 * blocks.length, 5000);

          return Math.max(r1() * Math.min((i % 4) - 1, 1) + r2() + 1000, 500);
        })
        .sort((ai, b) => ai - b)
    : null;

const generateBlocks = () => [
  ...new Array(1 + Math.floor(Math.random() * 5))
    .fill(1)
    .map(
      () =>
        staticTypesBlocks[Math.floor(Math.random() * staticTypesBlocks.length)],
    ),
  interactiveTypesBlocks[
    Math.floor(Math.random() * interactiveTypesBlocks.length)
  ],
];

export const getBarSparkArgs = () => {
  const series = getReplySeries({ landed: 214, blocks: generateBlocks() }, 1);

  const maxReplyTime = Math.max(...series);
  const minReplyTime = Math.min(...series);

  const range = 10;
  const domain = maxReplyTime - minReplyTime;

  const seriesBandScale = (v) =>
    Math.round(((v - minReplyTime) / domain + 2) * range);

  return { series, seriesBandScale };
};

export const getSparkBarGroup = ({ count = 7, landed = 214 }) => {
  const series = getReplySeries({ landed, blocks: generateBlocks() }, 1);

  const maxReplyTime = Math.max(...series);
  const minReplyTime = Math.min(...series);

  const disptibutionItem = (maxReplyTime - minReplyTime) / count;

  const groupsDict = series.reduce((dict, time) => {
    const theIndex = Math.min(count - 1, Math.floor(time / disptibutionItem));

    // eslint-disable-next-line no-param-reassign
    dict[theIndex] = (dict[theIndex] || 0) + 1;
    return dict;
  }, {});

  return Object.entries(groupsDict)
    .sort((a, b) => a[0] - b[0])
    .map(([groupId, value]) => ({
      order: groupId,
      value,
      title: `${value} students: ${[
        groupId ? `>${Math.floor((disptibutionItem * +groupId) / 1000)}s` : '',
        groupId < count - 1
          ? `<${Math.floor((disptibutionItem * (+groupId + 1)) / 1000)}s`
          : '',
      ].join(' ')}`,
    }));
};

const generateLessonFunnelData = (bitesCount = 11, initialLanded = 572) =>
  new Array(bitesCount)
    .fill(1)
    .reduce((a, _, i) => {
      // eslint-disable-next-line no-param-reassign
      a[i] = {
        id: i + 1,
        initialLanded,
        landed: i
          ? countLanded(a, i, bitesCount, initialLanded)
          : initialLanded,
        prevLanded: i ? a[i - 1].landed : initialLanded,
        blocks: i ? generateBlocks() : null,
        get replySeries() {
          return getReplySeries(this, i);
        },
      };
      return a;
    }, [])
    .map((bite) => ({
      id: bite.id,
      initialLanded: bite.initialLanded,
      landed: bite.landed,
      prevLanded: bite.prevLanded,
      blocks: bite.blocks,
      replySeries: bite.replySeries,
    }));

export default generateLessonFunnelData;
