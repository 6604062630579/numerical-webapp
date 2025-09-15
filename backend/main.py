from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict
from sympy import symbols, sympify, lambdify

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello Numerical WebApp!"}

@app.get("/bisection")
def bisection(expr: str, a: float, b: float, tol: float = 0.001, max_iter: int = 100):
    x = symbols("x")
    try:
        sympy_expr = sympify(expr)
        f = lambdify(x, sympy_expr, "math")
    except Exception as e:
        return {"error": f"Invalid expression: {str(e)}"}

    if f(a) * f(b) > 0:
        return {"error": "f(a) and f(b) must have opposite signs."}

    iterations: List[Dict] = []
    prev_c = None
    for i in range(1, max_iter + 1):
        c = (a + b) / 2
        fx = f(c)
        error = None
        if prev_c is not None:
            error = abs((c - prev_c) / c) * 100
        iterations.append({"iteration": i, "x": c, "fx": fx, "error": error})
        if fx == 0 or (b - a) / 2 < tol:
            return {"root": c, "iterations": iterations}
        if f(a) * fx < 0:
            b = c
        else:
            a = c
        prev_c = c

    return {"root": c, "iterations": iterations, "warning": "Max iterations reached"}
