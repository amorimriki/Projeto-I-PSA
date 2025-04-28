import os
from pathlib import Path

base_path = "/Users/amorimriki/Documents/GitHub/Projeto-I-PSA"

HISTORICO_PATH = Path(os.path.join(base_path, "PSA_APP/backend/history/historico_previsoes.json"))

model_path_svm = os.path.join(base_path, "ML_MODEL/svm_pipeline.pkl")
model_path_mlp = os.path.join(base_path, "ML_MODEL/mlp_pipeline.pkl")
model_path_rf = os.path.join(base_path, "ML_MODEL/rf_pipeline.pkl")
model_path_ensamble1 = os.path.join(base_path, "ML_MODEL/ensemble_model_1.pkl")
model_path_ensamble2 = os.path.join(base_path, "ML_MODEL/ensemble_model_2.pkl")

categorical_features = [
    'code_module', 'gender', 'region', 'highest_education',
    'imd_band', 'age_band', 'disability', 'assessment_type', 'is_banked'
]
numerical_features = [
    'date_submitted', 'num_of_prev_attempts', 'sum_click',
    'date', 'studied_credits', 'weight', 'score'
]
coluna_ordem_segura = [
    'code_module', 'gender', 'region', 'highest_education', 'imd_band', 'age_band',
    'num_of_prev_attempts', 'studied_credits', 'disability',
    'date_submitted', 'is_banked', 'score', 'assessment_type',
    'date', 'weight', 'sum_click',
]