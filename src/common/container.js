import React from 'react';
import { Container } from 'react-bootstrap';

const ContainerComponent = (props) => (
  <Container fluid className="body-container" style={{backgroundColor: "#E9F6F9"}}>
    {props.children}
  </Container>
);

export default ContainerComponent;