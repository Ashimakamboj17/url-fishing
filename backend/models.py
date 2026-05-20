from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    salt = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    scans = relationship("ScanHistory", back_populates="user")

class ScanHistory(Base):
    __tablename__ = "scan_history"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, index=True)
    verdict = Column(String)  # Safe, Suspicious, Phishing
    confidence_score = Column(Float)
    scan_date = Column(DateTime, default=datetime.datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    user = relationship("User", back_populates="scans")

