import { useCallback, useContext, useState } from 'react';

import LearnContext from '@sb-ui/contexts/LearnContext';
import { RESPONSE_TYPE } from '@sb-ui/pages/User/LearnPage/utils';

export const useBricks = ({ blockId, revision, content }) => {
  const { handleInteractiveClick, id } = useContext(LearnContext);
  const { words: dataWords, question } = content.data;

  const [additionalLines, setAdditionalLines] = useState([]);
  const [words, setWords] = useState(
    dataWords.map((word, index) => ({
      id: index + 1,
      value: word,
      selected: false,
    })),
  );
  const [selectedWordsId, setSelectedWordsId] = useState([]);

  const handleSendClick = useCallback(() => {
    const selectedWordsValue = selectedWordsId.map(
      (selectedWordId) =>
        words.find((word) => word.id === selectedWordId)?.value,
    );
    handleInteractiveClick({
      id,
      action: RESPONSE_TYPE,
      blockId,
      revision,
      reply: {
        words: [...selectedWordsValue],
      },
    });
  }, [blockId, handleInteractiveClick, id, revision, selectedWordsId, words]);

  return {
    handleSendClick,
    question,
    additionalLines,
    setAdditionalLines,
    words,
    setWords,
    selectedWordsId,
    setSelectedWordsId,
  };
};
