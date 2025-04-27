import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Card,
  Spinner,
  Modal,
  Button,
} from "react-bootstrap";
import { FaTrash } from "react-icons/fa"; // Importando o ícone da lata de lixo
import CustomNavbar from "../components/CustomNavBar";
import CustomFooter from "../components/CustomFooter";
import axios from "axios";

export default function PredictionHistoryPage() {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [modalIndex, setModalIndex] = useState(null); // Para armazenar o índice do histórico no modal

  // Função para buscar o histórico
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

  // Exibir detalhes do item
  const handleShowDetails = async (index) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/historico/${index}`
      );
      setModalData(response.data);
      setModalIndex(index); // Armazenar o índice do item
      setShowModal(true);
    } catch (error) {
      console.error("Erro ao buscar detalhes:", error);
    }
  };

  // Fechar o modal
  const handleClose = () => setShowModal(false);

  // Função para excluir todo o histórico
  const handleClearHistory = async () => {
    try {
      await axios.delete("http://localhost:8000/historico"); // Endpoint para limpar todo o histórico
      setHistorico([]);
    } catch (error) {
      console.error("Erro ao limpar o histórico:", error);
    }
  };

  // Função para excluir o item específico do histórico
  const handleClearItem = async () => {
    try {
      if (modalIndex !== null) {
        await axios.delete(`http://localhost:8000/historico/${modalIndex}`); // Endpoint para excluir o item específico
        setHistorico(historico.filter((_, index) => index !== modalIndex)); // Remover o item da lista
        setShowModal(false); // Fechar o modal após excluir
      }
    } catch (error) {
      console.error("Erro ao excluir o pedido:", error);
    }
  };

  return (
    <div className="bg-light page-wrapper d-flex flex-column min-vh-100">
      <CustomNavbar />
      {/* Hero Section */}
      <section className="hero bg-primary text-white text-center py-5">
        <h1>Resultados</h1>
        <p className="lead">
          Visualização do registo dos resultados das previsões feitas
          anteriormente.
        </p>
      </section>
      <Container className="mt-4 mb-4 flex-grow-1">
        <Card className="p-4 shadow rounded-4">
          <h2
            className="mb-4 text-center"
            style={{ color: "var(--cor-primaria)" }}
          >
            Histórico de Previsões
          </h2>

          {loading ? (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <>
              <Button
                variant="danger"
                onClick={handleClearHistory}
                className="mb-3 "
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
                Limpar Todo o Histórico
              </Button>
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
