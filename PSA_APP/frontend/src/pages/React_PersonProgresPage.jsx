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

  // Cores do CSS
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
          <div key={key} className="mb-5">
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
    <div className="page-wrapper d-flex flex-column min-vh-100">
      <CustomNavbar />
      {/* Hero Section */}
      <section className="hero bg-primary text-white text-center py-5">
        <h1>Progresso Individual</h1>
        <p className="lead">
          Acompanhe o progresso individual ao longo do tempo e receba alertas de
          possíveis riscos académicos.
        </p>
      </section>

      <footer>
        <CustomFooter />
      </footer>
    </div>
  );
}
