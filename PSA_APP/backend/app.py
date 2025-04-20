import os
import sys
import pandas as pd
import joblib
from fastapi import FastAPI, File, UploadFile, HTTPException, Query, Form
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
model_path_ensamble = os.path.join(base_path, "ML_MODEL/ensemble_model_80-20.pkl")


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




encoders = joblib.load(os.path.join(base_path, "PSA_APP/backend/predict_model_encoders/encoders.pkl"))
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
    'date', 'weight', 'sum_click', 
]

def substituir_resultados(lista):
    return ['Pass' if item == 1 else 'Fail' if item == 0 else item for item in lista]

def preprocess_data_file(df,isRaw):

     # Codificar features
    if isRaw == True:
        for col in categorical_features:
            encoder = encoders[col]  # Acessa o encoder correspondente para a coluna
            df[col] = encoder.fit_transform(df[col])
        df[numerical_features] = scaler.transform(df[numerical_features])

    # Adicionar 'n_student' se estiver presente
    if 'n_student' in df.columns:
        coluna_ordem_segura.append('n_student')

    # Reordenar se possível
    df = df[[col for col in coluna_ordem_segura if col in df.columns]]
    
    return df


def preprocess_data(df):
    # Verificar colunas em falta
    missing_cols = [col for col in coluna_ordem_segura if col not in df.columns]

    if missing_cols:
        print("⚠️ Colunas em falta:", missing_cols)
        # Adicionar colunas em falta com pd.NA
        for col in missing_cols:
            df[col] = pd.NA

    # Reordenar colunas de forma segura
    df = df[[col for col in coluna_ordem_segura if col in df.columns]]

    # Tratamento de valores faltantes específicos
    for col in coluna_ordem_segura:
        if col == 'date' and df[col].isna().all():  # Verifica se todos os valores são NaN
            df[col] = 222.0  # Substitui por 222.0
        if col == 'code_module' and df[col].isna().all():  # Verifica se todos os valores são NaN
            df[col] = "AAA"  # Substitui por "AAA"

   # Transformação das colunas categóricas
    for col in categorical_features:
        encoder = encoders[col]  # Acessa o encoder correspondente para a coluna
        print(encoders[col].classes_)
        df.loc[:, col] = encoder.transform(df[col])  # Modifica diretamente a coluna


    # Transformação das colunas numéricas
    df[numerical_features] = scaler.transform(df[numerical_features])

    return df

# --- ROTA PARA UPLOAD CSV ---
@app.post("/predict-file")


async def predict_file(file: UploadFile = File(...), encoded: bool = Query(False), modelo: str = Form(), ):

    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="O ficheiro deve ser um CSV.")
    try:
        content = await file.read()
        df = pd.read_csv(io.StringIO(content.decode('utf-8')))
         # Carrega dinamicamente o modelo escolhido
        model = setModel(modelo)
        print("✅ modelo =", modelo)
        print("✅ encoded =", encoded)
        

        '''

        Se sendRaw === false, o CSV é pré-codificado.

        Se sendRaw === true , o CSV é composto por dados raw.

        '''

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao ler o CSV: {str(e)}")
    
    # Remover a coluna 'final_result' se existir
    if 'final_result' in df.columns: df = df.drop(columns=['final_result'])

    df_novos_dados = preprocess_data_file(df.copy(),encoded)

    if 'n_student' not in df_novos_dados.columns:
        raise HTTPException(status_code=400, detail="'n_student' é obrigatório.")
    
    
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
def predict_json(
    data: List[StudentInput], 
    modelo: str = Query()
):
    df_novos_dados = pd.DataFrame([d.dict() for d in data])
    
    model = setModel(modelo)
    print("✅ modelo =", modelo)
    # Lista com a ordem correta das colunas
    coluna_ordem_segura = [
        "code_module", "gender", "region", "highest_education",
        "imd_band", "age_band", "num_of_prev_attempts", "studied_credits",
        "disability", "date_submitted", "is_banked", "score",
        "assessment_type", "date", "weight", "sum_click", "n_student"
    ]
    df_novos_dados = df_novos_dados[coluna_ordem_segura]

    print("Colunas recebidas:", df_novos_dados.columns.tolist())
    print("Primeira linha:\n", df_novos_dados.head())
    id = df_novos_dados['n_student']
    # Aplicar pré-processamento
    df_novos_dados = preprocess_data(df_novos_dados)
    print("Colunas processadas:", df_novos_dados.columns.tolist())
    print("Primeira linha:\n", df_novos_dados.head())

    predicao = model.predict(df_novos_dados)
    labels = substituir_resultados(predicao)
    print("Predicao:\n", predicao)
    resultado = pd.DataFrame({'n_student': id, 'previsao': labels})
    return JSONResponse(content=resultado.to_dict(orient='records'))


@app.get("/")
def home():
    return {"message": "Hello, FastAPI!"}
