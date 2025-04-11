import React from 'react';
import { Container } from 'react-bootstrap';

const CustomFooter = () => {
  return (
    <footer className="bg-dark text-white text-center py-3">
      <Container>
        <p className="mb-0">&copy; 2025 Previsão Académica. Todos os direitos reservados.</p>
      </Container>
    </footer>
  );
};

export default CustomFooter;
