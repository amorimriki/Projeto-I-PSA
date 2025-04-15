import axios from "axios";

// Para enviar JSON para a rota FastAPI
export const predictJson = async (data) => {
  const response = await axios.post(
    "http://localhost:8000/predict-json",
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Para enviar ficheiro CSV para FastAPI
export const predictFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    "http://localhost:8000/predict-file",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
