import os
import sys
import pandas as pd
import joblib
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List
import io

# Verificação de ambiente virtual
if sys.prefix == sys.base_prefix:
    print("⚠️  Aviso: Ambiente virtual não ativo.")
else:
    print("✅ Ambiente virtual ativo.")

# Inicializar app FastAPI
app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ou restringir, ex: ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
base_path = "/Users/amorimriki/Documents/GitHub/Projeto-I-PSA"
# Carregar o modelo
model_path = os.path.join(base_path, "PSA_APP/backend/mlp_pipeline.pkl")
model = joblib.load(model_path)

# Features do modelo
categorical_features = ['code_module', 'gender', 'region', 'highest_education',
                        'imd_band', 'age_band', 'disability', 'assessment_type', 'is_banked']
numerical_features = ['date_submitted', 'num_of_prev_attempts', 'sum_click',
                      'date', 'studied_credits', 'weight', 'score']

def preprocess_data(df):
    for feature in categorical_features + numerical_features:
        if feature not in df.columns:
            df[feature] = None
    for col in numerical_features:
        df[col] = pd.to_numeric(df[col], errors='coerce')
    return df


# --- ROTA PARA UPLOAD CSV ---
@app.post("/predict-file")
async def predict_file(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="O ficheiro deve ser um CSV.")
    try:
        content = await file.read()
        df_novos_dados = pd.read_csv(io.StringIO(content.decode('utf-8')))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao ler o CSV: {str(e)}")

    df_novos_dados = preprocess_data(df_novos_dados)

    if 'n_student' not in df_novos_dados.columns:
        raise HTTPException(status_code=400, detail="'n_student' é obrigatório.")

    ids = df_novos_dados['n_student']
    X_novos = df_novos_dados.drop(columns=['n_student'])
    predicoes = model.predict(X_novos)

    df_novos_dados['previsao'] = predicoes
    resultado = df_novos_dados
    ##n_student	previsao
    return JSONResponse(content=resultado.to_dict(orient='records'))




# --- ROTA PARA JSON DIRETO ---
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

@app.post("/predict-json")
def predict_json(data: List[StudentInput]):
    df_novos_dados = pd.DataFrame([d.dict() for d in data])
    df_novos_dados = preprocess_data(df_novos_dados)

    ids = df_novos_dados['n_student']
    X_novos = df_novos_dados.drop(columns=['n_student'])
    predicoes = model.predict(X_novos)

    resultado = pd.DataFrame({'n_student': ids, 'previsao': predicoes})
    return JSONResponse(content=resultado.to_dict(orient='records'))

@app.get("/")
def home():
    return {"message": "Hello, FastAPI!"}
