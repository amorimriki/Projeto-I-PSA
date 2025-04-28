from pydantic import BaseModel
from typing import List, Literal

class HistoricoItem(BaseModel):
    dataHora: str
    tipo: Literal["formulario", "ficheiro"]
    modelo: str
    total: int
    resultado: str

class StudentInput(BaseModel):
    n_student: str
    code_module: str = None
    gender: str = None
    region: str = None
    highest_education: str = None
    imd_band: str = None
    age_band: str = None
    disability: str = None
    assessment_type: str = None
    is_banked: str = None
    date_submitted: float = None
    num_of_prev_attempts: float = None
    sum_click: float = None
    date: float = None
    studied_credits: float = None
    weight: float = None
    score: float = None