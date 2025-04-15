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
    allow_origins=["http://localhost:3000"],  # Ou ["*"] para aceitar tudo (apenas em desenvolvimento!)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
base_path = "/Users/amorimriki/Documents/GitHub/Projeto-I-PSA"
# Carregar o modelo
model_path_mlp = os.path.join(base_path, "ML_MODEL/mlp_pipeline.pkl")
model_path_rf = os.path.join(base_path, "ML_MODEL/rf_pipeline.pkl")
model = joblib.load(model_path_mlp)

encoder = joblib.load(os.path.join(base_path, "PSA_APP/backend/predict_model_encoders/encoder.pkl"))
scaler = joblib.load(os.path.join(base_path, "PSA_APP/backend/predict_model_encoders/scaler.pkl"))

# Features do modelo
categorical_features = ['code_module', 'gender', 'region', 'highest_education',
                        'imd_band', 'age_band', 'disability', 'assessment_type', 'is_banked']
numerical_features = ['date_submitted', 'num_of_prev_attempts', 'sum_click',
                      'date', 'studied_credits', 'weight', 'score']


coluna_ordem_segura = [
    'code_module', 'gender', 'region', 'highest_education', 'imd_band', 'age_band',
    'num_of_prev_attempts', 'studied_credits', 'disability',
    'date_submitted', 'is_banked', 'score', 'assessment_type',
    'date', 'weight', 'sum_click'
]

def substituir_resultados(lista):
    return ['Pass' if item == 1 else 'Fail' if item == 0 else item for item in lista]

def preprocess_data(df):
    # Remover a coluna 'final_result' se existir
    if 'final_result' in df.columns:
        df = df.drop(columns=['final_result'])

    # Adicionar colunas em falta
    for feature in categorical_features + numerical_features:
        if feature not in df.columns:
            df[feature] = 0

    # Corrigir tipos das colunas numéricas
    for col in numerical_features:
        df[col] = pd.to_numeric(df[col], errors='coerce').fillna(222.0)

    for col in categorical_features:
        df[col] = encoder.fit_transform(df[col])

    df[numerical_features] = scaler.fit_transform(df[numerical_features])



    # Adicionar 'n_student' se estiver presente
    if 'n_student' in df.columns:
        coluna_ordem_segura.append('n_student')

    # Reordenar se possível
    df = df[[col for col in coluna_ordem_segura if col in df.columns]]

    return df



# --- ROTA PARA UPLOAD CSV ---
@app.post("/predict-file")
async def predict_file(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="O ficheiro deve ser um CSV.")
    try:
        content = await file.read()
        df = pd.read_csv(io.StringIO(content.decode('utf-8')))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao ler o CSV: {str(e)}")
    if 'final_result' in df.columns:
        df = df.drop(columns=['final_result'])
    df_novos_dados = preprocess_data(df.copy())

    if 'n_student' not in df_novos_dados.columns:
        raise HTTPException(status_code=400, detail="'n_student' é obrigatório.")
    
    # Reordenar colunas (com n_student no fim se estiver presente)
    ids = df_novos_dados['n_student']
    X_novos = df_novos_dados.drop(columns=['n_student'])
    predicoes = model.predict(X_novos)
    resultados_convertidos = substituir_resultados(predicoes)
    df['previsao'] = resultados_convertidos
    resultado = df
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
    

    # Se "n_student" estiver presente, adiciona no final
    if 'n_student' in df_novos_dados.columns:
        coluna_ordem_segura.append('n_student')

    # Reordenar apenas as colunas existentes
    df_novos_dados = df_novos_dados[[col for col in coluna_ordem_segura if col in df_novos_dados.columns]]

    for col in df_novos_dados:
        print(col)

    # Aplicar pré-processamento
    df_novos_dados = preprocess_data(df_novos_dados)

    ids = df_novos_dados['n_student']
    X_novos = df_novos_dados.drop(columns=['n_student'])
    predicoes = model.predict(X_novos).ravel()

    resultado = pd.DataFrame({'n_student': ids, 'previsao': predicoes})
    return JSONResponse(content=resultado.to_dict(orient='records'))

@app.get("/")
def home():
    return {"message": "Hello, FastAPI!"}
