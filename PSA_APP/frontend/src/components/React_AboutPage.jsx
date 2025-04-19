import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "../App.css";

import CustomNavbar from "./CustomNavBar";
import CustomFooter from "./CustomFooter";

export default function Sobre() {
  return (
    <div className="bg-light min-vh-100 d-flex flex-column justify-content-between">
    <Container fluid className="p-0">
      {/* NavBar */}
      <CustomNavbar />

      {/* Seção Hero */}
      <section className="hero bg-primary text-white text-center py-5">
        <h1>Sobre o Projeto PSA</h1>
        <p className="lead">
          Uma abordagem inteligente para melhorar o sucesso académico através da análise de dados.
        </p>
      </section>
      </Container>
      {/* Conteúdo principal */}
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={10}>
            {/* Objetivo do Projeto */}
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <Card.Title className="titulo-card fw-bold">Objetivo do Projeto</Card.Title>
                <Card.Text className="text-muted">
                  O <strong>Projeto PSA (Previsão de Sucesso Acadêmico)</strong> visa apoiar instituições de ensino na identificação precoce de estudantes em risco, usando <strong>Machine Learning</strong> para análise de dados acadêmicos, comportamentais e demográficos. Assim, são fornecidos insights para decisões pedagógicas mais eficazes e personalizadas.
                </Card.Text>
                <Card.Text className="text-muted">
                  Este projeto procura contribuir para a <strong>redução da desistência e reprovação</strong>, promovendo uma educação mais inclusiva, proativa e centrada no estudante.
                </Card.Text>
              </Card.Body>
            </Card>

            {/* Pessoas Envolvidas */}
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <Card.Title className="titulo-card fw-bold">Pessoas Envolvidas</Card.Title>
                <ul className="mb-0 text-muted">
                  <li><strong>Ricardo Amorim</strong> – Desenvolvimento do modelo, backend e integração</li>
                  <li><strong>Docentes da unidade curricular de Projeto I</strong> – Orientação técnica</li>
                </ul>
              </Card.Body>
            </Card>

            {/* Entidades Parceiras */}
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title className="titulo-card fw-bold">Entidades Parceiras</Card.Title>
                <ul className="mb-0 text-muted">
                  <li>Universidade Lusófona do Porto (ULP)</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <footer>
        <CustomFooter />
      </footer>
    </div>
  );
}
