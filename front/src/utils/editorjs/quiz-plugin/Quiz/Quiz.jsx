import { createRef, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { htmlToReact } from '@sb-ui/pages/User/LearnPage/utils';
import {
  deletePropsFromTool,
  moveCaret,
  setPropsInTool,
} from '@sb-ui/utils/editorjs/utils';

import BaseHeader from '../../PluginBase/BaseHeader';

import { ToolType } from './types';
import * as S from './Quiz.styled';

const initialItems = [{ id: 1, value: '', correct: false, ref: createRef() }];

const Quiz = ({ tool }) => {
  const { t } = useTranslation('editorjs');
  const inputRef = useRef(null);
  const itemsWrapperRef = useRef(null);
  const [items, setItems] = useState(initialItems);
  const { data, block } = tool || {};

  useEffect(() => {
    inputRef.current.innerHTML = data?.question || '';
  }, [data?.question]);

  useEffect(() => {
    setItems(
      data?.answers?.map((x, i) => ({ ...x, id: i + 1, ref: createRef() })) ||
        initialItems,
    );
  }, [data?.answers]);

  useEffect(() => {
    setPropsInTool(tool, {
      question: inputRef.current,
      itemsWrapper: itemsWrapperRef.current,
    });
  }, [tool]);

  const handleChangeChecked = (id, correct) => {
    setItems((prev) => {
      const newItems = prev.map((x) => ({ ...x }));
      const item = newItems.find((x) => x.id === id);
      item.correct = !correct;
      return newItems;
    });
  };

  const addNewItem = ({ value, afterId = null }) => {
    setItems((prev) => {
      const id = Math.random();

      const indexToPlace =
        afterId !== null ? prev.findIndex((x) => x.id === afterId) + 1 : 0;
      prev.splice(indexToPlace, 0, {
        id: `item${id}`,
        value,
        correct: false,
        ref: createRef(),
        newItem: true,
      });
      return [...prev];
    });
  };

  const removeItem = ({ id }) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  const addTextToItem = ({ id, value }) => {
    setItems((prev) => {
      const prevItem = prev.find((x) => x.id === id);
      prevItem.moveIndex = prevItem.value.length;
      prevItem.value += value;
      return [...prev];
    });
  };

  const setItemText = ({ id, value }) => {
    setItems((prev) => {
      const item = prev.find((x) => x.id === id);
      item.value = value;
      return [...prev];
    });
  };

  const handleInputKeyDown = (event) => {
    if (event.code === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      items[0].ref.current.focus();
    }
    if (event.code === 'Backspace' && inputRef.current.innerText.length === 0) {
      event.stopPropagation();
      tool.api.blocks.delete();
    }
  };

  const handleKeyDown = (event, id) => {
    if (event.code === 'Backspace') {
      const range = window.getSelection().getRangeAt(0);
      if (range.startOffset === range.endOffset && range.endOffset === 0) {
        event.preventDefault();

        if (items.findIndex((x) => x.id === id) === 0) {
          event.stopPropagation();
          inputRef.current.focus();
          moveCaret(window, inputRef.current.innerText.length);

          return;
        }
        const text = event.target.innerText;
        const prevItemIndex = items.findIndex((item) => item.id === id) - 1;
        addTextToItem({ id: items[prevItemIndex].id, value: text });
        removeItem({ id });
      }
    } else if (event.code === 'Enter') {
      event.preventDefault();
      const text = event.target.innerText;
      const range = window.getSelection().getRangeAt(0);
      if (range.startOffset === range.endOffset) {
        const newText = text.slice(range.startOffset);

        const currentItem = items.find((x) => x.id === id);
        if (
          items.findIndex((x) => x.id === currentItem.id) ===
            items.length - 1 &&
          currentItem.ref.current.innerText.trim().length === 0
        ) {
          tool.api.blocks.insert();
          tool.api.caret.setToBlock(tool.api.blocks.getCurrentBlockIndex());
          event.stopPropagation();
          if (items.length > 1) {
            removeItem({ id });
          }
        } else {
          setItemText({ id, value: text.slice(0, range.startOffset) });
          addNewItem({ value: newText, afterId: id, caret: true });
        }
      }
    }
  };

  const clearNewItem = (id) => {
    setItems((prev) => {
      deletePropsFromTool(
        prev.find((x) => x.id === id),
        ['newItem', 'moveIndex'],
      );
      return [...prev];
    });
  };

  useEffect(() => {
    const newItem = items.find((item) => item.newItem);
    if (newItem) {
      newItem.ref.current.focus();
      moveCaret(window, 0);
      clearNewItem(newItem.id);
    } else {
      const toItem = items.find((item) => item.moveIndex >= 0);
      if (toItem) {
        toItem.ref.current.focus();
        moveCaret(window, toItem.moveIndex);
        clearNewItem(toItem.id);
      }
    }
  }, [items]);

  return (
    <>
      <BaseHeader noHint toolName={block?.name} />
      <S.Wrapper>
        <S.Input
          ref={inputRef}
          onKeyDown={handleInputKeyDown}
          placeholder={t('tools.quiz.question')}
        />
        <S.ItemsWrapper ref={itemsWrapperRef}>
          {items.map(({ id, value, correct, ref }) => (
            <S.Item key={id} className={tool.CSS.item}>
              <S.Checkbox
                onClick={() => handleChangeChecked(id, correct)}
                correct={correct}
              />
              <S.ItemInput
                ref={ref}
                onKeyDown={(e) => {
                  handleKeyDown(e, id);
                }}
                placeholder={t('tools.quiz.answer')}
              >
                {htmlToReact(value)}
              </S.ItemInput>
            </S.Item>
          ))}
        </S.ItemsWrapper>
      </S.Wrapper>
    </>
  );
};

Quiz.propTypes = {
  tool: ToolType,
};

export default Quiz;
