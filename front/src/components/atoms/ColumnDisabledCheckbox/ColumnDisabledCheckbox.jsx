import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import * as S from './ColumnDisabledCheckbox.styled';

const ColumnDisabledCheckbox = ({ value, options }) => (
  <Row>
    {options.map((opt, i) => (
      <Col span={24}>
        <S.DisabledCheckbox disabled checked={value.includes(i)}>
          {opt.label}
        </S.DisabledCheckbox>
      </Col>
    ))}
  </Row>
);

ColumnDisabledCheckbox.propTypes = {
  value: PropTypes.arrayOf(PropTypes.number).isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default ColumnDisabledCheckbox;
