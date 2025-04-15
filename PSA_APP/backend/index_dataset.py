#!/opt/anaconda3/envs/projeto_env/bin/python python3

import pandas as pd



# Caminho para o ficheiro e para o modelo
import os
base_path = "/Users/amorimriki/Documents/GitHub/Projeto-I-PSA"


caminho_csv = os.path.join(base_path, "DATASET/OULAD_MERGE/synthetic/student_data_sampled.csv")

df = pd.read_csv(caminho_csv)

# Adicionar a coluna n_student
df.insert(0, 'n_student', df.index + 1)

# Salvar o novo CSV
df.to_csv("student_data_sampled_with_id.csv", index=False)

# Guardar para CSV
caminho_saida = os.path.join(base_path, "DATASET/OULAD_MERGE/synthetic/student_data_sampled2.csv")
df.to_csv(caminho_saida, index=False)

print("Previsões feitas e guardadas em:", caminho_saida)
