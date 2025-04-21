import React, { useEffect, useState } from "react";
import { Container, Table, Card, Spinner, Modal, Button } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import CustomNavbar from "./CustomNavBar";
import CustomFooter from "./CustomFooter";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export default function PredictionHistoryPage() {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [modalIndex, setModalIndex] = useState(null);

  const [predictionData, setPredictionData] = useState({
    passCount: 0,
    failCount: 0,
    scoreData: [],
  });

  useEffect(() => {
    async function fetchHistorico() {
      try {
        const response = await axios.get("http://localhost:8000/historico");
        setHistorico(response.data);
        processPredictionData(response.data);
      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchHistorico();
  }, []);

  // Função para processar os dados do histórico
  const processPredictionData = (data) => {
    const passCount = data.filter((item) => item.resultado === "Pass").length;
    const failCount = data.filter((item) => item.resultado === "Fail").length;

    const scoreData = data.map((item) => item.score); // Extrair scores dos dados

    setPredictionData({
      passCount,
      failCount,
      scoreData,
    });
  };

  const handleShowDetails = async (index) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/historico/${index}`
      );
      setModalData(response.data);
      setModalIndex(index);
      setShowModal(true);
    } catch (error) {
      console.error("Erro ao buscar detalhes:", error);
    }
  };

  const handleClose = () => setShowModal(false);

  const handleClearHistory = async () => {
    try {
      await axios.delete("http://localhost:8000/historico");
      setHistorico([]);
    } catch (error) {
      console.error("Erro ao limpar o histórico:", error);
    }
  };

  const handleClearItem = async () => {
    try {
      if (modalIndex !== null) {
        await axios.delete(`http://localhost:8000/historico/${modalIndex}`);
        setHistorico(historico.filter((_, index) => index !== modalIndex));
        setShowModal(false);
      }
    } catch (error) {
      console.error("Erro ao excluir o pedido:", error);
    }
  };

  // Gráficos para EDA
  const barChartData = {
    labels: ["Pass", "Fail"],
    datasets: [
      {
        label: "Número de Previsões",
        data: [predictionData.passCount, predictionData.failCount],
        backgroundColor: ["#4caf50", "#f44336"],
      },
    ],
  };

  const pieChartData = {
    labels: ["Pass", "Fail"],
    datasets: [
      {
        data: [predictionData.passCount, predictionData.failCount],
        backgroundColor: ["#4caf50", "#f44336"],
      },
    ],
  };

  const scoreChartData = {
    labels: predictionData.scoreData.map((_, idx) => `Registro ${idx + 1}`),
    datasets: [
      {
        label: "Score",
        data: predictionData.scoreData,
        borderColor: "#2196f3",
        backgroundColor: "rgba(33, 150, 243, 0.2)",
        fill: true,
      },
    ],
  };

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
            <>
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
                      <tr
                        key={index}
                        onClick={() => handleShowDetails(index)}
                        style={{ cursor: "pointer" }}
                      >
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
            </>
          )}
        </Card>

        <Card className="mt-4 shadow rounded-4 p-4">
          <h3 className="text-center" style={{ color: "var(--cor-primaria)" }}>
            Análise de Dados
          </h3>

          <div className="mt-4">
            <Bar data={barChartData} options={{ responsive: true }} />
          </div>

          <div className="mt-4">
            <Pie data={pieChartData} options={{ responsive: true }} />
          </div>

          <div className="mt-4">
            <h4>Distribuição dos Scores</h4>
            <Bar data={scoreChartData} options={{ responsive: true }} />
          </div>
        </Card>
      </Container>

      <Modal
        show={showModal}
        onHide={handleClose}
        centered
        className="custom-modal"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Detalhes da Previsão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button
            variant="danger"
            onClick={handleClearItem}
            className="mb-3"
            style={{
              display: "flex",
              alignItems: "center",
              padding: "4px 8px",
              fontSize: "14px",
              height: "30px",
              marginLeft: "auto",
            }}
          >
            <FaTrash style={{ marginRight: "4px", fontSize: "14px" }} />
            Eliminar
          </Button>
          <div className="table-responsive">
            <table className="scrollable-table table table-bordered table-striped table-hover small-table-text">
              <thead>
                <tr>
                  <th>n_student</th>
                  <th>Previsão</th>
                  <th>Score</th>
                  <th>Code Module</th>
                  <th>Gender</th>
                  <th>Region</th>
                  <th>Highest Education</th>
                  <th>IMD Band</th>
                  <th>Age Band</th>
                  <th>Num of Prev Attempts</th>
                  <th>Studied Credits</th>
                  <th>Disability</th>
                  <th>Date Submitted</th>
                  <th>Is Banked</th>
                  <th>Assessment Type</th>
                  <th>Date</th>
                  <th>Weight</th>
                  <th>Sum Click</th>
                </tr>
              </thead>
              <tbody>
                {modalData.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.n_student}</td>
                    <td>{item.previsao}</td>
                    <td>{item.score}</td>
                    <td>{item.code_module}</td>
                    <td>{item.gender}</td>
                    <td>{item.region}</td>
                    <td>{item.highest_education}</td>
                    <td>{item.imd_band}</td>
                    <td>{item.age_band}</td>
                    <td>{item.num_of_prev_attempts}</td>
                    <td>{item.studied_credits}</td>
                    <td>{item.disability}</td>
                    <td>{item.date_submitted}</td>
                    <td>{item.is_banked}</td>
                    <td>{item.assessment_type}</td>
                    <td>{item.date}</td>
                    <td>{item.weight}</td>
                    <td>{item.sum_click}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal.Body>
      </Modal>

      <footer>
        <CustomFooter />
      </footer>
    </div>
  );
}
