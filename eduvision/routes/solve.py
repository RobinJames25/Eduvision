from fastapi import APIRouter, Depends
from pydantic import BaseModel
from ..services.solve_service import solve_equation

router = APIRouter()

class SolveRequest(BaseModel):
    equation: str

@router.post("/")
def solve(data: SolveRequest):
    solution = solve_equation(data.equation)
    return {"solution": solution}
