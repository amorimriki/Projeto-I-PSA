#!/bin/bash

echo "🔁 A iniciar o ambiente Python..."

cd backend || exit

# Cria virtualenv se não existir
if [ ! -d "venv" ]; then
  python3 -m venv venv
fi

# Ativa o virtualenv
source venv/bin/activate

# Instala dependências do backend
echo "📦 A instalar dependências do backend..."
pip install --upgrade pip
pip install -r requirements.txt

echo "✅ Ambiente virtual ativo."
echo "🚀 A iniciar o servidor Flask..."
# Inicia o servidor Flask em segundo plano
python app.py &

# Inicia o servidor React
cd ../frontend || exit
echo "🚀 A iniciar o servidor React..."
npm start
