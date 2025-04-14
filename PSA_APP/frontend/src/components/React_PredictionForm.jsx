import React, { useState } from 'react';
import axios from 'axios';
import { Container, Button, Row, Col, Form, Card } from 'react-bootstrap';
import '../App.css';
import CustomNavbar from './CustomNavBar';
import CustomFooter from './CustomFooter';

const initialFormState = {
  code_module: '',
  gender: '',
  region: '',
  highest_education: '',
  imd_band: '',
  age_band: '',
  disability: '',
  assessment_type: '',
  is_banked: '',
  date_submitted: 0,
  num_of_prev_attempts: 0,
  sum_click: 0,
  date: 0,
  studied_credits: 0,
  weight: 0,
  score: 0,
};

const options = {
  code_module: ['AAA', 'BBB', 'CCC', 'DDD', 'EEE', 'FFF', 'GGG'],
  gender: ['M', 'F'],
  region: [
    'East Anglian Region', 'Scotland', 'South East Region', 'West Midlands Region',
    'Wales', 'North Western Region', 'North Region', 'South Region', 'Ireland',
    'South West Region', 'East Midlands Region', 'Yorkshire Region', 'London Region'
  ],
  highest_education: ['HE Qualification', 'A Level or Equivalent', 'Lower Than A Level', 'Post Graduate Qualification', 'No Formal quals'],
  imd_band: ['90-100%', '20-30%', '50-60%', '80-90%', '30-40%', '70-80%', '60-70%', '40-50%', '10-20', '0-10%'],
  age_band: ['55<=', '35-55', '0-35'],
  disability: ['N', 'Y'],
  assessment_type: ['TMA', 'CMA', 'Exam'],
  is_banked: [0, 1]
};

export default function PredictionForm() {
  const [form, setForm] = useState(initialFormState);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/predict", form);
      setResult(res.data.prediction);
    } catch (err) {
      alert("Erro na previsão");
      console.error(err);
    }
  };

  return (
    <>
      <CustomNavbar />
      <Container className="mt-4 mb-4">
        <Card className="p-4 shadow rounded-4">
          <h2 className="mb-4 text-center">Prever Resultado Final</h2>
          <Form onSubmit={handleSubmit}>
            <Row>
              {Object.entries(initialFormState).map(([key, val]) => (
                <Col md={6} className="mb-3" key={key}>
                  <Form.Group controlId={key}>
                    <Form.Label className="text-capitalize">{key.replace(/_/g, ' ')}</Form.Label>
                    {options[key] ? (
                      <Form.Select
                        name={key}
                        value={form[key]}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Selecionar...</option>
                        {options[key].map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </Form.Select>
                    ) : (
                      <Form.Control
                        type="number"
                        name={key}
                        value={form[key]}
                        onChange={handleChange}
                        required
                      />
                    )}
                  </Form.Group>
                </Col>
              ))}
            </Row>
            <div className="text-center">
              <Button variant="primary" type="submit" className="mt-2 px-4">
                Prever
              </Button>
            </div>
          </Form>
          {result && (
            <div className="alert alert-info mt-4 text-center">
              <strong>Resultado Previsto:</strong> {result}
            </div>
          )}
        </Card>
      </Container>
      <footer>
      <CustomFooter />
  </footer>
    </>
  );
}
