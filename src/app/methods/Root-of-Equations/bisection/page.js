"use client";
import { useState } from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import Plot from "react-plotly.js";
import PlotClient from "@/components/PlotClient";

export default function BisectionPage() {
  const [expr, setExpr] = useState("x^5 - x + 1");
  const [a, setA] = useState(-2);
  const [b, setB] = useState(-1);
  const [precision, setPrecision] = useState(6);
  const [result, setResult] = useState(null);

  const handleCalculate = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/Root-of-Equations/bisection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        expr,
        a: Number(a),
        b: Number(b),
        tol: Math.pow(10, -precision),
      }),
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold text-center mb-4">
        🪓 Bisection Method
      </h1>

      {/* สมการ */}
      <div className="border p-4 rounded bg-gray-50 text-center mb-4 text-2xl">
        <BlockMath math={`f(x) = ${expr}`} />
      </div>

      {/* Form */}
      <form
        onSubmit={handleCalculate}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
      >
        <div>
          <label className="block">X Start</label>
          <input
            type="number"
            value={a}
            onChange={(e) => setA(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block">X End</label>
          <input
            type="number"
            value={b}
            onChange={(e) => setB(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block">Error threshold ε</label>
          <input
            type="number"
            min="1"
            max="10"
            step="1"
            value={precision}
            onChange={(e) => setPrecision(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block">f(x)</label>
          <input
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>
        <button
          type="submit"
          className="col-span-2 md:col-span-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Calculate!
        </button>
      </form>

      {/* แสดงผล */}
      {result && !result.error && (
        <>
          {/* Graph */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Graph</h2>
            {(() => {
              // ✅ เรียงจากซ้ายไปขวา ไม่สนลำดับ iteration
              const sortedData = [...result.iterations].sort(
                (a, b) => a.x - b.x
              );
              return (
                <PlotClient
                  data={[
                    {
                      x: sortedData.map((it) => it.x),
                      y: sortedData.map((it) => it.fx),
                      type: "scatter",
                      mode: "lines+markers",
                      line: { color: "green" },
                      marker: { color: "red", size: 8 },
                      name: "Bisection steps",
                    },
                  ]}
                  layout={{
                    autosize: true,
                    height: 400,
                    margin: { t: 30, r: 20, l: 40, b: 40 },
                    hovermode: "closest",
                    dragmode: "pan",
                  }}
                  style={{ width: "100%" }}
                />
              );
            })()}
          </div>

          {/* Table */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Table</h2>
            <table className="w-full border-collapse border text-center">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">Iter</th>
                  <th className="border p-2">xₖ</th>
                  <th className="border p-2">f(xₖ)</th>
                  <th className="border p-2">Error %</th>
                </tr>
              </thead>
              <tbody>
                {result.iterations.map((it) => (
                  <tr key={it.iteration}>
                    <td className="border p-2">{it.iteration}</td>
                    <td className="border p-2">{it.x.toFixed(6)}</td>
                    <td className="border p-2">{it.fx.toFixed(6)}</td>
                    <td className="border p-2">
                      {it.errorPercent == null
                        ? "-"
                        : it.errorPercent.toFixed(6) + "%"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-sm text-gray-600">
              Total number of iterations: {result.iterations.length}
            </p>
          </div>
        </>
      )}

      {result?.error && <p className="text-red-600 mt-4">{result.error}</p>}
    </div>
  );
}
