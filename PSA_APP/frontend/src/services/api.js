import axios from "axios";

// Base URL da API
const API_URL = "http://localhost:8000";

// Enviar JSON para a rota FastAPI
export const predictJson = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/predict-json`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro na requisição JSON:", error);
    throw error; // Repassa o erro para ser tratado na interface
  }
};

// Enviar ficheiro CSV para FastAPI
export const predictFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${API_URL}/predict-file`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro na requisição de ficheiro:", error);
    throw error;
  }
};
