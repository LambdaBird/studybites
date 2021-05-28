import styled from 'styled-components';
import { Row, Button, Col } from 'antd';

export const Wrapper = styled(Row)`
    height: 100%;
    padding: 8px;
    box-shadow: 0px 2px 8px 0px #00000026;
    background: rgba(255, 255, 255, 1);
`;

export const CardDescription = styled(Col)`
    height: 100%;
    display: flex;
    flex-direction: rows;
    justify-content: space-between;
`;

export const CardImage = styled.img`
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
`;

export const ImageCol = styled(Col)`
    height: 100%;
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
