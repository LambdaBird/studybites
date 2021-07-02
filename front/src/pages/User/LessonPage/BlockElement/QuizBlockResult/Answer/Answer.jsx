import PropTypes from 'prop-types';
import { Col } from 'antd';
import ColumnDisabledCheckbox from '@sb-ui/components/atoms/ColumnDisabledCheckbox';
import { useMemo } from 'react';

const Answer = ({ options }) => {
  const defaultValueAnswers = useMemo(
    () =>
      options
        ?.map((x) => (x.correct ? x.value : null))
        .filter((x) => x !== null),
    [options],
  );
  return (
    <>
      <Col span={24}>
        <ColumnDisabledCheckbox value={defaultValueAnswers} options={options} />
      </Col>
      <Col span={24} />
    </>
  );
};

Answer.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Answer;
