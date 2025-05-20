import React, { useEffect, useState } from "react";
import { Container, Table, Card, Spinner, Row, Col } from "react-bootstrap";
import CustomNavbar from "../components/CustomNavBar";
import CustomFooter from "../components/CustomFooter";
import "../App.css";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
ChartJS.register();

export default function PredictionHistoryPage() {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detalhes, setDetalhes] = useState([]);

  const [predictionData, setPredictionData] = useState({
    passCount: 0,
    failCount: 0,
    scoreData: [],
    meanScores: { Pass: 0, Fail: 0 },
    categoricalDistributions: {},
  });

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

  const processPredictionData = (data) => {
    const passData = data.filter((item) => item.previsao === "Pass");
    const failData = data.filter((item) => item.previsao === "Fail");

    const passCount = passData.length;
    const failCount = failData.length;

    const scoreData = data.map((item) => item.score);
    const meanScores = {
      Pass: +(
        passData.reduce((acc, cur) => acc + cur.score, 0) / passCount || 0
      ).toFixed(2),
      Fail: +(
        failData.reduce((acc, cur) => acc + cur.score, 0) / failCount || 0
      ).toFixed(2),
    };

    const categoricalFields = [
      "gender",
      "age_band",
      "disability",
      "highest_education",
      "region",
    ];
    const distributions = {};

    categoricalFields.forEach((field) => {
      const passGroups = {};
      const failGroups = {};

      passData.forEach((item) => {
        passGroups[item[field]] = (passGroups[item[field]] || 0) + 1;
      });

      failData.forEach((item) => {
        failGroups[item[field]] = (failGroups[item[field]] || 0) + 1;
      });

      const allKeys = Array.from(
        new Set([...Object.keys(passGroups), ...Object.keys(failGroups)])
      );
      distributions[field] = {
        labels: allKeys,
        passCounts: allKeys.map((k) => passGroups[k] || 0),
        failCounts: allKeys.map((k) => failGroups[k] || 0),
      };
    });

    setPredictionData({
      passCount,
      failCount,
      scoreData,
      meanScores,
      categoricalDistributions: distributions,
    });
  };

  const handleShowDetails = async (identificador) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/historico/timestamp/${identificador}`
      );
      setDetalhes(response.data);
      processPredictionData(response.data);
    } catch (error) {
      console.error("Erro ao buscar detalhes:", error);
    }
  };

  const exportToCSV = () => {
    if (detalhes.length === 0) return;

    const csvHeader = Object.keys(detalhes[0]).join(",") + "\n";
    const csvRows = detalhes
      .map((row) => Object.values(row).join(","))
      .join("\n");

    const blob = new Blob([csvHeader + csvRows], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "relatorio_previsao.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

 const handlePrint = () => {
  const originalContent = document.getElementById("relatorio-completo");
  const clone = originalContent.cloneNode(true);

  const originalCanvases = originalContent.querySelectorAll("canvas");
  const clonedCanvases = clone.querySelectorAll("canvas");

  originalCanvases.forEach((canvas, index) => {
    const image = new Image();
    image.src = canvas.toDataURL(); // converte canvas em imagem
    image.style.maxWidth = "100%";
    image.style.marginBottom = "20px";
    clonedCanvases[index].replaceWith(image);
  });

  const style = `
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 20px;
        color: #212529;
      }
      h3, h5 {
        text-align: center;
        color: #0056b3;
        margin-bottom: 20px;
      }
      img {
        display: block;
        margin: 0 auto 40px auto;
        max-width: 0%;
        page-break-inside: avoid;
      }
      .no-print {
        display: none !important;
      }
    </style>
  `;

  const win = window.open("", "_blank");
  win.document.write("<html><head><title>Relatório de Previsão</title>");
  win.document.write(
    `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">`
  );
  win.document.write(style);
  win.document.write("</head><body>");
  win.document.write(clone.innerHTML);
  win.document.write("</body></html>");
  win.document.close();

  setTimeout(() => {
    win.focus();
    win.print();
    win.close();
  }, 1000);
};

  const estilo = getComputedStyle(document.documentElement);
  const corPrimaria = estilo.getPropertyValue("--cor-primaria").trim();
  const corAcento = estilo.getPropertyValue("--cor-acento").trim();

  const pieChartData = {
    labels: ["Pass", "Fail"],
    datasets: [
      {
        data: [predictionData.passCount, predictionData.failCount],
        backgroundColor: [corAcento, corPrimaria],
      },
    ],
  };

  const scoreBarChartData = {
    labels: ["Pass", "Fail"],
    datasets: [
      {
        label: "Score Médio",
        data: [predictionData.meanScores.Pass, predictionData.meanScores.Fail],
        backgroundColor: [corAcento, corPrimaria],
      },
    ],
  };

  const renderCategoryCharts = () => {
    return Object.entries(predictionData.categoricalDistributions).map(
      ([key, dist]) => {
        const chartData = {
          labels: dist.labels,
          datasets: [
            {
              label: "Pass",
              data: dist.passCounts,
              backgroundColor: corAcento,
            },
            {
              label: "Fail",
              data: dist.failCounts,
              backgroundColor: corPrimaria,
            },
          ],
        };

        return (
          <div key={key} className="mb-5 chart-container">
            <h5 className="text-center" style={{ textTransform: "capitalize" }}>
              {key}
            </h5>
            <Bar data={chartData} options={{ responsive: true }} />
          </div>
        );
      }
    );
  };

  return (
    <div className="bg-light page-wrapper d-flex flex-column min-vh-100">
      <CustomNavbar />
      <section className="hero bg-primary text-white text-center py-5">
        <h1>Relatório Geral</h1>
        <p className="lead">Visualização do desempenho de grupos.</p>
      </section>
      <Container className="py-5">
        <Row>
          <Col md={4}>
            <Card className="p-4 shadow rounded-4 mb-4">
              <h2
                className="mb-4 text-center"
                style={{ color: "var(--cor-primaria)" }}
              >
                Previsões Guardadas
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
                      <th>Modelo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historico.length === 0 ? (
                      <tr>
                        <td colSpan="2" className="text-center">
                          Nenhuma previsão realizada ainda.
                        </td>
                      </tr>
                    ) : (
                      historico
                        .filter((item) => item.tipo === "ficheiro")
                        .map((item) => (
                          <tr
                            key={item.dataHora}
                            onClick={() => handleShowDetails(item.dataHora)}
                            style={{ cursor: "pointer" }}
                          >
                            <td>{item.dataHora}</td>
                            <td>{item.modelo}</td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </Table>
              )}
              <h5 className="text-center">Previsão</h5>
              <Pie data={pieChartData} options={{ responsive: true }} />
            </Card>
          </Col>

         <Col md={8}>
  {detalhes.length > 0 && (
    <div id="relatorio-completo">
      <Card className="shadow rounded-4 p-4" id="relatorio-analise">
        <h3 className="text-center" style={{ color: "var(--cor-primaria)" }}>
          Relatório de Previsão
        </h3>
        <p className="text-center">Análise detalhada dos resultados previstos</p>

        <div className="d-flex justify-content-end gap-2 mt-2 mb-3 no-print">
          <button className="btn btn-outline-primary" onClick={exportToCSV}>
            Exportar CSV
          </button>
          <button className="btn btn-outline-secondary" onClick={handlePrint}>
            Imprimir Relatório
          </button>
        </div>

        <div className="mt-4">
          <h5 className="text-center mt-4">Score Médio</h5>
          <Bar data={scoreBarChartData} options={{ responsive: true }} />
          <div className="mt-5">{renderCategoryCharts()}</div>
        </div>
      </Card>
    </div>
  )}
</Col>

        </Row>
      </Container>
      <footer>
        <CustomFooter />
      </footer>
    </div>
  );
}
