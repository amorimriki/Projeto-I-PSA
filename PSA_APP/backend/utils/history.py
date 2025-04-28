import json
import os
from datetime import datetime
from PSA_APP.backend.config import HISTORICO_PATH

def carregar_historico():
    if not os.path.exists(HISTORICO_PATH):
        return []
    try:
        with open(HISTORICO_PATH, "r") as f:
            return json.load(f)
    except json.JSONDecodeError:
        print("⚠️ Erro ao ler histórico.")
        return []

def salvar_no_historico(resultados, modelo, tipo):
    resultados_json = resultados.to_dict(orient="records") if hasattr(resultados, "to_dict") else resultados
    total = len(resultados_json)
    pass_count = sum(r['previsao'] == 'Pass' for r in resultados_json)
    fail_count = sum(r['previsao'] == 'Fail' for r in resultados_json)
    resumo = f"{(pass_count/total)*100:.1f}% Pass __ {(fail_count/total)*100:.1f}% Fail"

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