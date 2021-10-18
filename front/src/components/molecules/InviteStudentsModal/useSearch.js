import { useCallback, useMemo, useState } from 'react';

// TODO: this students will be get from API
const allStudents = [
  { value: 1, label: 'Jane Cooper' },
  { value: 2, label: 'Annette Black' },
  { value: 3, label: 'John Smith' },
];

const ACTION_TYPES = {
  CLEAR: 'clear',
  POP_VALUE: 'pop-value',
  REMOVE_VALUE: 'remove-value',
  SELECT_OPTION: 'select-option',
  CREATE_OPTION: 'create-option',
};

export const useSearch = ({ students, setStudents }) => {
  const [searchValues, setSearchValues] = useState([]);

  const searchOptions = useMemo(
    () =>
      allStudents.filter(
        (student) => !students.some((s) => s.id === student.value),
      ),
    [students],
  );

  const clearValues = useCallback(() => {
    setSearchValues([]);
  }, []);

  const removeValue = useCallback(({ removedValue }) => {
    setSearchValues((prev) => [
      ...prev.filter((element) => element.value !== removedValue.value),
    ]);
  }, []);

  const selectValue = useCallback(({ option }) => {
    setSearchValues((prev) => [...prev, option]);
  }, []);

  const createValue = useCallback(({ option }) => {
    const newValues = option?.value?.split(',')?.map((value) => value.trim());
    setSearchValues((prev) => [
      ...prev,
      ...newValues
        .map((value) => ({
          isEmail: true,
          label: value,
          value,
        }))
        .filter((element) => !prev.some((p) => p.value === element.value)),
    ]);
  }, []);

  const handleSearchChange = useCallback(
    (_, value) => {
      switch (value.action) {
        case ACTION_TYPES.CLEAR:
          clearValues();
          break;
        case ACTION_TYPES.POP_VALUE:
        case ACTION_TYPES.REMOVE_VALUE:
          removeValue(value);
          break;
        case ACTION_TYPES.SELECT_OPTION:
          selectValue(value);
          break;
        case ACTION_TYPES.CREATE_OPTION:
          createValue(value);
          break;
        default:
          break;
      }
    },
    [clearValues, createValue, removeValue, selectValue],
  );

  const handleInviteStudents = useCallback(() => {
    setStudents((prev) => {
      const newStudents = searchValues.map(({ isEmail, value, label }, i) => {
        const id = isEmail ? i + 1 + prev.length : value;
        return {
          id,
          name: isEmail ? `Student(${label})` : label,
          isPending: isEmail,
        };
      });
      return [...prev, ...newStudents];
    });
    setSearchValues([]);
  }, [searchValues, setStudents]);

  return {
    searchValues,
    searchOptions,
    handleInviteStudents,
    handleSearchChange,
  };
};
