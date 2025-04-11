import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';

const CustomNavbar = () => {
  return (
    <Navbar expand="lg" className="custom-navbar" variant="dark">
      <Container fluid className="px-4">
        <Navbar.Brand href="/">Previsão de Sucesso Académico</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="ms-auto">
            <Nav.Link href="#">Home</Nav.Link>
            <Nav.Link href="#">Funcionalidades</Nav.Link>
            <Nav.Link href="#">Resultados</Nav.Link>
            <Nav.Link href="#">Sobre</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
