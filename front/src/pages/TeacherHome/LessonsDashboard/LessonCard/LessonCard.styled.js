import styled from 'styled-components';
import { Row, Button, Col } from 'antd';

export const Wrapper = styled(Row)`
	padding: 8px;
	box-shadow: 0px 2px 8px 0px #00000026;
	background: rgba(255, 255, 255, 1);
`;

export const CardDescription = styled(Col)`
	display: flex;
	flex-direction: rows;
	justify-content: space-between;
`;


export const CardText = styled(Col)`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: flex-start; 
`;

export const CardButton = styled(Button)`
	justify-self: flex-end;
	align-self: flex-end;
	margin: 0 8px 0 0;
`;
