import PropTypes from 'prop-types';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import ColumnDisabledCheckbox from '@sb-ui/components/atoms/ColumnDisabledCheckbox';

import { Typography } from 'antd';
import { useMemo } from 'react';

const { Text } = Typography;

const AnswerResult = ({ difference, options, correct }) => {
  const defaultValueCorrect = useMemo(
    () =>
      difference
        ?.map((x, i) => (x === true && !options[i].correct ? i : null))
        ?.filter((x) => x !== null),
    [difference, options],
  );

  const optionsDifference = useMemo(
    () =>
      difference
        ?.map((x, i) =>
          x === true
            ? {
                label: options[i].label,
                value: i,
              }
            : null,
        )
        ?.filter((x) => x !== null),
    [difference, options],
  );
  return (
    <>
      {correct ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text>You`r right !</Text>
          <CheckCircleTwoTone twoToneColor="#52c41a" />
        </div>
      ) : (
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text>You’re wrong. Correct answer:</Text>
            <CloseCircleTwoTone twoToneColor="#F5222D" />
          </div>

          <ColumnDisabledCheckbox
            value={defaultValueCorrect}
            options={optionsDifference}
          />
        </>
      )}
    </>
  );
};

AnswerResult.propTypes = {
  difference: PropTypes.arrayOf(PropTypes.bool).isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  correct: PropTypes.bool.isRequired,
};

export default AnswerResult;
