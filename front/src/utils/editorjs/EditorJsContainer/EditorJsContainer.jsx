import DragDrop from 'editorjs-drag-drop';
import PropTypes from 'prop-types';
import { forwardRef, useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import EditorJS from '@editorjs/editorjs';

import { useToolbox } from '@sb-ui/utils/editorjs/EditorJsContainer/useToolbox';
import Undo from '@sb-ui/utils/editorjs/undo-plugin';

import * as S from './EditorJsContainer.styled';

const EditorJsContainer = forwardRef((props, ref) => {
  const mounted = useRef();
  const { t } = useTranslation('editorjs');
  const instance = useRef(null);

  const { prepareToolbox, updateLanguage } = useToolbox({ editor: instance });

  const { children, language } = props;
  const holder = useMemo(
    () =>
      `editor-js-${(Math.floor(Math.random() * 1000) + Date.now()).toString(
        36,
      )}`,
    [],
  );

  const initialLanguage = useRef(language);

  const handleChange = useCallback(
    async (api) => {
      const { onCompareBlocks, onChange, data } = props;
      if (!onChange) {
        return;
      }

      const newData = await instance.current.save();
      const isBlocksEqual = onCompareBlocks?.(newData.blocks, data?.blocks);

      if (isBlocksEqual) {
        return;
      }

      onChange(api, newData);
    },
    [props],
  );

  const handleReady = useCallback(async (editor) => {
    if (editor) {
      prepareToolbox();
      try {
        // eslint-disable-next-line no-param-reassign
        ref.current = new Undo({
          editor,
          redoButton: 'redo-button',
          undoButton: 'undo-button',
        });
        // eslint-disable-next-line no-new
        new DragDrop(editor);
        ref.current.initialize(props.data);
      } catch (e) {
        // eslint-disable-next-line no-param-reassign
        ref.current = null;
      }
    }
    // Ref is passing through forwardRef and creating with useRef()
    // No need passing to useCallback dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initEditor = useCallback(
    async (data) => {
      const {
        instanceRef,
        // eslint-disable-next-line no-shadow
        children,
        enableReInitialize,
        tools,
        onChange,
        onReady,
        ...anotherProps
      } = props;

      if (instance.current) {
        return;
      }

      const newInstance = new EditorJS({
        tools,
        holder,

        onReady: () => handleReady(newInstance),

        ...(onChange && {
          onChange: () => handleChange(newInstance),
        }),
        ...anotherProps,
        ...data,

        i18n: {
          messages: {
            ui: {
              toolbar: {
                toolbox: {
                  Add: t('toolbar.toolbox.add'),
                },
              },
              inlineToolbar: {
                converter: {
                  'Convert to': t('toolbar.converter.convert_to'),
                },
              },
              blockTunes: {
                toggler: {
                  'Click to tune': t('block_tunes.toggler.tune'),
                  'or drag to move': t('block_tunes.toggler.drag'),
                },
              },
            },
            blockTunes: {
              delete: {
                Delete: t('block_tunes.actions.delete'),
              },
              moveUp: {
                'Move up': t('block_tunes.actions.move_up'),
              },
              moveDown: {
                'Move down': t('block_tunes.actions.move_down'),
              },
            },
            toolNames: {
              Text: t('tools.paragraph.title'),
              Attach: t('tools.attach.title'),
              Image: t('tools.image.title'),
              Next: t('tools.next.title'),
              Quiz: t('tools.quiz.title'),
              Video: t('tools.embed.title'),
              Heading: t('tools.header.title'),
              List: t('tools.list.title'),
              Quote: t('tools.quote.title'),
              Delimiter: t('tools.delimiter.title'),
              Table: t('tools.table.title'),
              'Closed Question': t('tools.closed_question.title'),
              'Graded Question': t('tools.graded_question.title'),
              Warning: t('tools.warning.title'),
              Code: t('tools.code.title'),
              Marker: t('tools.marker.title'),
              Bold: t('tools.bold.title'),
              Italic: t('tools.italic.title'),
              Link: t('tools.link.title'),
              Bricks: t('tools.bricks.title'),
            },
            tools: {
              stub: {
                'The block can not be displayed correctly.':
                  t('tools.stub.title'),
              },
              attach: {
                title: t('tools.attach.title'),
                select: t('tools.attach.select'),
                file_size_limit: t('tools.attach.file_size'),
                file_invalid_type: t('tools.attach.file_type'),
                error: t('tools.attach.error'),
              },
              image: {
                title: t('tools.image.title'),
                input: t('tools.image.input'),
                caption: t('tools.image.caption'),
                select: t('tools.image.select'),
                error: t('tools.image.error'),
              },
              next: {
                title: t('tools.next.title'),
                button: t('tools.next.title'),
              },
              paragraph: {
                title: t('tools.paragraph.title'),
              },
              list: {
                title: t('tools.list.title'),
              },
              delimiter: {
                title: t('tools.delimiter.title'),
              },
              quiz: {
                title: t('tools.quiz.title'),
                question: t('tools.quiz.question'),
                answer: t('tools.quiz.answer'),
              },
              embed: {
                title: t('tools.embed.title'),
                input: t('tools.embed.input'),
                caption: t('tools.embed.caption'),
              },
              header: {
                title: t('tools.header.title'),
                input: t('tools.header.input'),
              },
              quote: {
                title: t('tools.quote.title'),
                input: t('tools.quote.input'),
                caption: t('tools.quote.caption'),
              },
              table: {
                title: t('tools.table.title'),
                col_before: t('tools.table.col_before'),
                col_after: t('tools.table.col_after'),
                row_before: t('tools.table.row_before'),
                row_after: t('tools.table.row_after'),
                delete_col: t('tools.table.delete_col'),
                delete_row: t('tools.table.delete_row'),
              },
              closedQuestion: {
                title: t('tools.closed_question.title'),
                question: t('tools.closed_question.question'),
                answer: t('tools.closed_question.answer'),
                explanation: t('tools.closed_question.explanation'),
                tag_title: t('tools.closed_question.tag_title'),
                example: t('tools.closed_question.example'),
                none: t('tools.closed_question.none'),
              },
              gradedQuestion: {
                title: t('tools.graded_question.title'),
                hint: t('tools.graded_question.hint'),
                placeholder: t('tools.graded_question.placeholder'),
                require_attachment: t(
                  'tools.graded_question.require_attachment',
                ),
              },
              fillTheGap: {
                title: t('tools.fill_the_gap.title'),
                hint_part_one: t('tools.fill_the_gap.hint_part_one'),
                hint_part_two: t('tools.fill_the_gap.hint_part_two'),
                placeholder: t('tools.fill_the_gap.placeholder'),
              },
              match: {
                title: t('tools.match.title'),
                input_left_placeholder: t('tools.match.input_left_placeholder'),
                input_right_placeholder: t(
                  'tools.match.input_right_placeholder',
                ),
                hint: t('tools.match.hint'),
                add_line: t('tools.match.add_line'),
              },
              warning: {
                title: t('tools.warning.title'),
                placeholder: t('tools.warning.placeholder'),
                message: t('tools.warning.message'),
              },
              code: {
                title: t('tools.code.title'),
                placeholder: t('tools.code.placeholder'),
              },
              bricks: {
                title: t('tools.bricks.title'),
                question: t('tools.bricks.question'),
                answer: t('tools.bricks.answer'),
                additional: t('tools.bricks.additional'),
                hint: t('tools.bricks.hint'),
              },
            },
          },
        },
      });

      instance.current = newInstance;

      if (instanceRef) {
        instanceRef(newInstance);
      }
    },
    [handleChange, handleReady, holder, props, t],
  );

  const destroyEditor = useCallback(async () => {
    Array.from(document.querySelectorAll('.ct--bottom')).forEach(
      (codexTooltip) => codexTooltip.remove(),
    );

    if (!instance.current) {
      return;
    }

    await instance.current.isReady;
    if (instance.current.destroy) {
      await instance.current.destroy();
      instance.current = null;
    }
  }, []);

  const changeData = useCallback((data) => {
    if (instance.current) {
      instance.current?.isReady
        .then(() => {
          instance.current.clear();
          instance.current.render(data);
        })
        .catch(() => {
          // do nothing
        });
    }
  }, []);

  useEffect(() => {
    if (initEditor && !instance.current) {
      initEditor();
      return destroyEditor;
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    } else {
      const { enableReInitialize, data } = props;

      if (!enableReInitialize || !data) {
        return () => {};
      }

      changeData(data);
    }
    return () => {};
  }, [changeData, props]);

  const renderEditorWithBlocks = useCallback(async () => {
    const { blocks } = await instance.current.save();
    await destroyEditor();
    await initEditor({ data: { blocks } });
  }, [destroyEditor, initEditor]);

  useEffect(() => {
    if (language !== initialLanguage.current) {
      initialLanguage.current = language;
      renderEditorWithBlocks();
    }
  }, [destroyEditor, initEditor, language, renderEditorWithBlocks]);

  useEffect(() => {
    updateLanguage();
  }, [language, updateLanguage]);

  return (
    <>
      <S.GlobalStylesEditorPage toolbarHint={t('tools.hint')} />
      {children || <div id={holder} />}
    </>
  );
});

EditorJsContainer.propTypes = {
  toolbox: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  language: PropTypes.string,
  children: PropTypes.node,
  enableReInitialize: PropTypes.bool,
  readOnly: PropTypes.bool,
  data: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    blocks: PropTypes.array,
  }),
  // eslint-disable-next-line react/forbid-prop-types
  tools: PropTypes.object,
  onChange: PropTypes.func,
  onReady: PropTypes.func,
  onCompareBlocks: PropTypes.func,
  instanceRef: PropTypes.func,
};

export default EditorJsContainer;
