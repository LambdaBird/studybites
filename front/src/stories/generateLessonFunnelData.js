// eslint-disable-next-line import/no-extraneous-dependencies
import * as d3Random from 'd3-random';

// TODO: take from shared place
export const staticTypesBlocks = ['paragraph', 'list', 'header', 'table'];
export const interactiveTypesBlocks = [
  'next',
  'next',
  'closedQuestion',
  'quiz',
];

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
        blocks: i
          ? [
              ...new Array(1 + Math.floor(Math.random() * 5))
                .fill(1)
                .map(
                  () =>
                    staticTypesBlocks[
                      Math.floor(Math.random() * staticTypesBlocks.length)
                    ],
                ),
              interactiveTypesBlocks[
                Math.floor(Math.random() * interactiveTypesBlocks.length)
              ],
            ]
          : null,
        get replySeries() {
          return i
            ? new Array(this.landed)
                .fill(1)
                .map(() => {
                  const r1 = d3Random.randomNormal(
                    100 * this.blocks.length + 1000 + 5000 * (i % 3),
                    1000,
                  );
                  const r2 = d3Random.randomNormal(
                    100 * this.blocks.length,
                    5000,
                  );

                  return Math.max(
                    r1() * Math.min((i % 4) - 1, 1) + r2() + 1000,
                    500,
                  );
                })
                .sort((ai, b) => ai - b)
            : null;
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
