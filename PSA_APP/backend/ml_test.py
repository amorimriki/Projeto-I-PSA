#!/opt/anaconda3/envs/projeto_env/bin/python python3

import pandas as pd
import joblib


# Caminho para o ficheiro e para o modelo
import os
base_path = "/Users/amorimriki/Documents/GitHub/Projeto-I-PSA"
caminho_csv = os.path.join(base_path, "DATASET/OULAD_MERGE/synthetic_student_data_with_students.csv")

caminho_modelo = os.path.join(base_path, "PSA_APP/backend/mlp_pipeline.pkl")

# Carregar os dados
df_novos_dados = pd.read_csv(caminho_csv)

# Separar os IDs
ids = df_novos_dados['n_student']
X_novos = df_novos_dados.drop(columns=['n_student'])

# Carregar o modelo treinado
mlp_pipeline = joblib.load(caminho_modelo)

# Fazer previsões
predicoes = mlp_pipeline.predict(X_novos)

# Juntar IDs com previsões
resultado = pd.DataFrame({
    'n_student': ids,
    'previsao': predicoes
})

# Guardar para CSV
caminho_saida = os.path.join(base_path, "PSA_APP/backend/predictionprevisoes_mlp.csv")
resultado.to_csv(caminho_saida, index=False)

print("Previsões feitas e guardadas em:", caminho_saida)
