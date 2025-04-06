import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";

export default function PredictForm() {
  const [inputs, setInputs] = useState({});
  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: parseFloat(e.target.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/predict", {
        features: Object.values(inputs),
      });
      setPrediction(response.data.prediction[0]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {/* Substituir por inputs reais conforme as features do teu modelo */}
      <Form.Group>
        <Form.Label>Feature 1</Form.Label>
        <Form.Control name="f1" type="number" onChange={handleChange} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Feature 2</Form.Label>
        <Form.Control name="f2" type="number" onChange={handleChange} />
      </Form.Group>
      {/* ... mais features ... */}

      <Button type="submit">Prever</Button>

      {prediction !== null && (
        <Alert variant="info" className="mt-3">
          Resultado da predição: {prediction}
        </Alert>
      )}
    </Form>
  );
}
