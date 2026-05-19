from sqlalchemy import Column, Integer, String, Float, DateTime
from database import Base
import datetime

class ScanHistory(Base):
    __tablename__ = "scan_history"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, index=True)
    verdict = Column(String)  # Safe, Suspicious, Phishing
    confidence_score = Column(Float)
    scan_date = Column(DateTime, default=datetime.datetime.utcnow)
