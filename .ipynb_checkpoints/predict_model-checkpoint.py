# ---
# jupyter:
#   jupytext:
#     formats: ipynb,py:percent
#     text_representation:
#       extension: .py
#       format_name: percent
#       format_version: '1.3'
#       jupytext_version: 1.16.7
#   kernelspec:
#     display_name: Python [conda env:base] *
#     language: python
#     name: conda-base-py
# ---

# %% editable=true slideshow={"slide_type": ""}
# --------------------------------------------------------------
# Dependencies
# --------------------------------------------------------------

import pandas as pd
import pylab as pl
import numpy as np
import scipy.optimize as opt
import statsmodels.api as sm

import matplotlib.pyplot as plt
import matplotlib.mlab as mlab
import seaborn as sns

import itertools

from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.neural_network import MLPClassifier
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import StackingClassifier
from sklearn import preprocessing
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import StandardScaler




# %% editable=true slideshow={"slide_type": ""}
'''
# --------------------------------------------------------------
# Plot settings
# --------------------------------------------------------------

plt.style.use("fivethirtyeight")
plt.rcParams["figure.figsize"] = (20, 5)
plt.rcParams["figure.dpi"] = 100
plt.rcParams["lines.linewidth"] = 2
'''

# %% editable=true slideshow={"slide_type": ""}
# --------------------------------------------------------------
# Import Dataset 
# --------------------------------------------------------------


studentInfo = pd.read_csv("./uci-open-university-learning-analytics-dataset/studentInfo.csv")

assessments = pd.read_csv("./uci-open-university-learning-analytics-dataset/assessments.csv")

studentAssessment = pd.read_csv("./uci-open-university-learning-analytics-dataset/studentAssessment.csv")

studentVle = pd.read_csv("./uci-open-university-learning-analytics-dataset/studentVle.csv")



# %%
'''
# --------------------------------------------------------------
# Normalization of the dataset
# --------------------------------------------------------------

sI_df = studentInfo

print("\nstudentInfo - original types\n")
print(sI_df.dtypes)

encoder = LabelEncoder()
for coluna in sI_df :
    sI_df[coluna] = encoder.fit_transform(sI_df[coluna])
    
print("\nstudentInfo - encoded types\n")
print(studentInfo.dtypes)

X =np.asarray(studentInfo[['gender','region','highest_education','imd_band','age_band','num_of_prev_attempts','studied_credits','disability']]) # Features
y =np.asarray(studentInfo[['final_result']])  # Label sem normalizar

X = preprocessing.StandardScaler().fit_transform(X)
y = LabelEncoder().fit_transform(y.ravel())

print(studentInfo.head())
'''


# %%
'''
# ---------------------------------
# Criar DataFrame para visualização
# ---------------------------------
df = pd.DataFrame(X, columns=['Gender','Region','Highest Education','Imd Band','Age Band','Prev Attempts','Credits','Disability'])
df['Final Result'] = y  # Adicionar os rótulos ao DataFrame

'''

# %%
# --------------------------------------------------------------
# Junção das Tabelas
# --------------------------------------------------------------

# Juntar informações das avaliações
dfs = studentInfo.merge(studentAssessment, on="id_student", how="left")
print("\nstudentAssessment\n")
print(studentAssessment.dtypes)

# Juntar com detalhes das avaliações
assessments.drop(columns=["code_module", "code_presentation"], inplace=True) #Remove colunas que vão ser duplicadas
dfs = dfs.merge(assessments, on="id_assessment", how="left")
print("\nassessments\n")
print(assessments.dtypes)

# Juntar interações com a plataforma
dfs = dfs.merge(studentVle.groupby("id_student")["sum_click"].sum().reset_index(), on="id_student", how="left")

print("\nstudentVle\n")
print(studentVle.dtypes)


dfs.drop(columns=["id_student", "id_assessment","code_presentation"], inplace=True) #Remover colunas irrelevantes 


# Questao para Final Result: tem 4: Fail, Withdrawn, Pass and Disitinction. Devo fazer drop das desistencias e juntar os de distinção ao aprovado ?

# %%
print("\ndfs\n")
print(dfs.dtypes)
print(dfs.head())

