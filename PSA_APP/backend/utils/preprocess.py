import pandas as pd
import joblib
from PSA_APP.backend.config import categorical_features, numerical_features, coluna_ordem_segura
from PSA_APP.backend.config import base_path

encoders = joblib.load(f"{base_path}/PSA_APP/backend/predict_model_encoders/encoders.pkl")
scaler = joblib.load(f"{base_path}/PSA_APP/backend/predict_model_encoders/scaler.pkl")

def preprocess_data(df):

    for col in coluna_ordem_segura:
        if col == 'date' and df[col].isnull().any():
            df[col].fillna(222.0, inplace=True)
        if col == 'code_module' and df[col].isnull().any():
            df[col].fillna("AAA", inplace=True)
    for col in coluna_ordem_segura:
        if col not in df.columns:
            df[col] = pd.NA
    df = df[[col for col in coluna_ordem_segura if col in df.columns]]
    for col in categorical_features:
        encoder = encoders[col]
        df[col] = encoder.transform(df[col])
    df[numerical_features] = scaler.transform(df[numerical_features])
    return df


def preprocess_data_file(df, isRaw):
    

    if isRaw:
        for col in categorical_features:
            encoder = encoders[col]
            df[col] = encoder.fit_transform(df[col])
        df[numerical_features] = scaler.transform(df[numerical_features])
    
    df = df[[col for col in coluna_ordem_segura if col in df.columns]]
    
    return df