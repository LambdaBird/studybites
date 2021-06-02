import styled from 'styled-components';
import { Col } from 'antd';
import { WHITE_COLOR } from '../../../resources/styles/Global.styled';

export const AuthorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: ${WHITE_COLOR};
  height: 2.5rem;
  width: 8rem;
  position: absolute;
  left: 1rem;
  bottom: 0.5rem;
  border-radius: 5px;
  padding: 0.5rem 0;
`;

export const ProgressBarCol = styled(Col)`
  margin-top: 1rem;
`;

export const MoreIconImg = styled.img`
  cursor: pointer;
`;
