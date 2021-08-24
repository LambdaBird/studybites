import { createRef, useCallback, useEffect, useState } from 'react';

const FROM = 'from';
const TO = 'to';

export const useMatch = (values) => {
  const convertId = useCallback((convertValues, id) => {
    return convertValues?.map(({ [id]: value, correct = null }, i) => ({
      ref: createRef(),
      value,
      id: `${id}-${i + 1}`,
      selected: false,
      correct,
    }));
  }, []);

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

  const [from, setFrom] = useState(convertId(values, FROM));
  const [to, setTo] = useState(convertId(values, TO));

  useEffect(() => {
    if (values) {
      setFrom((prev) => convertPrevId(values, prev, FROM));
      setTo((prev) => convertPrevId(values, prev, TO));
    }
  }, [convertPrevId, values]);

  return { from, setFrom, to, setTo };
};
