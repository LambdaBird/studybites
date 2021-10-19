import { Checkbox } from 'antd';
import { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { setPropsInTool } from '@sb-ui/utils/editorjs/utils';

import BaseHeader from '../../PluginBase/BaseHeader';

import { ToolType } from './types';
import * as S from './GradedQuestion.styled';

const GradedQuestion = ({ tool }) => {
  const { t } = useTranslation('editorjs');
  const input = useRef();
  const { data, block } = tool || {};

  useEffect(() => {
    input.current.innerHTML = data?.question || '';
    setPropsInTool(tool, {
      requireAttachment: data.requireAttachment,
      questionInput: input.current,
    });
  }, [data?.question, data?.requireAttachment, tool]);

  const handleSwitchAttachment = useCallback(
    (event) => {
      setPropsInTool(tool, {
        requireAttachment: event.target.checked,
      });
    },
    [tool],
  );

  const handleInputKeyDown = useCallback(
    (event) => {
      if (
        event.code === 'Backspace' &&
        input.current.innerText.trim().length === 0
      ) {
        tool.api.blocks.delete();
      }
    },
    [tool],
  );

  return (
    <>
      <BaseHeader toolName={block?.name} />
      <S.Input
        onKeyDown={handleInputKeyDown}
        ref={input}
        placeholder={t('tools.graded_question.placeholder')}
      />
      <S.Bottom>
        <S.Text>{t('tools.graded_question.require_attachment')}</S.Text>
        <Checkbox
          disabled={tool.readOnly}
          defaultChecked={tool.data.requireAttachment}
          onChange={handleSwitchAttachment}
        />
      </S.Bottom>
    </>
  );
};

GradedQuestion.propTypes = {
  tool: ToolType,
};

export default GradedQuestion;
