import React from "react";
import { FaGithub } from "react-icons/fa";
import { Container, Row, Col, Card, Table } from "react-bootstrap";
import "../App.css";

import CustomNavbar from "../components/CustomNavBar";
import CustomFooter from "../components/CustomFooter";

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
            Uma abordagem inteligente para melhorar o sucesso académico através
            da análise de dados.
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
                <Card.Title className="titulo-card fw-bold">
                  Objetivo do Projeto
                </Card.Title>
                <Card.Text className="text-muted">
                  O <strong>Projeto PSA (Previsão de Sucesso Académico)</strong>{" "}
                  visa apoiar instituições de ensino na identificação precoce de
                  estudantes em risco, usando <strong>Machine Learning</strong>{" "}
                  para análise de dados académicos, comportamentais e
                  demográficos. Assim, são fornecidos insights para decisões
                  pedagógicas mais eficazes e personalizadas.
                </Card.Text>
                <Card.Text className="text-muted">
                  Este projeto procura contribuir para a{" "}
                  <strong>redução da desistência e reprovação</strong>,
                  promovendo uma educação mais inclusiva, proativa e centrada no
                  estudante.
                </Card.Text>
              </Card.Body>
            </Card>

            {/* Pessoas Envolvidas */}
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <Card.Title className="titulo-card fw-bold">
                  Pessoas Envolvidas
                </Card.Title>
                <ul className="mb-0 text-muted">
                  <li>
                    <strong>Ricardo Amorim</strong> – Desenvolvimento do modelo,
                    backend e integração
                  </li>
                  <li>
                    <strong>Docentes da unidade curricular de Projeto I</strong>{" "}
                    – Orientação técnica
                  </li>
                </ul>
              </Card.Body>
            </Card>

            {/* Modelos Desenvolvidos */}
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <Card.Title className="titulo-card fw-bold">
                  Modelos Desenvolvidos e Avaliação
                </Card.Title>
                <Card.Text className="text-muted mb-3">
                  Abaixo estão os modelos de Machine Learning utilizados no
                  projeto, juntamente com suas características :
                </Card.Text>

                <Table
                  striped
                  bordered
                  hover
                  responsive
                  className="text-muted"
                  style={{ fontSize: "0.55rem" }}
                >
                  <thead className="table-primary text-center">
                    <tr>
                      <th>Tipo</th>
                      <th>Data</th>
                      <th>Modelo</th>
                      <th>Transformador</th>
                      <th>Características</th>
                      <th>
                        Hyperparameter
                        <br />
                        Tuning
                      </th>
                      <th>F1-Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Ensemble by Majority Voting</td>

                      <td>27/04/2025</td>
                      <td>
                        <strong>ensemble_model_2.pkl</strong>
                      </td>
                      <td>
                        Features Numéricas: <br />
                        StandardScaler. <br />
                        Features Categóricas: <br />
                        LabelEncoder + OneHotEncoder.
                      </td>
                      <td>
                        Pipeline (Transformer + MLP)
                        <br />
                        Pipeline (Transformer + RF)
                        <br />
                        Pipeline (Transformer + SVM)
                      </td>
                      <td>
                        GridSearchCV
                        <br />
                        GridSearchCV
                        <br />
                        HalvingRandomSearchCV
                      </td>
                      <td>82%</td>
                    </tr>
                    <tr>
                      <td>SVM - Support Vector Machine</td>
                      <td>27/04/2025</td>
                      <td>
                        <strong>svm_pipeline.pkl</strong>
                      </td>
                      <td>
                        Features Numéricas:
                        <br />
                        StandardScaler. <br />
                        Features Categóricas:
                        <br />
                        LabelEncoder + OneHotEncoder.
                      </td>
                      <td>Pipeline (Transformer + SVM)</td>
                      <td>HalvingRandomSearchCV</td>
                      <td>37%</td>
                    </tr>
                    <tr>
                      <td>MLP - Redes Neuronais</td>
                      <td>08/04/2025</td>
                      <td>
                        <strong>mlp_pipeline.pkl</strong>
                      </td>
                      <td>
                        Features Numéricas:
                        <br />
                        StandardScaler. <br />
                        Features Categóricas:
                        <br />
                        LabelEncoder + OneHotEncoder.
                      </td>
                      <td>Pipeline (Transformer + MLP)</td>
                      <td>GridSearchCV</td>
                      <td>94%</td>
                    </tr>
                    <tr>
                      <td>RF - Random Forest</td>
                      <td>07/04/2025</td>
                      <td>
                        <strong>rf_pipeline.pkl</strong>
                      </td>
                      <td>
                        Features Numéricas:
                        <br />
                        StandardScaler. <br />
                        Features Categóricas:
                        <br />
                        LabelEncoder + OneHotEncoder.
                      </td>
                      <td>Pipeline (Transformer + RF)</td>
                      <td>GridSearchCV</td>
                      <td>81%</td>
                    </tr>
                    <tr>
                      <td>Ensemble by Majority Voting</td>
                      <td>03/04/2025</td>
                      <td>
                        <strong>ensemble_model_1.pkl</strong>
                      </td>
                      <td>
                        Features Numéricas:
                        <br />
                        StandardScaler. <br />
                        Features Categóricas:
                        <br />
                        LabelEncoder.
                      </td>
                      <td>
                        MLP
                        <br />
                        RF
                        <br />
                        SVM
                      </td>
                      <td>
                        N/A
                        <br />
                        N/A
                        <br />
                        N/A
                      </td>
                      <td>49%</td>
                    </tr>
                  </tbody>
                </Table>

                <Card.Text className="text-muted mt-3">
                  A avaliação foi feita com base em métricas como{" "}
                  <strong>F1-Score</strong>, <strong>Accuracy</strong>,{" "}
                  <strong>Precision</strong> e <strong>Recall</strong>, com foco
                  no F1-Score.
                </Card.Text>
              </Card.Body>
            </Card>

            {/* Entidades Parceiras */}
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <Card.Title className="mb-4 titulo-card fw-bold">
                  Entidades Parceiras
                </Card.Title>
                <ul className="mb-0 text-muted">
                  <li>Universidade Lusófona do Porto (ULP)</li>
                  <li>Open University – Learning Analytics dataset</li>
                </ul>
              </Card.Body>
            </Card>

            {/* Repositório */}
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <Card.Title className="titulo-card fw-bold">
                  Repositório
                </Card.Title>
                <div className="mt-3 text-muted">
                  <p>MIT - License</p>
                  <p>
                    <a
                      href="https://github.com/amorimriki/Projeto-I-PSA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none github-link d-inline-flex align-items-center"
                    >
                      <FaGithub className="me-2" size={18} />
                      GitHub
                    </a>
                  </p>
                </div>
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
