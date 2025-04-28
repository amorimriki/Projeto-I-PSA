from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from PSA_APP.backend.utils.history import carregar_historico

router = APIRouter()

@router.get("/historico")
def get_historico():
    return carregar_historico()

@router.get("/historico/{index}")
def get_detalhes_historico(index: int):
    historico = carregar_historico()
    if index < 0 or index >= len(historico):
        raise HTTPException(status_code=404, detail="Item não encontrado.")
    return historico[index]["dados"]

@router.get("/historico/timestamp/{id}")
def get_detalhes_por_datahora(id: str):
    historico = carregar_historico()
    for item in historico:
        if item["dataHora"] == id:
            return item["dados"]
    raise HTTPException(status_code=404, detail="Item não encontrado")

@router.delete("/historico")
def clear_all_history():
    from PSA_APP.backend.config import HISTORICO_PATH
    with open(HISTORICO_PATH, "w", encoding="utf-8") as f:
        json.dump([], f)
    return {"message": "Histórico limpo!"}

@router.delete("/historico/{index}")
def clear_item(index: int):
    historico = carregar_historico()
    if 0 <= index < len(historico):
        historico.pop(index)
        from PSA_APP.backend.config import HISTORICO_PATH
        with open(HISTORICO_PATH, "w", encoding="utf-8") as f:
            json.dump(historico, f, indent=2)
        return {"message": "Item removido."}
    else:
        raise HTTPException(status_code=404, detail="Índice inválido.")