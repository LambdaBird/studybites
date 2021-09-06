import {
  Badge,
  Button,
  Col,
  Input,
  Row,
  Select as AntdSelect,
  Typography,
} from 'antd';
import styled from 'styled-components';
import { SmallDashOutlined } from '@ant-design/icons';

import variables from '@sb-ui/theme/variables';

export const Page = styled.div`
  height: 100%;
  width: 100%;
  padding: 2rem;
`;

export const StyledRow = styled(Row).attrs({
  align: 'top',
})`
  height: 100%;
  width: 100%;
  display: flex;
`;

export const LeftCol = styled(Col).attrs({
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
})`
  height: 100%;
  @media (min-width: 1450px) {
    margin: 0 auto;
  }
`;

export const EditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 40px;
  min-height: 100%;
  padding: 2rem;
  max-width: 850px;
  position: relative;
`;

export const RightCol = styled(Col).attrs({
  sm: 12,
  md: 10,
  lg: 8,
  xl: 6,
})`
  height: 100%;
  width: 100%;
  position: fixed;
  right: 0;
  padding: 2rem;
  @media (min-width: 1600px) {
    right: 8rem;
  }
`;

export const InputTitle = styled(Input).attrs({
  type: 'text',
})`
  font-size: 1.5rem;
  width: 100%;
`;

export const SaveButton = styled(Button).attrs({
  type: 'primary',
  size: 'large',
})`
  width: 100%;
`;

export const StudentsCount = styled(Badge)`
  margin-left: 0.5rem;
  & sup {
    color: #999;
    background-color: #fff;
    box-shadow: 0 0 0 1px #d9d9d9 inset;
  }
`;

export const TextLink = styled(Typography.Link)`
  color: ${variables['text-color']}!important;
`;

export const HeaderButtons = styled(Col)`
  margin-left: auto;
  margin-right: 2rem;
`;

export const PublishButton = styled(Button)`
  margin-left: 1rem;
`;

export const RowStyled = styled(Row)`
  margin-bottom: 2rem;
`;

export const StudentsCol = styled(Col)`
  display: flex;
  align-items: center;
`;

export const CourseLessonWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SelectWrapper = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CourseWrapper = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
  flex-direction: column;
`;

export const DivideLesson = styled(SmallDashOutlined)`
  font-size: xx-large;
  transform: rotate(90deg);
  margin-top: 1rem;
`;

export const InputWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const BadgeWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  margin-left: 1rem;
`;

export const CardBadge = styled(Badge)`
  min-width: 50px;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  text-align: center;
  border: 1px solid #d9d9d9;
`;

export const StatusText = styled(Typography.Text)`
  font-size: 1rem;
  color: ${variables['secondary-text-color']};
`;

export const Select = styled(AntdSelect).attrs({
  mode: 'multiple',
})`
  margin-right: 1rem;
  width: 100%;
`;