print("\nnunique\n")
print(dfs.nunique())
print(dfs.describe().T)


print("\nisnull\n")
print(dfs.isnull().sum())
print((dfs.isnull().sum() / len(dfs) * 100).apply(lambda x: f"{x:.2f}%"))

print("\nshape\n")
print(dfs.shape)

# %%
'''
# Exploratory Data Analysis


# Categorical variables: Count plot, Bar Chart, Pie Plot, etc.

# Numerical Variables: Histogram, Box Plot, Density Plot, etc.
'''

# %%
# --------------------------------------------------------------
# Identificação das Features
# --------------------------------------------------------------
# Identificar colunas categóricas
categorical_cols = ["code_module", "gender", "region", "highest_education", "imd_band", "age_band", "disability", "assessment_type", "final_result","is_banked"]
# Selecionar features numericas
numeric_cols =["date_submitted","num_of_prev_attempts", "sum_click","date","studied_credits", "weight","score"]

# %%
for col in numeric_cols:
    print(f"Coluna: {col}")
    print(dfs[col].unique())  # Mostra valores únicos
    print("-" * 40)

for col in categorical_cols:
    print(f"Coluna: {col}")
    print(dfs[col].unique())  # Mostra valores únicos
    print("-" * 40)


# %%
# --------------------------------------------------------------
# Normalização do data set
# --------------------------------------------------------------

# Substituir '?' por NaN
dfs.replace('?', np.nan, inplace=True)

# --------------------------------------------------------------
# numeric_cols
# --------------------------------------------------------------

# Converter colunas numéricas corretamente
dfs[numeric_cols] = dfs[numeric_cols].apply(pd.to_numeric, errors='coerce')

# Preencher valores NaN com a média da respetiva coluna
dfs[numeric_cols] = dfs[numeric_cols].fillna(dfs[numeric_cols].mean())

# --------------------------------------------------------------
# categorical_cols
# --------------------------------------------------------------

# Fazer a moda nas linhas com NaN
for col in categorical_cols:
    mode_value = dfs[col].mode()[0]  # Obtém a moda (valor mais frequente)
    dfs[col].fillna(mode_value, inplace=True)  # Preenche os NaN com a moda

# Remover linhas com 'Withdrawn'
dfs = dfs.loc[dfs['final_result'] != 'Withdrawn']

# Substituir 'Distinction' por 'Pass'
dfs['final_result'] = dfs['final_result'].replace('Distinction', 'Pass')



# %%
for col in numeric_cols:
    print(f"Coluna: {col}")
    print(dfs[col].unique())  # Mostra valores únicos
    print("-" * 40)

for col in categorical_cols:
    print(f"Coluna: {col}")
    print(dfs[col].unique())  # Mostra valores únicos
    print("-" * 40)

# %%
# ---------------------------------
# EDA Univariate Analysis 
# Visualização com Boxplot
# ---------------------------------
for col in numeric_cols:
    print(col)
    print('Skew :', round(dfs[col].skew(), 2))
    plt.figure(figsize = (15, 4))
    plt.subplot(1, 2, 1)
    dfs[col].hist(grid=False)
    plt.ylabel('count')
    plt.subplot(1, 2, 2)
    sns.boxplot(x=dfs[col])
    plt.savefig(f"{col}boxplot.png", dpi=300, bbox_inches='tight')
    plt.show()


# %%
'''# ---------------------------------
# EDA Analysis 
# Visualização com Pieplot
# ---------------------------------
# Configuração para exibir os gráficos
plt.figure(figsize=(20, 15))

# Criar os gráficos de pizza
for i, col in enumerate(categorical_cols, 1):
    plt.subplot(4, 3, i)  # Organizar os gráficos em uma grade 3x4
    # Contar a frequência das categorias
    counts = dfs[col].value_counts()
    # Criar o gráfico de pizza
    plt.pie(counts, labels=counts.index, autopct='%1.1f%%', startangle=90, colors=sns.color_palette('Set2', len(counts)))
    plt.title(f'Distribuição de {col}')
    
# Ajuste o layout
plt.tight_layout()

# Exibir os gráficos
plt.savefig(f"pieplot.png", dpi=300, bbox_inches='tight')
plt.show()'''

