import React from 'react';
import { Container } from 'react-bootstrap';

const ContainerComponent = (props) => (
  <Container fluid className="body-container">
    {props.children}
  </Container>
);

export default ContainerComponent;