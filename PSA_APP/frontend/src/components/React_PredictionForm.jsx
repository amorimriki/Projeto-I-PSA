import React, { useState } from "react";
import axios from "axios";
import { Container, Button, Row, Col, Form, Card } from "react-bootstrap";
import "../App.css";
import CustomNavbar from "./CustomNavBar";
import CustomFooter from "./CustomFooter";
import ModelSelector from "./React_ModelSelector";

const initialFormState = {
  n_student: "",
  gender: "",
  region: "",
  highest_education: "",
  imd_band: "",
  age_band: "",
  disability: "",
  assessment_type: "",
  is_banked: "",
  delivery_date: "",
  due_date: "",
  date_submitted: 0,
  num_of_prev_attempts: 0,
  sum_click: 0,
  studied_credits: 0,
  weight: 0,
  score: 0,
};

const options = {
  code_module: ["AAA", "BBB", "CCC", "DDD", "EEE", "FFF", "GGG"],
  gender: ["M", "F"],
  region: [
    "East Anglian Region",
    "Scotland",
    "South East Region",
    "West Midlands Region",
    "Wales",
    "North Western Region",
    "North Region",
    "South Region",
    "Ireland",
    "South West Region",
    "East Midlands Region",
    "Yorkshire Region",
    "London Region",
  ],
  highest_education: [
    "HE Qualification",
    "A Level or Equivalent",
    "Lower Than A Level",
    "Post Graduate Qualification",
    "No Formal quals",
  ],
  imd_band: [
    "90-100%",
    "20-30%",
    "50-60%",
    "80-90%",
    "30-40%",
    "70-80%",
    "60-70%",
    "40-50%",
    "10-20",
    "0-10%",
  ],
  age_band: ["55<=", "35-55", "0-35"],
  disability: ["N", "Y"],
  assessment_type: ["TMA", "CMA", "Exam"],
  is_banked: [0, 1],
};

export default function PredictionForm() {
  const [modeloSelecionado, setModeloSelecionado] = useState();
  const [form, setForm] = useState(initialFormState);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };

    if (updatedForm.delivery_date && updatedForm.due_date) {
      const delivery = new Date(updatedForm.delivery_date);
      const due = new Date(updatedForm.due_date);
      const diffTime = due - delivery;
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      updatedForm.date_submitted = diffDays;
    }

    setForm(updatedForm);
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("modelo", modeloSelecionado);

      const response = await axios.post(
        "http://localhost:8000/predict-json",
        [form],
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const resultado = response.data?.[0];
      if (resultado && "previsao" in resultado) {
        setResult(
          `Estudante ${resultado.n_student} - Previsão: ${resultado.previsao}`
        );
      } else {
        setResult("Resposta inesperada do servidor.");
      }
    } catch (error) {
      console.error("Erro ao obter previsão:", error);
      setResult("Erro ao prever resultado.");
    }
  };

  return (
    <>
      <CustomNavbar />
      <Container className="mt-4 mb-4">
        <Card className="p-4 shadow rounded-4">
          <h2
            style={{ color: "var(--cor-primaria)" }}
            className="mb-4 text-center"
          >
            Prever Resultado Final
          </h2>
          <Form onSubmit={handlePredict}>
            <Row>
              {/* Campos especiais: data */}
              <Col md={6} className="mb-3">
                <Form.Group controlId="delivery_date">
                  <Form.Label>Data de Entrega </Form.Label>
                  <Form.Control
                    type="date"
                    name="delivery_date"
                    value={form.delivery_date}
                    onChange={handleDateChange}
                    required
                  />
                </Form.Group>
                <>
                  <Form.Text className="text-muted">
                    Diferença de dias: {form.date_submitted}
                  </Form.Text>
                </>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group controlId="due_date">
                  <Form.Label>Data Limite de Entrega</Form.Label>
                  <Form.Control
                    type="date"
                    name="due_date"
                    value={form.due_date}
                    onChange={handleDateChange}
                    required
                  />
                </Form.Group>
              </Col>

              {/* Os restantes campos */}
              {Object.entries(initialFormState).map(([key, val]) => {
                if (
                  ["delivery_date", "due_date", "date_submitted"].includes(key)
                )
                  return null;

                return (
                  <Col md={6} className="mb-3" key={key}>
                    <Form.Group controlId={key}>
                      <Form.Label className="text-capitalize">
                        {key.replace(/_/g, " ")}
                      </Form.Label>
                      {options[key] ? (
                        <Form.Select
                          name={key}
                          value={form[key]}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Selecionar...</option>
                          {options[key].map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </Form.Select>
                      ) : key === "score" || key === "weight" ? (
                        <>
                          <Form.Range
                            name={key}
                            value={form[key]}
                            min={0}
                            max={100}
                            step={1}
                            onChange={handleChange}
                          />
                          <Form.Text className="text-muted">
                            Valor atual: {form[key]}
                          </Form.Text>
                        </>
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
                );
              })}
            </Row>
            <div className="d-flex flex-column align-items-center">
              <p className="fw-bold">Seleciona o modelo de previsão:</p>
              <ModelSelector
                modeloSelecionado={modeloSelecionado}
                setModeloSelecionado={setModeloSelecionado}
              />
              <p className="text-muted">
                Modelo atual: <strong>{modeloSelecionado}</strong>
              </p>
            </div>

            <div className="text-center">
              <Button
                variant="primary"
                type="submit"
                className="mt-2 px-4"
                style={{
                  backgroundColor: "var(--cor-acento)",
                  borderColor: "var(--cor-acento)",
                }}
              >
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
