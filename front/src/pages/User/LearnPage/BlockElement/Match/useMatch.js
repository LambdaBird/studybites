import { createRef, useCallback, useEffect, useState } from 'react';

const LEFT = 'left';
const RIGHT = 'right';

export const useMatch = (values) => {
  const convertId = useCallback(
    (convertValues, id) =>
      convertValues?.map(({ [id]: value, correct = null }, i) => ({
        ref: createRef(),
        value,
        id: `${id}-${i + 1}`,
        selected: false,
        correct,
      })),
    [],
  );

  const convertPrevId = useCallback(
    (convertValues, prev, id) =>
      convertValues.map(({ [id]: value, correct = null }, i) => ({
        ref: prev?.[i]?.ref || createRef(),
        value,
        id: `${id}-${i + 1}`,
        selected: false,
        correct,
      })),
    [],
  );

  const [left, setLeft] = useState(convertId(values, LEFT));
  const [right, setRight] = useState(convertId(values, RIGHT));

  useEffect(() => {
    if (values) {
      setLeft((prev) => convertPrevId(values, prev, LEFT));
      setRight((prev) => convertPrevId(values, prev, RIGHT));
    }
  }, [convertPrevId, values]);

  return { left, setLeft, right, setRight };
};
