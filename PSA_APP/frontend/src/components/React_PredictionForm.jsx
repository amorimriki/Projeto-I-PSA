import React, { useState } from 'react';
import axios from 'axios';
import { Container, Button, Row, Col, Card, Carousel, Navbar, Nav } from 'react-bootstrap';
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
      {/* NavBar */}
      <CustomNavbar />
      <Container className="mt-4">
        <h2>Prever Resultado Final</h2>
        <form onSubmit={handleSubmit}>
          {Object.keys(initialFormState).map((key) => (
            <div className="mb-3" key={key}>
              <label className="form-label">{key}</label>
              <input
                type="text"
                className="form-control"
                name={key}
                value={form[key]}
                onChange={handleChange}
              />
            </div>
          ))}
          <Button variant="primary" type="submit">Prever</Button>

        </form>
        {result && <div className="alert alert-info mt-3">Resultado Previsto: {result}</div>}
      </Container>
      
      <Container fluid className="mt-3">
        
          {/* Footer */}
        <CustomFooter />
     
      </Container>
      
    </>
  );
}
