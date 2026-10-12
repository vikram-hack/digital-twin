from sqlalchemy import Column, String
from app.database.engine import Base

class MitreTechnique(Base):
    __tablename__ = "mitre_techniques"

    id = Column(String, primary_key=True, index=True)
    technique_id = Column(String, index=True) # T####
    name = Column(String)
    tactic = Column(String)
    description = Column(String)
    detection = Column(String)
