#-----------------------------------------------------
# Imports
#-----------------------------------------------------

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
from typing import List, Literal, Dict
from datetime import datetime
from pathlib import Path


#-----------------------------------------------------
# Ambiente virtual & FastAPI & CORS
#-----------------------------------------------------

# Verificação de ambiente virtual
if sys.prefix == sys.base_prefix:
    print("⚠️  Aviso: Ambiente virtual não ativo.")
else:
    print("✅ Ambiente virtual ativo.")

# Inicialização app FastAPI
app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Ou ["*"] para aceitar tudo (apenas em desenvolvimento!)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#-----------------------------------------------------
# Paths
#-----------------------------------------------------

# Projeto
base_path = "/Users/amorimriki/Documents/GitHub/Projeto-I-PSA"

# Histórico
HISTORICO_PATH = Path(os.path.join(base_path, "PSA_APP/backend/history/historico_previsoes.json"))

# Modelo
model_path_mlp = os.path.join(base_path, "ML_MODEL/mlp_pipeline.pkl")
model_path_rf = os.path.join(base_path, "ML_MODEL/rf_pipeline.pkl")
model_path_ensamble = os.path.join(base_path, "ML_MODEL/ensemble_model_80-20.pkl")

# Tranformer
encoders = joblib.load(os.path.join(base_path, "PSA_APP/backend/predict_model_encoders/encoders.pkl"))
scaler = joblib.load(os.path.join(base_path, "PSA_APP/backend/predict_model_encoders/scaler.pkl"))



#-----------------------------------------------------
# Utils
#-----------------------------------------------------

# Estrutura de um item de histórico
class HistoricoItem(BaseModel):
    dataHora: str
    tipo: Literal["formulario", "ficheiro"]
    modelo: str
    total: int
    resultado: str

# Lista que guarda o histórico
historico_previsoes: List[HistoricoItem] = []

# Seleção do modelo
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

# Histórico
def carregar_historico():
    if not os.path.exists(HISTORICO_PATH):
        return []

    try:
        with open(HISTORICO_PATH, "r") as f:
            return json.load(f)
    except json.JSONDecodeError:
        print("⚠️  Erro ao decodificar o JSON do histórico. Resetando histórico.")
        return []

def salvar_no_historico(resultados, modelo, tipo):
    if hasattr(resultados, "to_dict"):
        resultados_json = resultados.to_dict(orient="records")
    else:
        resultados_json = resultados

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

   # Transformação das colunas categóricas
    for col in categorical_features:
        encoder = encoders[col]  # Acessa o encoder correspondente para a coluna
        print(encoders[col].classes_)
        df.loc[:, col] = encoder.transform(df[col])  # Modifica diretamente a coluna


    # Transformação das colunas numéricas
    df[numerical_features] = scaler.transform(df[numerical_features])

    return df

def substituir_resultados(lista):
    return ['Pass' if item == 1 else 'Fail' if item == 0 else item for item in lista]

# Features do modelo
categorical_features = ['code_module', 'gender', 'region', 'highest_education',
                        'imd_band', 'age_band', 'disability', 'assessment_type', 'is_banked']
numerical_features = ['date_submitted', 'num_of_prev_attempts', 'sum_click',
                      'date', 'studied_credits', 'weight', 'score']

# Lista com a ordem correta das colunas
coluna_ordem_segura = [
    'code_module', 'gender', 'region', 'highest_education', 'imd_band', 'age_band',
    'num_of_prev_attempts', 'studied_credits', 'disability',
    'date_submitted', 'is_banked', 'score', 'assessment_type',
    'date', 'weight', 'sum_click', 
]
    



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

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao ler o CSV: {str(e)}")
    


    # Remover a coluna 'final_result' se existir
    if 'final_result' in df.columns: df = df.drop(columns=['final_result'])

    

    df_novos_dados = preprocess_data_file(df.copy(),encoded)

    # Verificação do n_student
    if 'n_student' not in df_novos_dados.columns:
        raise HTTPException(status_code=400, detail="'n_student' é obrigatório.")
    
    
    X_novos = df_novos_dados.drop(columns=['n_student'])
    predicoes = model.predict(X_novos)
    resultados_convertidos = substituir_resultados(predicoes)
    df['previsao'] = resultados_convertidos

    # Corrigindo os valores decimais para 2 casas nas colunas numéricas
    df[numerical_features] = df[numerical_features].round(2)
    # Arredondando as colunas para inteiros
    df['date'] = df['date'].round().astype(int)
    df['date_submitted'] = df['date_submitted'].round().astype(int)
    df['sum_click'] = df['sum_click'].round().astype(int)
    resultados = df
    salvar_no_historico(resultados, modelo, tipo="ficheiro")


    return JSONResponse(content=resultados.to_dict(orient='records'))




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


