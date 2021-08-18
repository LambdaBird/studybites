import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import Paragraph from '@editorjs/paragraph';

const EditorJsContainer = (props) => {
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
    });

    setInstance(newInstance);

    if (instanceRef) {
      instanceRef(newInstance);
    }
  }, [handleChange, handleReady, holder, props]);

  const destroyEditor = () => {
    const codexTooltips = Array.from(document.querySelectorAll('.ct--bottom'));
    codexTooltips.forEach((codexTooltip) => codexTooltip.remove());

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
        return () => {};
      }

      changeData(data);
    }
    return () => {};
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
