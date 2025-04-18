import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Button,
  Table,
  Alert,
  Form,
  Row,
  Col,
  Spinner,
  Card,
  Dropdown,
  DropdownButton,
  FormCheck,
} from "react-bootstrap";
import Papa from "papaparse";
import CustomNavbar from "./CustomNavBar";
import CustomFooter from "./CustomFooter";

export default function CsvPredictionPage() {
  const [csvData, setCsvData] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [visibleColumns, setVisibleColumns] = useState([
    "n_student",
    "previsao",
  ]);
  const [sendRaw, setsendRaw] = useState(true);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);

    Papa.parse(uploadedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setCsvData(results.data);
        setError("");
      },
      error: (err) => {
        setError("Erro ao processar o ficheiro CSV.");
        console.error(err);
      },
    });
  };

  const handlePredict = async () => {
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        `http://localhost:8000/predict-file?encoded=${sendRaw.toString().toLowerCase()}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setPredictions(res.data);
      setVisibleColumns(["n_student", "previsao"]); // Aqui está a correção
    } catch (err) {
      setError("Erro ao obter previsões.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="d-flex flex-column min-vh-100">
        <main className="flex-grow-1">
          <CustomNavbar />

          <Container className="mt-5">
            <Card className="p-4 shadow rounded-4">
              <h2
                className="text-center mb-4"
                style={{ color: "var(--cor-primaria)" }}
              >
                Importar CSV para Previsão em Lote
              </h2>

              <Row className="justify-content-center">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: "var(--cor-primaria)" }}>
                      <strong>Selecionar Ficheiro CSV</strong>
                    </Form.Label>
                    <Form.Control
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="border-primary"
                      style={{ borderColor: "var(--cor-acento)" }}
                    />
                  </Form.Group>
                  {csvData.length > 0 && (
                    <Button
                      variant="success"
                      block="true"
                      onClick={handlePredict}
                      disabled={loading}
                      style={{
                        backgroundColor: "var(--cor-acento)",
                        borderColor: "var(--cor-acento)",
                      }}
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" /> A
                          processar...
                        </>
                      ) : (
                        "Fazer Previsões"
                      )}
                    </Button>
                  )}
                  <Form.Group className="d-flex align-items-center gap-2 mt-3">
                    <Form.Label
                      className="mb-0"
                      style={{ color: "var(--cor-primaria)" }}
                    >
                      Dados Raw
                    </Form.Label>
                    <Form.Switch
                      checked={sendRaw}
                      onChange={() => setsendRaw(!sendRaw)}
                      id="custom-switch-encoded-toggle"
                    />
                  </Form.Group>

                  {error && (
                    <Alert variant="danger" className="mt-3">
                      {error}
                    </Alert>
                  )}
                </Col>
              </Row>

              {predictions.length > 0 && (
                <>
                  <DropdownButton
                    id="dropdown-column-filter"
                    title="Selecionar Colunas"
                    className="mb-3 custom-dropdown-button"
                  >
                    {Object.keys(predictions[0]).map((key) => (
                      <Dropdown.Item
                        key={key}
                        as="div"
                        className="d-flex align-items-center"
                        style={{ color: "var(--cor-primaria)" }}
                      >
                        <FormCheck
                          type="checkbox"
                          label={key}
                          checked={visibleColumns.includes(key)}
                          onChange={() => {
                            setVisibleColumns((prev) =>
                              prev.includes(key)
                                ? prev.filter((col) => col !== key)
                                : [...prev, key]
                            );
                          }}
                        />
                      </Dropdown.Item>
                    ))}
                  </DropdownButton>

                  <h4 className="mt-5 text-center">Resultados das Previsões</h4>
                  <div className="table-responsive mt-3">
                    <Table
                      striped
                      bordered
                      hover
                      responsive="md"
                      className="shadow-sm rounded-4 overflow-hidden"
                      style={{
                        backgroundColor: "var(--cor-fundo-claro)",
                        minWidth: "100%",
                        borderColor: "var(--cor-primaria)",
                      }}
                    >
                      <thead
                        style={{
                          backgroundColor: "var(--cor-primaria)",
                          color: "var(--cor-texto-claro)",
                        }}
                      >
                        <tr>
                          {visibleColumns.map((key) => (
                            <th key={key} className="text-center">
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {predictions.map((row, index) => (
                          <tr key={index}>
                            {visibleColumns.map((key, i) => (
                              <td key={i} className="text-center align-middle">
                                {row[key]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </>
              )}
            </Card>
          </Container>
        </main>

        <footer>
          <CustomFooter />
        </footer>
      </div>
    </>
  );
}
