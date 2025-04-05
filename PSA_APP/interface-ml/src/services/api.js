import axios from 'axios';

export const predict = async (data) => {
  const response = await axios.post('http://localhost:5000/predict', data);
  return response.data;
};