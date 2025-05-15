import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../App.css";

import CustomNavbar from "../components/CustomNavBar";
import CustomFooter from "../components/CustomFooter";

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
            Obtenha insights sobre o seu desempenho académico com base em dados
            históricos e tendências.
          </p>
        </section>

        {/* Funcionalidades */}
        <Container>

            <h2 className="text-center fw-bold top-title">Funcionalidades</h2>
    

          {/* Secção Individual */}
          <div className="mb-5">
            <div className="text-center mb-4">
              <h4 className=" section-title">Individual</h4>
              <hr className="w-50 mx-auto border-2 border-primary" />
            </div>
            <Row className="justify-content-center">
              <Col xs={12} sm={6} md={4} lg={3} className="d-flex mb-4">
                <Link to="/prediction-form" className="w-100 link-sem-estilo">
                  <Card className="shadow rounded h-100">
                    <Card.Body className="text-center">
                      <Card.Title>Análise Preditiva</Card.Title>
                      <Card.Text>
                        Utilize algoritmos para prever o seu desempenho com base em dados passados.
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>

              <Col xs={12} sm={6} md={4} lg={3} className="d-flex mb-4">
                <Link to="/person-progress-page" className="w-100 link-sem-estilo">
                  <Card className="shadow rounded h-100">
                    <Card.Body className="text-center">
                      <Card.Title>Acompanhamento Individual</Card.Title>
                      <Card.Text>
                        Visualize o seu progresso e receba alertas de riscos académicos.
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            </Row>
          </div>

          {/* Secção Grupo */}
          <div>
            <div className="text-center mb-4">
              <h4 className=" section-title">Grupo</h4>
              <hr className="w-50 mx-auto border-2 border-primary" />
            </div>
            <Row className="justify-content-center">
              <Col xs={12} sm={6} md={4} lg={3} className="d-flex mb-4">
                <Link to="/prediction-file" className="w-100 link-sem-estilo">
                  <Card className="shadow rounded h-100">
                    <Card.Body className="text-center">
                      <Card.Title>Análise Preditiva (Grupos)</Card.Title>
                      <Card.Text>
                        Envie um ficheiro CSV para prever o desempenho de um grupo.
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>

              <Col xs={12} sm={6} md={4} lg={3} className="d-flex mb-4">
                <Link to="/charts-page" className="w-100 link-sem-estilo">
                  <Card className="shadow rounded h-100">
                    <Card.Body className="text-center">
                      <Card.Title>Relatório Geral</Card.Title>
                      <Card.Text>
                        Veja relatórios e gráficos com uma visão geral do grupo.
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            </Row>
          </div>
        </Container>
      </Container>

      {/* Footer */}
      <footer>
        <CustomFooter />
      </footer>
    </div>
  );
}

export default HomePage;
