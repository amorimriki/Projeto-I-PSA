import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Card,
  Spinner,
  Row,
  Col,
  Form,
  Button,
} from "react-bootstrap";
import CustomNavbar from "../components/CustomNavBar";
import CustomFooter from "../components/CustomFooter";
import "../App.css";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { Tooltip } from "chart.js";

ChartJS.register(Tooltip);

export default function StudentProgressPage() {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [studentRecords, setStudentRecords] = useState([]);
  const [filterType, setFilterType] = useState(""); // Tipo de avaliação
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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

  const handleStudentSearch = async () => {
    const allRecords = [];
    const filteredHistorico = historico.filter((entry) => {
      const entryDate = new Date(
        entry.dataHora.replace("_", " ").replace(/-/g, ":")
      );
      const validStartDate = startDate
        ? entryDate >= new Date(startDate)
        : true;
      const validEndDate = endDate ? entryDate <= new Date(endDate) : true;
      return validStartDate && validEndDate;
    });

    for (let index = 0; index < filteredHistorico.length; index++) {
      try {
        const entry = filteredHistorico[index];

        // Buscar os dados do histórico detalhado (usando o índice)
        const response = await axios.get(
          `http://localhost:8000/historico/${index}`
        );
        const dados = response.data;

        // Filtrar os dados pelo número do aluno e tipo de avaliação
        const matches = dados.filter(
          (item) =>
            item.n_student.toString() === selectedStudent &&
            (filterType ? item.assessment_type === filterType : true)
        );

        matches.forEach((match) => {
          allRecords.push({
            dataHora: entry.dataHora,
            assessment_type: match.assessment_type,
            previsao: match.previsao,
            score: match.score,
          });
        });
      } catch (error) {
        console.error(
          `Erro ao buscar detalhes do histórico (index ${index}):`,
          error
        );
      }
    }

    allRecords.sort((a, b) => a.dataHora.localeCompare(b.dataHora)); // Ordenar por data
    setStudentRecords(allRecords);
  };

  const lineChartData = {
    labels: studentRecords.map((record) => formatDateTime(record.dataHora)),
    datasets: [
      {
        label: "Score",
        data: studentRecords.map((record) => record.score),
        borderColor: studentRecords.map((record) =>
          record.previsao === "Pass" ? "#28a745" : "#dc3545"
        ),
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        tension: 0.3,
        pointBackgroundColor: studentRecords.map((record) =>
          record.previsao === "Pass" ? "#28a745" : "#dc3545"
        ),
        pointBorderColor: "white",
        pointRadius: 5,
      },
    ],
  };

  function formatDateTime(dateTimeString) {
    if (!dateTimeString) return "";

    // Corrigir o formato: trocar _ por espaço e - por : na hora
    const correctedString = dateTimeString.replace("_", " ");
    console.log("String corrigida:", correctedString); // Verificar se a correção está funcionando

    // Separar a data e a hora
    const [datePart, timePart] = correctedString.split(" ");
    console.log("Data:", datePart); // Verificar se a data está separada corretamente
    console.log("Hora:", timePart); // Verificar se a hora está separada corretamente

    const adjustedTimePart = timePart.slice(0, -7);
    console.log("Hora ajustada (últimos 7 caracteres removidos):", adjustedTimePart);

    // Reconstruir a string tipo "2025-04-22T01:53:52"
    const properDateTime = `${datePart}T${adjustedTimePart.replace(/-/g, ":")}`;
    console.log("Data final para conversão:", properDateTime); // Verificar a string formatada para a conversão

    const date = new Date(properDateTime);
    console.log("Objeto Date criado:", date); // Verificar o objeto Date criado

    if (isNaN(date)) {
      console.error("Data inválida:", dateTimeString); // Se a data for inválida
      return dateTimeString; // Se der erro, mostra o original
    }

    // Formatar a data para o formato desejado
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
    console.log("Data formatada:", formattedDate); // Verificar a data final formatada

    return formattedDate;
  }

  return (
    <div className="bg-light page-wrapper d-flex flex-column min-vh-100">
      <CustomNavbar />

      <section className="hero bg-primary text-white text-center py-5">
        <h1>Progresso Individual</h1>
        <p className="lead">
          Acompanhe o progresso individual ao longo do tempo e receba alertas de
          possíveis riscos académicos.
        </p>
      </section>

      <Container className="my-5">
        <Row className="mb-4">
          <Col md={8} className="mx-auto">
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Número do Aluno"
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
              />
              <button className="btn btn-primary" onClick={handleStudentSearch}>
                Procurar
              </button>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <Form.Select
                aria-label="Tipo de Avaliação"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">Selecione Tipo de Avaliação</option>
                <option value="TMA">TMA</option>
                <option value="CMA">CMA</option>
                <option value="Exam">Exam</option>
              </Form.Select>
              <div className="d-flex">
                <input
                  type="date"
                  className="form-control me-2"
                  placeholder="Início"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                  type="date"
                  className="form-control"
                  placeholder="Fim"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={handleStudentSearch}
              className="w-100"
            >
              Aplicar Filtros
            </Button>
          </Col>
        </Row>

        {loading ? (
          <Spinner animation="border" variant="primary" />
        ) : (
          studentRecords.length > 0 && (
            <>
              <Card className="p-3 mb-4">
                <h5 className="text-center mb-3">Registos do Aluno</h5>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Data Hora</th>
                      <th>Tipo de Avaliação</th>
                      <th>Previsão</th>
                      <th>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentRecords.map((record, idx) => (
                      <tr key={idx}>
                        <td>{formatDateTime(record.dataHora)}</td>
                        <td>{record.assessment_type}</td>
                        <td>{record.previsao}</td>
                        <td>{record.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card>

              <Card className="p-3">
                <h5 className="text-center mb-3">Evolução do Score</h5>
                <Line data={lineChartData} options={{ responsive: true }} />
              </Card>
            </>
          )
        )}
      </Container>

      <footer>
        <CustomFooter />
      </footer>
    </div>
  );
}
