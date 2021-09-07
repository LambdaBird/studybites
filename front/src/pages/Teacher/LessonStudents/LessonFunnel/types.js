import T from 'prop-types';

export const ReplySeries = T.arrayOf(T.number);
export const BiteBlocks = T.arrayOf(T.string);

export const Bite = {
  id: T.number.isRequired,
  landed: T.number.isRequired,
  prevLanded: T.number.isRequired,
  initialLanded: T.number.isRequired,
  blocks: T.oneOfType([BiteBlocks, T.oneOf([null])]),
  replySeries: T.oneOfType([ReplySeries, T.oneOf([null])]),
};
