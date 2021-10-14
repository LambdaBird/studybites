export const getInteractiveResults = ({ results }) => {
  const start = results?.[0];
  const isStart = start?.action === 'start';
  const finish = results?.slice(-1)?.[0];
  const isFinish = finish?.action === 'finish';

  if (isStart && isFinish) {
    return [start, finish, results.slice(1, -1) || []];
  }

  if (isStart) {
    return [start, null, results.slice(1) || []];
  }

  return [null, null, results];
};
