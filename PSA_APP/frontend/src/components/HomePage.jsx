import React from 'react';
import { Container, Button, Row, Col, Card, Carousel, Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../App.css';

import CustomNavbar from './NavBar';


function HomePage() {
  return (
    <div className="bg-light min-vh-100 d-flex flex-column justify-content-between">
      <Container fluid className="p-0">
      {/* NavBar */}
      <CustomNavbar />
        {/* Hero Section */}
        <section className="hero bg-primary text-white text-center py-5">
          <h1>Previsão de Sucesso Académico</h1>
          <p className="lead">Obtenha insights sobre seu desempenho acadêmico com base em dados históricos e tendências.</p>
          {/* Botão que chama a função para navegar e substituir a página */}
          <Link to="/prediction-form">
            <Button variant="primary" size="lg">Experimente Agora</Button>
          </Link>
        </section>

        {/* Carousel */}
        <Carousel>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://via.placeholder.com/1920x600?text=Análise+Académica"
              alt="Primeira Slide"
            />
            <Carousel.Caption>
              <h3>Análise de Resultados</h3>
              <p>Explore como suas notas e comportamento afetam seu sucesso acadêmico futuro.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://via.placeholder.com/1920x600?text=Previsão+Personalizada"
              alt="Segunda Slide"
            />
            <Carousel.Caption>
              <h3>Previsões Personalizadas</h3>
              <p>Receba previsões precisas e personalizadas com base em seus dados acadêmicos.</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>

        {/* Funcionalidades e Footer */}
        <div class="container-fluid px-4">
        <section className="features text-center py-5">
          <h2>Funcionalidades</h2>
          <Row className="mt-4">
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Análise Preditiva</Card.Title>
                  <Card.Text>
                    Utilize algoritmos avançados para prever seu desempenho com base em dados passados.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Monitoramento Contínuo</Card.Title>
                  <Card.Text>
                    Acompanhe seu progresso ao longo do tempo e receba alertas de possíveis riscos acadêmicos.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Relatórios Detalhados</Card.Title>
                  <Card.Text>
                    Obtenha relatórios detalhados e gráficos interativos para uma visão clara de seu desempenho.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>
        </div>
        
      </Container>

      <footer className="bg-dark text-white text-center py-3">
        <p className="mb-0">&copy; 2025 Previsão Académica. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default HomePage;




