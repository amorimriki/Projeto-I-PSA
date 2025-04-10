import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import axios from 'axios';

function App() {
  const [formData, setFormData] = useState({
    idade: '',
    horasEstudo: '',
    interacoes: ''
  });
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);
    setResultado(null);

    try {
      const response = await axios.post('http://localhost:8000/predict', formData);
      setResultado(response.data.resultado); // ajusta consoante o nome da chave
    } catch (error) {
      setErro("Erro ao comunicar com o modelo.");
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-4 text-center">Previsão de Sucesso Académico</Card.Title>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Idade</Form.Label>
                  <Form.Control
                    type="number"
                    name="idade"
                    value={formData.idade}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Horas de Estudo por Semana</Form.Label>
                  <Form.Control
                    type="number"
                    name="horasEstudo"
                    value={formData.horasEstudo}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Número de Interações na Plataforma</Form.Label>
                  <Form.Control
                    type="number"
                    name="interacoes"
                    value={formData.interacoes}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button variant="primary" type="submit">
                    Prever Resultado
                  </Button>
                </div>
              </Form>

              {resultado && (
                <Alert variant="success" className="mt-4 text-center">
                  Previsão: <strong>{resultado}</strong>
                </Alert>
              )}

              {erro && (
                <Alert variant="danger" className="mt-4 text-center">
                  {erro}
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App;

