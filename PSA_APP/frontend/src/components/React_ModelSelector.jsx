import React from "react";
import { Form, Col } from "react-bootstrap";

export default function ModeloSelector({
  modeloSelecionado,
  setModeloSelecionado,
}) {
  return (
    <Form className="mb-3">
      <div className="d-flex gap-4 flex-wrap" style={{ display: 'flex', justifyContent: 'center' }}>
        <Col>
        <Form.Check
          type="radio"
          id="modelo-ensamble1"
          label="Ensamble V1"
          name="tipo-modelo"
          value="ensamble_model_1"
          checked={modeloSelecionado === "ensamble_model_1"}
          onChange={(e) => setModeloSelecionado(e.target.value)}
          className="radio-estilo"
          style={{  }}
        />
        <Form.Check
          type="radio"
          id="modelo-ensamble2"
          label="Ensamble V2"
          name="tipo-modelo"
          value="ensamble_model_2"
          checked={modeloSelecionado === "ensamble_model_2"}
          onChange={(e) => setModeloSelecionado(e.target.value)}
          className="radio-estilo"
        />
       </Col>
       <Col>
        <Form.Check
          type="radio"
          id="modelo-rf"
          label="Random Forest"
          name="tipo-modelo"
          value="rf_model"
          checked={modeloSelecionado === "rf_model"}
          onChange={(e) => setModeloSelecionado(e.target.value)}
          className="radio-estilo"
        />
        <Form.Check
          type="radio"
          id="modelo-rede"
          label="Rede Neural"
          name="tipo-modelo"
          value="mlp_model"
          checked={modeloSelecionado === "mlp_model"}
          onChange={(e) => setModeloSelecionado(e.target.value)}
          className="radio-estilo"
        />
        <Form.Check
          type="radio"
          id="modelo-svm"
          label="SVM"
          name="tipo-modelo"
          value="svm_model"
          checked={modeloSelecionado === "svm_model"}
          onChange={(e) => setModeloSelecionado(e.target.value)}
          className="radio-estilo"
        />
        </Col>
      </div>
    </Form>
  );
}
