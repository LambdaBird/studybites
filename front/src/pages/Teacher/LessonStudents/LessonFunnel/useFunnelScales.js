import { useMemo } from 'react';

const MIN_RANGE = 0;
const MXN_RANGE = 100;

const useFunnelScales = (bites) =>
  useMemo(() => {
    const minMaxEach = bites
      .map(
        ({ replySeries }) =>
          replySeries?.length && [
            replySeries[0],
            replySeries[replySeries.length - 1],
          ],
      )
      .filter(Boolean)
      .flat();

    const maxReplyTime = Math.max(...minMaxEach);
    const minReplyTime = Math.min(...minMaxEach);

    const range = MXN_RANGE - MIN_RANGE;
    const domain = maxReplyTime - minReplyTime;
    const sparkTimeScale = (v) =>
      Math.min(
        MXN_RANGE,
        Math.max(MIN_RANGE, Math.round(((v - minReplyTime) / domain) * range)),
      );

    return { sparkTimeScale, maxReplyTime, minReplyTime };
  }, [bites]);

export default useFunnelScales;
