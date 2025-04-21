import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../App.css";

import CustomNavbar from "./CustomNavBar";
import CustomFooter from "./CustomFooter";

function HomePage() {
  return (
    <div className="bg-light min-vh-100 d-flex flex-column justify-content-between">
      <Container fluid className="p-0">
        {/* NavBar */}
        <CustomNavbar />
        {/* Hero Section */}
        <section className="hero bg-primary text-white text-center py-5">
          <h1>Previsão de Sucesso Académico</h1>
          <p className="lead">
            Obtenha insights sobre seu desempenho acadêmico com base em dados
            históricos e tendências.
          </p>
        </section>
        {/* Funcionalidades e Footer */}
        <div class="container-fluid px-4">
        <section className="features text-center py-5">
  <h2>Funcionalidades</h2>
  <Row className="mt-4 justify-content-center">
    <Col xs={12} sm={6} md={3} className="mb-4 d-flex justify-content-center">
      <Link to="/prediction-form" className="link-sem-estilo">
        <Card className="h-100">
          <Card.Body>
            <Card.Title>Análise Preditiva</Card.Title>
            <Card.Text>
              Utilize algoritmos avançados para prever seu desempenho
              com base em dados passados.
            </Card.Text>
          </Card.Body>
        </Card>
      </Link>
    </Col>
    <Col xs={12} sm={6} md={3} className="mb-4 d-flex justify-content-center">
    <Link to="" className="link-sem-estilo">
      <Card className="h-100">
        <Card.Body>
          <Card.Title>Monitoramento Contínuo</Card.Title>
          <Card.Text>
            Acompanhe o progresso individual ao longo do tempo e receba alertas
            de possíveis riscos acadêmicos.
          </Card.Text>
        </Card.Body>
      </Card>
      </Link>
    </Col>
    <Col xs={12} sm={6} md={3} className="mb-4 d-flex justify-content-center">
      <Link to="/prediction-file" className="link-sem-estilo">
        <Card className="h-100">
          <Card.Body>
            <Card.Title>Análise Preditiva De Grupos</Card.Title>
            <Card.Text>
              Envie um ficheiro .csv e utilize algoritmos avançados para prever o desempenho do grupo
              com base em dados passados.
            </Card.Text>
          </Card.Body>
        </Card>
      </Link>
    </Col>
    <Col xs={12} sm={6} md={3} className="mb-4 d-flex justify-content-center">
      <Link to="/charts-page" className="link-sem-estilo">
        <Card className="h-100">
          <Card.Body>
            <Card.Title>Relatórios Detalhados</Card.Title>
            <Card.Text>
              Obtenha relatórios detalhados e gráficos interativos
              para uma visão clara do desempenho do grupo.
            </Card.Text>
          </Card.Body>
        </Card>
      </Link>
    </Col>
  </Row>
</section>


        </div>
      </Container>
      <footer>
        <CustomFooter />
      </footer>
    </div>
  );
}

export default HomePage;
