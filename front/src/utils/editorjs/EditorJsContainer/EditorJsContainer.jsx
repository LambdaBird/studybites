import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import EditorJS from '@editorjs/editorjs';
import Paragraph from '@editorjs/paragraph';

const EditorJsContainer = (props) => {
  const { t } = useTranslation('editorjs');

  const mounted = useRef();

  const { children } = props;
  const holder = useMemo(
    () =>
      `editor-js-${(Math.floor(Math.random() * 1000) + Date.now()).toString(
        36,
      )}`,
    [],
  );

  const [instance, setInstance] = useState(null);

  const handleChange = useCallback(
    async (api) => {
      const { onCompareBlocks, onChange, data } = props;
      if (!onChange) {
        return;
      }

      const newData = await instance.save();
      const isBlocksEqual = onCompareBlocks?.(newData.blocks, data?.blocks);

      if (isBlocksEqual) {
        return;
      }

      onChange(api, newData);
    },
    [instance, props],
  );

  const handleReady = useCallback(() => {
    const { onReady } = props;
    if (!onReady) {
      return;
    }

    onReady(instance);
  }, [instance, props]);

  const initEditor = useCallback(() => {
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

    const extendTools = {
      // default tools
      paragraph: {
        class: Paragraph,
        inlineToolbar: true,
      },
      ...tools,
    };

    const newInstance = new EditorJS({
      tools: extendTools,
      holder,

      ...(onReady && {
        onReady: handleReady,
      }),

      ...(onChange && {
        onChange: handleChange,
      }),
      ...anotherProps,

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
            }
            ,
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
            Text: t('tools.text.title'),
            Image: t('tools.image.title'),
            Next: t('tools.next.title'),
            Quiz: t('tools.quiz.title'),
            Video: t('tools.video.title'),
            Heading: t('tools.heading.title'),
            List: t('tools.list.title'),
            Quote: t('tools.quote.title'),
            Delimiter: t('tools.delimiter.title'),
            Table: t('tools.table.title'),
            'Closed Question': t('tools.closed_question.title'),
            Warning: t('tools.warning.title'),
            Code: t('tools.code.title'),
            Marker: t('tools.marker.title'),
            Bold: t('tools.bold.title'),
            Italic: t('tools.italic.title'),
            Link: t('tools.link.title'),
          },
          tools: {
            stub: {
              'The block can not be displayed correctly.':
                t('tools.stub.title'),
            },
            image: {
              input: t('tools.image.input'),
              caption: t('tools.image.caption'),
            },
            next: {
              button: t('tools.next.title'),
            },
            quiz: {
              question: t('tools.quiz.question'),
              answer: t('tools.quiz.answer'),
            },
            embed: {
              input: t('tools.video.input'),
              caption: t('tools.video.caption'),
            },
            header: {
              input: t('tools.heading.input'),
            },
            quote: {
              input: t('tools.quote.input'),
              caption: t('tools.quote.caption'),
            },
            table: {
              col_before: t('tools.table.col_before'),
              col_after: t('tools.table.col_after'),
              row_before: t('tools.table.row_before'),
              row_after: t('tools.table.row_after'),
              delete_col: t('tools.table.delete_col'),
              delete_row: t('tools.table.delete_row'),
            },
            closedQuestion: {
              question: t('tools.closed_question.question'),
              answer: t('tools.closed_question.answer'),
              explanation: t('tools.closed_question.explanation'),
              tag_title: t('tools.closed_question.tag_title'),
              example: t('tools.closed_question.example'),
              none: t('tools.closed_question.none'),
            },
            warning: {
              placeholder: t('tools.warning.placeholder'),
              message: t('tools.warning.message'),
            },
            code: {
              placeholder: t('tools.code.placeholder'),
            },
          },
        },
      },
    });

    setInstance(newInstance);

    if (instanceRef) {
      instanceRef(newInstance);
    }
  }, [handleChange, handleReady, holder, props, t]);

  const destroyEditor = () => {
    if (!instance) {
      return;
    }

    (async () => {
      await instance.isReady;
      if (instance.destroy) {
        instance.destroy();
        setInstance(undefined);
      }
    })();
  };

  useEffect(() => {
    instance?.isReady.then(() => {
      if (props.readOnly) {
        instance.readOnly.toggle(true);
      } else {
        instance.readOnly.toggle(false);
      }
    });
    // eslint-disable-next-line react/destructuring-assignment
  }, [instance, props.readOnly]);

  const changeData = useCallback((data) => {
    if (instance) {
      instance?.isReady
        .then(() => {
          instance.clear();
          instance.render(data);
        })
        .catch(() => {
          // do nothing
        });
    }
  }, []);

  useEffect(() => {
    initEditor();
    return destroyEditor;
  }, []);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    } else {
      const { enableReInitialize, data } = props;

      if (!enableReInitialize || !data) {
        return () => {
        };
      }

      changeData(data);
    }
    return () => {
    };
  }, [changeData, props]);

  return children || <div id={holder} />;
};

EditorJsContainer.propTypes = {
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
