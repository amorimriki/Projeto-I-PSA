from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd

app = Flask(__name__)
CORS(app)  # Ativa o CORS para todas as rotas

model = pickle.load(open("model.pkl", "rb"))
preprocessor = pickle.load(open("preprocess.pkl", "rb"))

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    df = pd.DataFrame([data])
    X = preprocessor.transform(df)
    prediction = model.predict(X)
    return jsonify({"prediction": prediction[0]})

if __name__ == "__main__":
    app.run(debug=True)
