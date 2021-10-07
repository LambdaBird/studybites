import { Checkbox } from 'antd';
import T from 'prop-types';
import { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { setPropsInTool } from '@sb-ui/utils/editorjs/utils';

import BaseHeader from '../../PluginBase/BaseHeader';

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

  return (
    <>
      <BaseHeader toolName={block?.name} />
      <S.Input
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
  tool: T.shape({
    api: T.shape({
      i18n: T.shape({
        t: T.func,
      }),
    }),
    block: T.shape({
      name: T.string,
    }),
    data: T.shape({
      requireAttachment: T.bool,
      questionInput: T.element,
    }),
    requireAttachment: T.bool,
    questionInput: T.element,
    readOnly: T.bool,
  }),
};

export default GradedQuestion;
