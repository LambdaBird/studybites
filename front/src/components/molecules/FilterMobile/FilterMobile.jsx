import { List } from 'antd';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';

import * as S from './FilterMobile.styled';

const FilterMobile = ({ fetchData, icon, setData }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const buttonRef = useRef(null);

  const handleSearch = useCallback(
    async (search) => {
      const data = await fetchData({ search });
      setOptions(
        data.map((keyword) => ({
          id: keyword.value,
          name: keyword.label,
        })),
      );
    },
    [fetchData],
  );

  useEffect(() => {
    handleSearch('');
  }, [handleSearch]);

  useEffect(() => {
    if (!open) {
      setOptions((prev) => prev.map((x) => ({ ...x, checked: false })));
    }
  }, [open]);

  const handleApplyClick = useCallback(() => {
    setOpen(false);
    setData(
      options.filter((option) => option.checked).map((option) => option.id),
    );
  }, [options, setData]);

  const handleKeywordClick = useCallback((id) => {
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
        onClick={() => setOpen((prev) => !prev)}
        icon={icon}
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
      {open && (
        <S.FilterBackground
          onClick={() => {
            setOpen(false);
          }}
        />
      )}
    </>
  );
};

FilterMobile.propTypes = {
  icon: PropTypes.element,
  setData: PropTypes.func,
  fetchData: PropTypes.func,
};

export default FilterMobile;
