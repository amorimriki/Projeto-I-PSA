import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import axios from 'axios';

const PredictForm = () => {
  const [formData, setFormData] = useState({
    code_module: "",
    gender: "",
    region: "",
    highest_education: "",
    imd_band: "",
    age_band: "",
    disability: "",
    assessment_type: "",
    final_result: "",
    is_banked: "",
    date_submitted: 0,
    num_of_prev_attempts: 0,
    sum_click: 0,
    date: 0,
    studied_credits: 0,
    weight: 0,
    score: 0
  });

  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post("http://localhost:5000/predict", formData);
    setPrediction(res.data.prediction);
  };

  return (
    <Container className="p-4">
      <h2>Previsão de Resultado</h2>
      <Form onSubmit={handleSubmit}>
        {/* Adicionar campos para cada input (exemplo abaixo) */}
        <Form.Group>
          <Form.Label>Género</Form.Label>
          <Form.Control
            as="select"
            name="gender"
            onChange={handleChange}
            required
          >
            <option value="">Selecione</option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </Form.Control>
        </Form.Group>

        {/* Repetir para as outras features... */}

        <Button type="submit" className="mt-3">Prever</Button>
      </Form>

      {prediction && (
        <Alert variant="info" className="mt-3">
          Previsão: <strong>{prediction}</strong>
        </Alert>
      )}
    </Container>
  );
};

export default PredictForm;
