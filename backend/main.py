from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from sqlalchemy.orm import Session
from typing import List
import joblib
import os
import numpy as np
import pandas as pd
import hashlib
import secrets
import hmac
import time
import base64

import models
from database import engine, get_db
from ml.features import extract_features, get_feature_names

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="PhishGuard API")

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication Cryptography Settings
SECRET_KEY = "phishguard_secret_cyber_key_development_only"

def hash_password(password: str, salt: str = None) -> tuple[str, str]:
    if not salt:
        salt = secrets.token_hex(16)
    hashed = hashlib.sha256((password + salt).encode('utf-8')).hexdigest()
    return hashed, salt

def verify_password(password: str, salt: str, hashed: str) -> bool:
    re_hashed, _ = hash_password(password, salt)
    return re_hashed == hashed

def generate_token(user_id: int) -> str:
    expiry = int(time.time()) + 3600 * 24  # 24 hours validity
    payload = f"{user_id}:{expiry}"
    signature = hmac.new(SECRET_KEY.encode(), payload.encode(), hashlib.sha256).hexdigest()
    token_str = f"{payload}:{signature}"
    return base64.b64encode(token_str.encode()).decode()

def verify_token(token: str) -> int | None:
    try:
        decoded = base64.b64decode(token.encode()).decode()
        parts = decoded.split(":")
        if len(parts) != 3:
            return None
        user_id_str, expiry_str, signature = parts
        payload = f"{user_id_str}:{expiry_str}"
        
        expected_signature = hmac.new(SECRET_KEY.encode(), payload.encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(signature, expected_signature):
            return None
            
        if time.time() > int(expiry_str):
            return None
            
        return int(user_id_str)
    except Exception:
        return None

def get_current_user_id(authorization: str = Header(None)) -> int | None:
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = authorization.split(" ")[1]
    return verify_token(token)

# Load the trained model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "ml", "model.joblib")
try:
    model = joblib.load(MODEL_PATH)
except Exception as e:
    print(f"Warning: Model not found at {MODEL_PATH}. Run train.py first.")
    model = None

class ScanRequest(BaseModel):
    url: str

class BatchScanRequest(BaseModel):
    urls: List[str]

class RegisterRequest(BaseModel):
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    class Config:
        from_attributes = True


class ScanResult(BaseModel):
    url: str
    verdict: str
    confidence_score: float
    features: dict

def analyze_url(url: str) -> ScanResult:
    # 1. Extract features
    features_dict = extract_features(url)
    
    # Check if model is loaded
    if not model:
        raise HTTPException(status_code=500, detail="ML model is not loaded. Please train the model.")

    # 2. Prepare data for model prediction
    feature_names = get_feature_names()
    # Ensure correct order
    feature_values = [features_dict.get(fname, 0) for fname in feature_names]
    
    # 3. Predict
    # Scikit-learn expects 2D array
    X = pd.DataFrame([feature_values], columns=feature_names)
    
    # Probabilities: [prob_safe, prob_phishing]
    probabilities = model.predict_proba(X)[0]
    prob_phishing = probabilities[1]
    
    # Determine verdict and confidence
    confidence_score = prob_phishing * 100
    if confidence_score > 70:
        verdict = "Phishing"
    elif confidence_score > 30:
        verdict = "Suspicious"
    else:
        verdict = "Safe"
        
    return ScanResult(
        url=url,
        verdict=verdict,
        confidence_score=round(confidence_score, 2),
        features=features_dict
    )

@app.post("/api/scan", response_model=ScanResult)
def scan_url(request: ScanRequest, db: Session = Depends(get_db), current_user_id: int = Depends(get_current_user_id)):
    result = analyze_url(request.url)
    
    # Save to history
    db_scan = models.ScanHistory(
        url=result.url,
        verdict=result.verdict,
        confidence_score=result.confidence_score,
        user_id=current_user_id
    )
    db.add(db_scan)
    db.commit()
    db.refresh(db_scan)
    
    return result

@app.post("/api/batch-scan", response_model=List[ScanResult])
def batch_scan_urls(request: BatchScanRequest, db: Session = Depends(get_db), current_user_id: int = Depends(get_current_user_id)):
    results = []
    for url in request.urls:
        result = analyze_url(url)
        results.append(result)
        
        db_scan = models.ScanHistory(
            url=result.url,
            verdict=result.verdict,
            confidence_score=result.confidence_score,
            user_id=current_user_id
        )
        db.add(db_scan)
    
    db.commit()
    return results

@app.get("/api/history")
def get_history(limit: int = 50, db: Session = Depends(get_db), current_user_id: int = Depends(get_current_user_id)):
    query = db.query(models.ScanHistory)
    if current_user_id:
        query = query.filter(models.ScanHistory.user_id == current_user_id)
    else:
        query = query.filter(models.ScanHistory.user_id == None)
    scans = query.order_by(models.ScanHistory.scan_date.desc()).limit(limit).all()
    return scans

@app.get("/api/stats")
def get_stats(db: Session = Depends(get_db), current_user_id: int = Depends(get_current_user_id)):
    query = db.query(models.ScanHistory)
    if current_user_id:
        query = query.filter(models.ScanHistory.user_id == current_user_id)
    else:
        query = query.filter(models.ScanHistory.user_id == None)
        
    total_scans = query.count()
    phishing_count = query.filter(models.ScanHistory.verdict == "Phishing").count()
    safe_count = query.filter(models.ScanHistory.verdict == "Safe").count()
    suspicious_count = query.filter(models.ScanHistory.verdict == "Suspicious").count()
    
    return {
        "total_scans": total_scans,
        "phishing_detected": phishing_count,
        "safe_urls": safe_count,
        "suspicious_urls": suspicious_count,
        "detection_rate": round((phishing_count / total_scans * 100) if total_scans > 0 else 0, 1)
    }

# Auth Endpoints
@app.post("/api/auth/register")
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == request.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pwd, salt = hash_password(request.password)
    db_user = models.User(
        email=request.email,
        hashed_password=hashed_pwd,
        salt=salt
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    token = generate_token(db_user.id)
    return {"token": token, "email": db_user.email}

@app.post("/api/auth/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == request.email).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    if not verify_password(request.password, db_user.salt, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    token = generate_token(db_user.id)
    return {"token": token, "email": db_user.email}

@app.get("/api/auth/me", response_model=UserResponse)
def get_me(db: Session = Depends(get_db), current_user_id: int = Depends(get_current_user_id)):
    if not current_user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")
    db_user = db.query(models.User).filter(models.User.id == current_user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


# Serve frontend static files
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

frontend_dist_path = os.path.join(os.path.dirname(__file__), "dist")
if os.path.exists(frontend_dist_path):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist_path, "assets")), name="static")

    @app.get("/{catchall:path}")
    def read_index(catchall: str):
        if catchall.startswith("api"):
            raise HTTPException(status_code=404, detail="Not Found")
        index_file = os.path.join(frontend_dist_path, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        raise HTTPException(status_code=404, detail="Frontend index.html not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
