import React, { useState } from 'react';
import axios from 'axios';
import { Container, Button, Table, Alert, Form, Row, Col, Spinner, Card } from 'react-bootstrap';
import Papa from 'papaparse';
import CustomNavbar from './CustomNavBar';
import CustomFooter from './CustomFooter';

export default function CsvPredictionPage() {
  const [csvData, setCsvData] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setCsvData(results.data);
        setError('');
      },
      error: (err) => {
        setError('Erro ao processar o ficheiro CSV.');
        console.error(err);
      },
    });
  };

  const handlePredict = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/predict", { data: csvData });
      setPredictions(res.data);
    } catch (err) {
      setError('Erro ao obter previsões.');
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
        <Row>
          <Col md={6} className="mx-auto">
            <h2 className="text-center mb-4" style={{ color: 'var(--cor-primaria)' }}>Importar CSV para Previsão em Lote</h2>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: 'var(--cor-primaria)' }}><strong>Selecionar Ficheiro CSV</strong></Form.Label>
              <Form.Control 
                type="file" 
                accept=".csv" 
                onChange={handleFileUpload} 
                className="border-primary" 
                style={{ borderColor: 'var(--cor-acento)' }}
              />
            </Form.Group>

            {csvData.length > 0 && (
              <Button 
                variant="success" 
                block 
                onClick={handlePredict} 
                disabled={loading}
                style={{ backgroundColor: 'var(--cor-acento)', borderColor: 'var(--cor-acento)' }}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" /> A processar...
                  </>
                ) : (
                  'Fazer Previsões'
                )}
              </Button>
            )}

            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

            {predictions.length > 0 && (
              <>
                <h4 className="mt-4 text-center" style={{ color: 'var(--cor-primaria)' }}>Resultados das Previsões</h4>
                <Table striped bordered hover responsive className="mt-3" style={{ backgroundColor: 'var(--cor-fundo-claro)' }}>
                  <thead style={{ backgroundColor: 'var(--cor-primaria)', color: 'var(--cor-texto-claro)' }}>
                    <tr>
                      {Object.keys(csvData[0]).map((key) => (
                        <th key={key}>{key}</th>
                      ))}
                      <th>Previsão</th>
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value, i) => (
                          <td key={i}>{value}</td>
                        ))}
                        <td><strong>{predictions[index]?.previsao || "Sem previsão"}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            )}
          </Col>
        </Row>
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
