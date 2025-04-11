#!/usr/bin/env python3
import os
import sys

# Verificação de ambiente virtual
if sys.prefix == sys.base_prefix:
    print("⚠️  Aviso: Ambiente virtual não ativo.")
else:
    print("✅ Ambiente virtual ativo.")

# Instalar dependências se necessário
try:
    import flask
    import joblib
    import pandas as pd
except ImportError:
    print("📦 Erro dependências necessárias...")

# Definição do backend
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd


app = Flask(__name__)
CORS(app)


import os

model_path = os.path.join(os.path.dirname(__file__), 'mlp_pipeline.pkl')
model = joblib.load(model_path)


categorical_features = ['code_module', 'gender', 'region', 'highest_education',
                        'imd_band', 'age_band', 'disability', 'assessment_type', 'is_banked']
numerical_features = ['date_submitted', 'num_of_prev_attempts', 'sum_click',
                      'date', 'studied_credits', 'weight', 'score']

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    missing = [f for f in categorical_features + numerical_features if f not in data]
    if missing:
        return jsonify({"error": f"Campos em falta: {missing}"}), 400

    input_df = pd.DataFrame([data])
    prediction = model.predict(input_df)[0]
    return jsonify({"prediction": prediction})

if __name__ == "__main__":
    app.run(debug=True)
