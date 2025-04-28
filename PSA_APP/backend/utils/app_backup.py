# -----------------------------------------------------
# Imports
# -----------------------------------------------------

import os
import io
import sys
import json
import joblib
import pandas as pd
from fastapi import FastAPI, File, UploadFile, HTTPException, Query, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Literal
from datetime import datetime
from pathlib import Path

# -----------------------------------------------------
# Ambiente virtual & FastAPI & CORS
# -----------------------------------------------------

# Verificação de ambiente virtual
if sys.prefix == sys.base_prefix:
    print("⚠️  Aviso: Ambiente virtual não está ativo.")
else:
    print("✅ Ambiente virtual ativo.")

# Inicialização da aplicação FastAPI
app = FastAPI()

# Configuração do middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Ajustar conforme necessário
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------------------
# Caminhos
# -----------------------------------------------------

# Caminho base do projeto
base_path = "/Users/amorimriki/Documents/GitHub/Projeto-I-PSA"

# Caminho do ficheiro de histórico
HISTORICO_PATH = Path(os.path.join(base_path, "PSA_APP/backend/history/historico_previsoes.json"))

# Caminhos dos modelos
model_path_mlp = os.path.join(base_path, "ML_MODEL/mlp_pipeline.pkl")
model_path_rf = os.path.join(base_path, "ML_MODEL/rf_pipeline.pkl")
model_path_ensamble = os.path.join(base_path, "ML_MODEL/ensemble_model_80-20.pkl")

# Carregamento dos transformadores (encoders e scaler)
encoders = joblib.load(os.path.join(base_path, "PSA_APP/backend/predict_model_encoders/encoders.pkl"))
scaler = joblib.load(os.path.join(base_path, "PSA_APP/backend/predict_model_encoders/scaler.pkl"))

# -----------------------------------------------------
# Estruturas e utilitários
# -----------------------------------------------------

# Modelo de dados para item do histórico
class HistoricoItem(BaseModel):
    dataHora: str
    tipo: Literal["formulario", "ficheiro"]
    modelo: str
    total: int
    resultado: str

# Função para carregar o modelo apropriado
def setModel(model_name):
    if model_name == 'mlp_model':
        path = model_path_mlp
    elif model_name == 'ensamble_model':
        path = model_path_ensamble
    elif model_name == 'rf_model':
        path = model_path_rf
    else:
        raise ValueError(f"Modelo desconhecido: {model_name}")
    return joblib.load(path)

# Função para carregar o histórico
def carregar_historico():
    if not os.path.exists(HISTORICO_PATH):
        return []
    try:
        with open(HISTORICO_PATH, "r") as f:
            return json.load(f)
    except json.JSONDecodeError:
        print("⚠️  Erro ao decodificar o JSON do histórico. Resetando histórico.")
        return []

# Função para salvar resultados no histórico
def salvar_no_historico(resultados, modelo, tipo):
    resultados_json = resultados.to_dict(orient="records") if hasattr(resultados, "to_dict") else resultados
    total = len(resultados_json)
    pass_count = sum(r['previsao'] == 'Pass' for r in resultados_json)
    fail_count = sum(r['previsao'] == 'Fail' for r in resultados_json)

    pass_percentage = (pass_count / total) * 100
    fail_percentage = (fail_count / total) * 100

    resumo = f"{pass_percentage:.1f}% Pass __ {fail_percentage:.1f}% Fail"
    item = {
        "dataHora": datetime.now().strftime("%Y-%m-%d_%H-%M-%S-%f"),
        "tipo": tipo,
        "modelo": modelo,
        "total": total,
        "resultado": resumo,
        "dados": resultados_json  
    }

    historico = carregar_historico()
    historico.append(item)

    with open(HISTORICO_PATH, "w", encoding="utf-8") as f:
        json.dump(historico, f, indent=2, ensure_ascii=False)

    print("Histórico guardado com os dados completos.")

# Função de pré-processamento para ficheiros
def preprocess_data_file(df, isRaw):
    if isRaw:
        for col in categorical_features:
            encoder = encoders[col]
            df[col] = encoder.fit_transform(df[col])
        df[numerical_features] = scaler.transform(df[numerical_features])

    if 'n_student' in df.columns:
        coluna_ordem_segura.append('n_student')

    df = df[[col for col in coluna_ordem_segura if col in df.columns]]
    return df

# Função de pré-processamento geral
def preprocess_data(df):
    missing_cols = [col for col in coluna_ordem_segura if col not in df.columns]
    if missing_cols:
        print("⚠️ Colunas em falta:", missing_cols)
        for col in missing_cols:
            df[col] = pd.NA

    df = df[[col for col in coluna_ordem_segura if col in df.columns]]

    for col in categorical_features:
        encoder = encoders[col]
        print(encoders[col].classes_)
        df.loc[:, col] = encoder.transform(df[col])

    df[numerical_features] = scaler.transform(df[numerical_features])
    return df

# Função auxiliar para substituir resultados numéricos por texto
def substituir_resultados(lista):
    return ['Pass' if item == 1 else 'Fail' if item == 0 else item for item in lista]

# Definição de features
categorical_features = ['code_module', 'gender', 'region', 'highest_education',
                        'imd_band', 'age_band', 'disability', 'assessment_type', 'is_banked']
