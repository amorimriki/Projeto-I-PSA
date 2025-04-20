import React, { useEffect, useState } from "react";
import { Container, Table, Card, Spinner } from "react-bootstrap";
import CustomNavbar from "./CustomNavBar";
import CustomFooter from "./CustomFooter";
import axios from "axios";

export default function PredictionHistoryPage() {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistorico() {
      try {
        const response = await axios.get("http://localhost:8000/historico");
        setHistorico(response.data);
      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchHistorico();
  }, []);

  return (
    <div className="page-wrapper d-flex flex-column min-vh-100">
      <CustomNavbar />

      <Container className="mt-4 mb-4 flex-grow-1">
        <Card className="p-4 shadow rounded-4">
          <h2 className="mb-4 text-center" style={{ color: "var(--cor-primaria)" }}>
            Histórico de Previsões
          </h2>

          {loading ? (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Data/Hora</th>
                  <th>Tipo de Pedido</th>
                  <th>Modelo</th>
                  <th>Nº de Registros</th>
                  <th>Resultado(s)</th>
                </tr>
              </thead>
              <tbody>
                {historico.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      Nenhuma previsão realizada ainda.
                    </td>
                  </tr>
                ) : (
                  historico.map((item, index) => (
                    <tr key={index}>
                      <td>{item.dataHora}</td>
                      <td>{item.tipo}</td>
                      <td>{item.modelo}</td>
                      <td>{item.total}</td>
                      <td>{item.resultado}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </Card>
      </Container>

      <footer>
        <CustomFooter />
      </footer>
    </div>
  );
}