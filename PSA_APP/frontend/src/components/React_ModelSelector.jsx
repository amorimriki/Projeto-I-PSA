import React from "react";
import { Form } from "react-bootstrap";

export default function ModeloSelector({ modeloSelecionado, setModeloSelecionado }) {
  return (
    <Form className="mb-3">
      <div className="d-flex gap-4 flex-wrap">
        <Form.Check
          type="radio"
          id="modelo-ensamble"
          label="Ensamble"
          name="tipo-modelo"
          value="ensamble_model"
          checked={modeloSelecionado === "ensamble_model"}
          onChange={(e) => setModeloSelecionado(e.target.value)}
          className="radio-estilo"
        />
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
      </div>
    </Form>
  );
}
