#!/bin/bash

echo "🔁 A iniciar o ambiente Python..."
cd backend
if [ ! -d "venv" ]; then
  python3 -m venv venv
fi
source venv/bin/activate

echo "📦 A instalar dependências do backend..."
pip install -r requirements.txt

echo "🚀 A iniciar o servidor Flask..."
python app.py &
cd ../frontend

echo "📦 A instalar dependências do frontend..."
npm install

echo "🌐 A iniciar o frontend React..."
npm start
