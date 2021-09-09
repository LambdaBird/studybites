import { List } from 'antd';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FilterOutlined } from '@ant-design/icons';

import { fetchKeywords } from '@sb-ui/utils/api/v1/keywords';

import * as S from './KeywordsFilterMobile.styled';

const KeywordsFilterMobile = ({ setKeywords }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const buttonRef = useRef(null);

  const handleSearch = useCallback(async (search) => {
    const data = await fetchKeywords({ search });
    setOptions(
      data.map((keyword, index) => ({ id: index, name: keyword.label })),
    );
  }, []);

  const intervalRef = useRef(null);

  const handleFocusOut = useCallback(() => {
    buttonRef.current.focus();
    intervalRef.current = setTimeout(() => {
      setOpen(false);
    }, 50);
  }, []);

  useEffect(() => {
    handleSearch('');
  }, [handleSearch]);

  useEffect(() => {
    const button = buttonRef.current;
    if (button) {
      button.addEventListener('focusout', handleFocusOut);
    }

    return () => button?.removeEventListener('focusout', handleFocusOut);
  }, [buttonRef, handleFocusOut]);

  useEffect(() => {
    if (!open) {
      setOptions((prev) => prev.map((x) => ({ ...x, checked: false })));
    }
  }, [open]);

  const handleApplyClick = useCallback(() => {
    setKeywords(
      options.filter((option) => option.checked).map((option) => option.name),
    );
  }, [options, setKeywords]);

  const handleKeywordClick = useCallback((id) => {
    clearInterval(intervalRef.current);
    setOptions((prev) => {
      const newOptions = prev.map((x) => ({ ...x }));
      const selectedItem = newOptions.find((option) => option.id === id);
      selectedItem.checked = !selectedItem.checked;
      return newOptions;
    });
  }, []);

  return (
    <>
      <S.FilterButton
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        icon={<FilterOutlined />}
      />
      {open && (
        <S.List
          footer={
            <S.ApplyButton onClick={handleApplyClick}>Apply</S.ApplyButton>
          }
          dataSource={options}
          renderItem={({ id, name, checked }) => (
            <List.Item onClick={() => handleKeywordClick(id)}>
              <S.ListItemContent checked={checked}>{name}</S.ListItemContent>
            </List.Item>
          )}
        />
      )}
      {open && <S.FilterBackground />}
    </>
  );
};

KeywordsFilterMobile.propTypes = {
  setKeywords: PropTypes.func,
};

export default KeywordsFilterMobile;