# %%
# ---------------------------------
# EDA Bivariate Analysis 
# Visualização com Countplot
# ---------------------------------

# Configuração para exibir os gráficos
plt.figure(figsize=(15, 10))

# Criar os gráficos
for i, col in enumerate(categorical_cols, 1):
    plt.subplot(3, 4, i)  # Organizar os gráficos em uma grade 3x4
    sns.countplot(data=dfs, x=col, hue=col, palette='Set2', legend=False)  # Adicionando hue
    plt.title(f'Distribuição de {col}')
    plt.xticks(rotation=90)  # Rotacionar os rótulos do eixo x, se necessário

# Ajuste o layout
plt.tight_layout()

# Exibir os gráficos
plt.savefig(f"countplot.png", dpi=300, bbox_inches='tight')
plt.show()

# %%
# --------------------------------------------------------------
# Normalização das Features numéricas para SVM
# --------------------------------------------------------------

scaler = StandardScaler()
dfs[numeric_cols] = scaler.fit_transform(dfs[numeric_cols])



# %%
# --------------------------------------------------------------
# Normalização das Features categóricas para SVM
# --------------------------------------------------------------

# Aplicar Label Encoding
for col in categorical_cols:
    dfs[col] = LabelEncoder().fit_transform(dfs[col])

print(dfs.dtypes)
print(dfs.head())


# %%
# ---------------------------------
# EDA Multivariate Analysis
# Visualização com Heatmap
# ---------------------------------
# Calcular a correlação do DataFrame
corr_matrix = dfs.corr()

# Criar o gráfico de calor
plt.figure(figsize=(12, 7))
sns.heatmap(corr_matrix, annot=True, vmin=-1, vmax=1)

# Salvar a figura
plt.savefig("heatmap.png", dpi=300, bbox_inches='tight')

# Mostrar o gráfico
plt.show()

# %%
# ---------------------------------
# EDA Bivariate Analysis 
# Visualização com Pairplot
# ---------------------------------
df = dfs[[
    "assessment_type", "region", "highest_education", "imd_band", "date_submitted", "sum_click", "studied_credits", "weight", "score", "final_result"
]].copy()

# Garantir que não há valores nulos (pairplot pode dar erro com NaNs)
df = df.dropna()

# Visualização com Pairplot
sns.pairplot(df, hue="final_result", palette="viridis")
plt.savefig("pairplot.png", dpi=300, bbox_inches='tight')
plt.show()

# %%
# --------------------------------------------------------------
# Split feature subsets
# --------------------------------------------------------------

X = dfs.drop(columns="final_result")
y = dfs["final_result"]



# %%
# --------------------------------------------------------------
# Create a training and test set
# --------------------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print(X_train.dtypes)
print ('Train set:', X_train.shape,  y_train.shape)
print ('Test set:', X_test.shape,  y_test.shape)


# %%
# --------------------------------------------------------------
# Treinamento do modelo SVM
# --------------------------------------------------------------
svm = SVC() 
svm.fit(X_train, y_train)





# %%
# --------------------------------------------------------------
# Treinamento do modelo Random Forest
# --------------------------------------------------------------
rf = RandomForestClassifier()
rf.fit(X_train, y_train)


# %%
# --------------------------------------------------------------
# Treino do modelo Rede Neuronal
# --------------------------------------------------------------




# %%
# --------------------------------------------------------------
# Grid search for best hyperparameters and model selection
# --------------------------------------------------------------

# %%
# --------------------------------------------------------------
# Create a grouped bar plot to compare the results
# --------------------------------------------------------------

# %%
# --------------------------------------------------------------
# Select best model and evaluate results
# --------------------------------------------------------------

# %%
# --------------------------------------------------------------
# Select train and test data based on participant
# --------------------------------------------------------------

# %%




# %%

# --------------------------------------------------------------
# Use best model again and evaluate results
# --------------------------------------------------------------



# %%

# --------------------------------------------------------------
# Try a simpler model with the selected features
# --------------------------------------------------------------
