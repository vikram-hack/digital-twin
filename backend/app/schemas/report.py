from pydantic import BaseModel
from typing import List, Optional, Any

class ReportSection(BaseModel):
    title: str
    content: str
    data: Optional[Any] = None

class ReportRequest(BaseModel):
    simulation_id: Optional[str] = None
    include_ai_analysis: bool = True
    format: str = "json" # json or pdf

class ReportResponse(BaseModel):
    report_id: str
    generated_at: str
    title: str
    sections: List[ReportSection]
