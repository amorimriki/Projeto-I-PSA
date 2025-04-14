#!/opt/anaconda3/envs/projeto_env/bin/python python3
# Carregar o modelo
#model_path = os.path.join(os.path.dirname(__file__), 'mlp_pipeline.pkl')
#model = joblib.load(model_path)


import os
import sys
import pandas as pd
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS

# Verificação de ambiente virtual
if sys.prefix == sys.base_prefix:
    print("⚠️  Aviso: Ambiente virtual não ativo.")
else:
    print("✅ Ambiente virtual ativo.")

# Definição do backend
app = Flask(__name__)
CORS(app)

# Carregar o modelo
model_path = os.path.join(os.path.dirname(__file__), 'mlp_pipeline.pkl')
model = joblib.load(model_path)

# Features do modelo
categorical_features = ['code_module', 'gender', 'region', 'highest_education',
                        'imd_band', 'age_band', 'disability', 'assessment_type', 'is_banked']
numerical_features = ['date_submitted', 'num_of_prev_attempts', 'sum_click',
                      'date', 'studied_credits', 'weight', 'score']

# Função para verificar e corrigir as incompatibilidades dos dados
def preprocess_data(df):
    # Garantir que todas as colunas necessárias estão presentes
    for feature in categorical_features + numerical_features:
        if feature not in df.columns:
            df[feature] = None  # Coloca None nas colunas ausentes, para evitar erros

    # Verificar se as colunas numéricas estão como numéricas
    for col in numerical_features:
        df[col] = pd.to_numeric(df[col], errors='coerce')

    return df

# Rota para prever a partir de um arquivo CSV
@app.route("/predict-file", methods=["POST"])
def predict_file():
    if 'file' in request.files:
        file = request.files['file']
        try:
            # Ler o arquivo CSV
            df_novos_dados = pd.read_csv(file)
        except Exception as e:
            return jsonify({"error": f"Erro ao ler o arquivo CSV: {str(e)}"}), 400
    else:
        return jsonify({"error": "Nenhum arquivo CSV enviado."}), 400
    
    # Garantir que os dados estão no formato correto
    df_novos_dados = preprocess_data(df_novos_dados)
    
    # Separar as colunas de features e IDs
    ids = df_novos_dados['n_student']
    X_novos = df_novos_dados.drop(columns=['n_student'])

    # Fazer previsões
    predicoes = model.predict(X_novos)

    # Juntar IDs com previsões
    resultado = pd.DataFrame({
        'n_student': ids,
        'previsao': predicoes
    })
    
    # Retornar as previsões como JSON
    return jsonify(resultado.to_dict(orient='records'))

# Rota para prever a partir de dados JSON
@app.route("/predict-json", methods=["POST"])
def predict_json():
    if request.is_json:
        data = request.json
        df_novos_dados = pd.DataFrame(data)
    else:
        return jsonify({"error": "Nenhum JSON enviado."}), 400
    
    # Garantir que os dados estão no formato correto
    df_novos_dados = preprocess_data(df_novos_dados)
    
    # Separar as colunas de features e IDs
    ids = df_novos_dados['n_student']
    X_novos = df_novos_dados.drop(columns=['n_student'])

    # Fazer previsões
    predicoes = model.predict(X_novos)

    # Juntar IDs com previsões
    resultado = pd.DataFrame({
        'n_student': ids,
        'previsao': predicoes
    })
    
    # Retornar as previsões como JSON
    return jsonify(resultado.to_dict(orient='records'))

if __name__ == "__main__":
    app.run(debug=True)
