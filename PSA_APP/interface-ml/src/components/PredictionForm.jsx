import React, { useState } from 'react';
import { predict } from '../services/api';

const PredictionForm = ({ onResult }) => {
  const [input, setInput] = useState({
    gender: '',
    age_band: '',
    // ... outros campos
  });

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await predict(input);
    onResult(result);
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded">
      <div className="mb-3">
        <label className="form-label">Género</label>
        <select name="gender" className="form-select" onChange={handleChange}>
          <option value="">Selecione</option>
          <option value="0">Feminino</option>
          <option value="1">Masculino</option>
        </select>
      </div>
      {/* outros inputs */}
      <button type="submit" className="btn btn-primary">Prever</button>
    </form>
  );
};

export default PredictionForm;