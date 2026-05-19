# Stage 1: Build the React frontend
FROM node:20 AS frontend-builder
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the FastAPI backend and package the frontend
FROM python:3.10-slim
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend files
COPY backend/ .

# Copy built frontend assets from Stage 1 into the backend's dist folder
COPY --from=frontend-builder /frontend/dist ./dist

# Run the training script to generate the model
RUN python ml/train.py

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
