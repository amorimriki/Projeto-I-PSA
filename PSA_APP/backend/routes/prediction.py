from fastapi import APIRouter, UploadFile, File, HTTPException, Query, Form
from fastapi.responses import JSONResponse
import pandas as pd
import io

from PSA_APP.backend.models.model_loader import setModel
from PSA_APP.backend.utils.preprocess import preprocess_data, preprocess_data_file
from PSA_APP.backend.utils.history import salvar_no_historico
from PSA_APP.backend.utils.helpers import substituir_resultados
from PSA_APP.backend.models.pydantic_models import StudentInput

router = APIRouter()

@router.post("/predict-file")
async def predict_file(file: UploadFile = File(...), encoded: bool = Query(False), modelo: str = Form()):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="O ficheiro deve ser um CSV.")

    try:
        content = await file.read()
        df = pd.read_csv(io.StringIO(content.decode('utf-8')))
        model = setModel(modelo)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao ler CSV: {str(e)}")

    #if 'final_result' in df.columns:
    #    df = df.drop(columns=['final_result'])

    df_novos_dados = preprocess_data_file(df.copy(), encoded)

    if 'n_student' not in df_novos_dados.columns:
        raise HTTPException(status_code=400, detail="'n_student' é obrigatório.")

    X_novos = df_novos_dados.drop(columns=['n_student'])
    predicoes = model.predict(X_novos)
    resultados_convertidos = substituir_resultados(predicoes)
    df['previsao'] = resultados_convertidos

    salvar_no_historico(df, modelo, tipo="ficheiro")
    return JSONResponse(content=df.to_dict(orient='records'))

@router.post("/predict-json")
def predict_json(data: list[StudentInput], modelo: str = Query()):
    df = pd.DataFrame([d.dict() for d in data])
    df_decoded = df.copy()
    model = setModel(modelo)
    df = preprocess_data(df)
    predicoes = model.predict(df)
    labels = substituir_resultados(predicoes)
    df_decoded['previsao'] = labels


    resultados = pd.DataFrame({'n_student': df['n_student'], 'previsao': labels})
    salvar_no_historico(df_decoded, modelo, tipo="formulario")
    return JSONResponse(content=resultados.to_dict(orient='records'))