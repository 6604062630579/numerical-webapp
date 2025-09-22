"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [category, setCategory] = useState("");
  const [method, setMethod] = useState("");
  const [precision, setPrecision] = useState(6);

  const categories = {
    "Root of Equations": {
      "Graphical Method": "/methods/Root-of-Equations/graphical",
      "Bisection Method": "/methods/Root-of-Equations/bisection",
      "False-Position Method": "/methods/Root-of-Equations/false-position",
      "One-Point Iteration Method": "/methods/Root-of-Equations/one-point",
      "Newton-Raphson Method": "/methods/Root-of-Equations/newton",
      "Secant Method": "/methods/Root-of-Equations/secant",
    },
    "Linear Algebraic Equations": {
      "Cramer's Rule": "/methods/Linear-Algebraic-Equations/cramer",
      "Gauss Elimination":
        "/methods/Linear-Algebraic-Equations/gauss-elimination",
      "Gauss Jordan Elimination":
        "/methods/Linear-Algebraic-Equations/gauss-jordan",
      "Matrix Inversion":
        "/methods/Linear-Algebraic-Equations/matrix-inversion",
      "LU Decomposition Method":
        "/methods/Linear-Algebraic-Equations/lu-decomposition",
      "Jacobi Iteration Method": "/methods/Linear-Algebraic-Equations/jacobi",
      "Conjugate Gradient Method":
        "/methods/Linear-Algebraic-Equations/conjugate-gradient",
    },
    Interpolation: {
      "Newton's Divided-Difference": "/methods/Interpolation/newton-divided",
      "Lagrange Interpolation": "/methods/Interpolation/lagrange",
      "Spline Interpolation": "/methods/Interpolation/spline",
    },
    Extrapolation: {
      "Simple Regression": "/methods/Extrapolation/simple-regression",
      "Multiple Regression": "/methods/Extrapolation/multiple-regression",
    },
    Integration: {
      "Trapezoidal Rule": "/methods/Integration/trapezoidal",
      "Composite Trapezoidal Rule":
        "/methods/Integration/composite-trapezoidal",
      "Simpson Rule": "/methods/Integration/simpson",
      "Composite Simpson Rule": "/methods/Integration/composite-simpson",
    },
    Differentiation: {
      "Numerical Differentiation": "/methods/Differentiation/numerical",
    },
  };

  const handleStart = () => {
    if (category && method) {
      router.push(`${categories[category][method]}?precision=${precision}`);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2">
          Numerical Methods
        </h1>
        <p className="text-black text-center mb-6">
          Choose a type of problem, method, and precision to get started
        </p>

        {/* Dropdown Category */}
        <label className="block mb-2 font-medium">type of problem</label>
        <select
          className="w-full border rounded-lg p-2 mb-4"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setMethod("");
          }}
        >
          <option value="">Select type of problem</option>
          {Object.keys(categories).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Dropdown Method */}
        <label className="block mb-2 font-medium">Method</label>
        <select
          className="w-full border rounded-lg p-2 mb-4"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          disabled={!category}
        >
          <option value="">
            {category ? "Select method" : "Select type of problem first"}
          </option>
          {category &&
            Object.keys(categories[category]).map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
        </select>

        {/* Precision */}
        <label className="block mb-2 font-medium">Precision</label>
        <input
          type="number"
          min="1"
          max="10"
          step="1"
          className="w-full border rounded-lg p-2 mb-2"
          value={precision}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            if (val >= 1 && val <= 10) setPrecision(val);
          }}
        />

        {/* ปุ่ม Start */}
        <button
          className={`w-full py-2 rounded-lg text-white ${
            category && method
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-300 cursor-not-allowed"
          }`}
          disabled={!category || !method}
          onClick={handleStart}
        >
          Start
        </button>
      </div>
    </main>
  );
}