numerical_features = ['date_submitted', 'num_of_prev_attempts', 'sum_click',
                      'date', 'studied_credits', 'weight', 'score']

coluna_ordem_segura = [
    'code_module', 'gender', 'region', 'highest_education', 'imd_band', 'age_band',
    'num_of_prev_attempts', 'studied_credits', 'disability',
    'date_submitted', 'is_banked', 'score', 'assessment_type',
    'date', 'weight', 'sum_click',
]

# -----------------------------------------------------
# Endpoints
# -----------------------------------------------------

# Endpoint para upload de ficheiro CSV
@app.post("/predict-file")
async def predict_file(file: UploadFile = File(...), encoded: bool = Query(False), modelo: str = Form()):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="O ficheiro deve ser um CSV.")

    try:
        content = await file.read()
        df = pd.read_csv(io.StringIO(content.decode('utf-8')))
        model = setModel(modelo)
        print("✅ modelo =", modelo)
        print("✅ encoded =", encoded)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao ler o CSV: {str(e)}")

    if 'final_result' in df.columns:
        df = df.drop(columns=['final_result'])

    df_novos_dados = preprocess_data_file(df.copy(), encoded)

    if 'n_student' not in df_novos_dados.columns:
        raise HTTPException(status_code=400, detail="'n_student' é obrigatório.")

    X_novos = df_novos_dados.drop(columns=['n_student'])
    predicoes = model.predict(X_novos)
    resultados_convertidos = substituir_resultados(predicoes)
    df['previsao'] = resultados_convertidos

    df[numerical_features] = df[numerical_features].round(2)
    df['date'] = df['date'].round().astype(int)
    df['date_submitted'] = df['date_submitted'].round().astype(int)
    df['sum_click'] = df['sum_click'].round().astype(int)

    salvar_no_historico(df, modelo, tipo="ficheiro")

    return JSONResponse(content=df.to_dict(orient='records'))

# Modelo de entrada para JSON
class StudentInput(BaseModel):
    n_student: str
    code_module: str = None
    gender: str = None
    region: str = None
    highest_education: str = None
    imd_band: str = None
    age_band: str = None
    disability: str = None
    assessment_type: str = None
    is_banked: str = None
    date_submitted: float = None
    num_of_prev_attempts: float = None
    sum_click: float = None
    date: float = None
    studied_credits: float = None
    weight: float = None
    score: float = None

# Endpoint para upload via JSON
@app.post("/predict-json")
def predict_json(data: List[StudentInput], modelo: str = Query()):
    df = pd.DataFrame([d.dict() for d in data])
    print("Colunas recebidas:", df.columns.tolist())

    for col in coluna_ordem_segura:
        if col == 'date' and df[col].isnull().any():
            df[col].fillna(222.0, inplace=True)
        if col == 'code_module' and df[col].isnull().any():
            df[col].fillna("AAA", inplace=True)

    id = df['n_student']
    model = setModel(modelo)
    print("✅ modelo =", modelo)

    df_novos_dados = df.copy()
    df_novos_dados = preprocess_data(df_novos_dados[coluna_ordem_segura])
    predicao = model.predict(df_novos_dados)
    labels = substituir_resultados(predicao)

    df['previsao'] = labels
    resultados = pd.DataFrame({'n_student': id, 'previsao': labels})

    salvar_no_historico(df, modelo, tipo="formulario")
    return JSONResponse(content=resultados.to_dict(orient='records'))

# Endpoint para obter histórico geral
@app.get("/historico", response_model=List[HistoricoItem])
def get_historico():
    return carregar_historico()

# Endpoint para obter detalhes de um item do histórico
@app.get("/historico/{index}")
def get_detalhes_historico(index: int):
    historico = carregar_historico()
    if index < 0 or index >= len(historico):
        raise HTTPException(status_code=404, detail="Item de histórico não encontrado.")
    return historico[index]["dados"]

# Endpoint para limpar todo o histórico
@app.delete("/historico")
async def clear_all_history():
    try:
        with open(HISTORICO_PATH, "w", encoding="utf-8") as f:
            json.dump([], f, indent=2, ensure_ascii=False)
        return JSONResponse(content={"message": "Histórico limpo com sucesso!"}, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao limpar o histórico: {str(e)}")

# Endpoint para remover item específico do histórico
@app.delete("/historico/{index}")
async def clear_item(index: int):
    try:
        historico = carregar_historico()
        if 0 <= index < len(historico):
            historico.pop(index)
            with open(HISTORICO_PATH, "w", encoding="utf-8") as f:
                json.dump(historico, f, indent=2, ensure_ascii=False)
            return JSONResponse(content={"message": f"Item {index} excluído com sucesso!"}, status_code=200)
        else:
            raise HTTPException(status_code=404, detail="Índice inválido ou item não encontrado.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao excluir o item: {str(e)}")

# Endpoint para obter detalhes por data/hora
@app.get("/historico/timestamp/{id}")
def get_detalhes_por_datahora(id: str):
    print("ID:", id)
    historico = carregar_historico()
    for item in historico:
        if item["dataHora"] == id:
            return item["dados"]
    raise HTTPException(status_code=404, detail="Item não encontrado")