# --- ROTA PARA UPLOAD JSON ---
@app.post("/predict-json")
def predict_json(
    data: List[StudentInput], 
    modelo: str = Query()
):
    # Criando DataFrame com os dados recebidos
    df = pd.DataFrame([d.dict() for d in data])
    print("Colunas recebidas:", df.columns.tolist())
    print("Primeira linha:\n", df.head())
    
    for col in coluna_ordem_segura:
        if col == 'date' and df[col].isnull().any():  
            df[col].fillna(222.0, inplace=True)  
        if col == 'code_module' and df[col].isnull().any():  
            df[col].fillna("AAA", inplace=True)

    # Obtendo o identificador dos alunos (presumo que 'n_student' seja a coluna de identificação)
    id = df['n_student']

    # Selecionando e configurando o modelo
    model = setModel(modelo)
    print("✅ modelo =", modelo)

    # Fazendo uma cópia dos dados para não alterar o original
    df_novos_dados = df.copy()

    # Ordenando as colunas de acordo com a segurança e verificando
    print("Colunas ordenadas:", df_novos_dados.columns.tolist())
    print("Primeira linha:\n", df_novos_dados.head())

    # Aplicando o pré-processamento (verifique se 'coluna_ordem_segura' é uma lista de colunas válida)
    df_novos_dados = preprocess_data(df_novos_dados[coluna_ordem_segura])

    print("Colunas processadas:", df_novos_dados.columns.tolist())
    print("Primeira linha:\n", df_novos_dados.head())

    # Realizando a previsão
    predicao = model.predict(df_novos_dados)

    # Substituindo os resultados conforme necessário
    labels = substituir_resultados(predicao)

    # Adicionando a coluna de previsões ao DataFrame original
    df['previsao'] = labels

    # Criando o DataFrame de resultados
    resultados = pd.DataFrame({'n_student': id, 'previsao': labels})

    print("Predição:\n", predicao)

    # Salvar os resultados no histórico
    salvar_no_historico(df, modelo, tipo="formulario")
    return JSONResponse(content=resultados.to_dict(orient='records'))










# --- ROTA PARA HISTORY ---
@app.get("/historico", response_model=List[HistoricoItem])
def get_historico():
    return carregar_historico()

@app.get("/historico/{index}")
def get_detalhes_historico(index: int):
    historico = carregar_historico()
    if index < 0 or index >= len(historico):
        raise HTTPException(status_code=404, detail="Item de histórico não encontrado.")
    return historico[index]["dados"]



@app.delete("/historico")
async def clear_all_history():
    """
    Endpoint para limpar todo o histórico de previsões.
    Exclui todos os registros no arquivo JSON de histórico.
    """
    try:
        # Limpa o histórico
        with open(HISTORICO_PATH, "w", encoding="utf-8") as f:
            json.dump([], f, indent=2, ensure_ascii=False)  # Esvazia o arquivo JSON
        return JSONResponse(content={"message": "Histórico limpo com sucesso!"}, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao limpar o histórico: {str(e)}")


@app.delete("/historico/{index}")
async def clear_item(index: int):
    """
    Endpoint para excluir um item específico do histórico baseado no índice.
    """
    try:
        historico = carregar_historico()  # Carrega o histórico atual do arquivo JSON
        
        if 0 <= index < len(historico):
            # Remove o item do histórico
            historico.pop(index)
            
            # Salva o histórico atualizado no arquivo
            with open(HISTORICO_PATH, "w", encoding="utf-8") as f:
                json.dump(historico, f, indent=2, ensure_ascii=False)
                
            return JSONResponse(content={"message": f"Item {index} excluído com sucesso!"}, status_code=200)
        else:
            raise HTTPException(status_code=404, detail="Índice inválido ou item não encontrado.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao excluir o item: {str(e)}")




@app.get("/historico/timestamp/{id}")
def get_detalhes_por_datahora(id: str):
    print("ID:", id)
    
    historico = carregar_historico()

    for item in historico:
        if item["dataHora"] == id:
            return item["dados"]

    raise HTTPException(status_code=404, detail="Item não encontrado")