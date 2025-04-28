#!/bin/bash

echo "🔁 A iniciar o ambiente Python..."

# Caminho para a raiz do projeto
PROJECT_ROOT="/Users/amorimriki/Documents/GitHub/Projeto-I-PSA"
BACKEND_DIR="$PROJECT_ROOT/PSA_APP/backend"
FRONTEND_DIR="$PROJECT_ROOT/PSA_APP/frontend"

# Vai para a pasta do backend
cd "$BACKEND_DIR" || exit

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
echo "🚀 A iniciar o servidor FastAPI..."

# Volta para a raiz e inicia o servidor FastAPI em segundo plano
cd "$PROJECT_ROOT" || exit
uvicorn PSA_APP.backend.main:app --reload &

# Vai para o frontend e inicia o servidor React
cd "$FRONTEND_DIR" || exit
echo "🚀 A iniciar o servidor React..."
npm start
