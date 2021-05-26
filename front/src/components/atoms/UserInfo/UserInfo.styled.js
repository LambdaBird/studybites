import styled from 'styled-components';
import { Row, Col, Statistic, Divider } from 'antd';

export const Wrapper = styled(Row)`
  max-width: 1323px; 
  padding: 16px 24px 16px 24px;
	box-shadow: 0px 4px 4px 0px rgba(240, 241, 242, 1);
	font-size: 1rem;
	font-weight: 500;
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
	@media (max-width: 576px) {
    font-size: 0.6rem;
  }
`;

export const AvatarCol = styled(Col)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const TextCol = styled(Col)`
	display: flex;
	flex-direction: column;
	justify-content: center;
  align-items: flex-start;
`;

export const StatisticCol = styled(Col)`
	display: flex;
	justify-content: flex-end;
  align-items: center;
`;

export const WelcomeText = styled.p`
	margin: 0;
`;

export const UserDescription = styled.p`
  margin: 0;
	color: rgba(0, 0, 0, 0.45);
	font-size: 0.8rem; 
	font-weight: 400;
  @media (max-width: 768px) {
    font-size: 0.6rem;
  }
	@media (max-width: 576px) {
    font-size: 0.5rem;
  }
`;

export const StatisticCell = styled(Statistic)`
  text-align: left;
  padding-left: 32px; 
  font-size: 0.8rem; 
	font-weight: 400;
  @media (max-width: 768px) {
    font-size: 0.6rem;
  }
	@media (max-width: 576px) {
    font-size: 0.5rem;
  }
`;

export const StatisticDivider = styled(Divider)`
  margin: 0 0 0 32px;
`;

export const Suffix = styled.p`
  margin: 0;
	font-size: 0.8rem; 
	font-weight: 400;
  @media (max-width: 768px) {
    font-size: 0.6rem;
  }
	@media (max-width: 576px) {
    font-size: 0.5rem;
  }
`;

export const StatisticTitle = styled.p`
  font-size: 0.8rem; 
	font-weight: 400;
  @media (max-width: 768px) {
    font-size: 0.6rem;
  }
	@media (max-width: 576px) {
    font-size: 0.5rem;
  }
`;