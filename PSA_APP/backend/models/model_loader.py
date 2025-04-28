import joblib
from PSA_APP.backend.config import model_path_mlp, model_path_rf,model_path_svm, model_path_ensamble1,model_path_ensamble2

def setModel(model_name):
    if model_name == 'mlp_model':
        path = model_path_mlp
    elif model_name == 'svm_model':
        path = model_path_svm
    elif model_name == 'svm_model':
        path = model_path_rf
    elif model_name == 'ensamble_model_1':
        path = model_path_ensamble1
    elif model_name == 'ensamble_model_2':
        path = model_path_ensamble2
    else:
        raise ValueError(f"Modelo desconhecido: {model_name}")
    return joblib.load(path)