import { NextResponse } from "next/server";
import { evaluate } from "mathjs";

export async function POST(req) {
  try {
    const { expr, a, b, tol = 1e-6, maxIter = 50 } = await req.json();
    const f = (x) => evaluate(expr, { x });

    let left = Number(a);
    let right = Number(b);
    let mid = null;
    let prevMid = null;
    const iterations = [];

    if (f(left) * f(right) > 0) {
      return NextResponse.json({
        error: `f(${left})=${f(left)}, f(${right})=${f(
          right
        )} → error no root between [${left}, ${right}]`,
      });
    }

    mid = (left + right) / 2;
    iterations.push({
      iteration: 0,
      x: Number(mid.toFixed(6)),
      fx: Number(f(mid).toFixed(6)),
      errorPercent: null,
    });

    if (f(left) * f(mid) < 0) right = mid;
    else left = mid;
    prevMid = mid;

    for (let i = 1; i <= maxIter; i++) {
      mid = (left + right) / 2;
      const fx = f(mid);

      let errPercent = null;
      if (prevMid !== 0) {
        errPercent = Math.abs((mid - prevMid) / prevMid) * 100;
      }

      iterations.push({
        iteration: i,
        x: Number(mid.toFixed(6)),
        fx: Number(fx.toFixed(6)),
        errorPercent:
          errPercent !== null ? Number(errPercent.toFixed(6)) : null,
      });

      if ((errPercent !== null && errPercent < tol) || Math.abs(fx) < tol)
        break;

      if (f(left) * fx < 0) right = mid;
      else left = mid;

      prevMid = mid;
    }
    const xValues = iterations.map((it) => it.x);
    const minX = Math.min(...xValues) - 0.1; // ขยายขอบซ้ายเล็กน้อย
    const maxX = Math.max(...xValues) + 0.1;
    const xs = [];
    const ys = [];
    const steps = 200;

    for (let i = 0; i <= steps; i++) {
      const x = minX + (i * (maxX - minX)) / steps;
      xs.push(Number(x.toFixed(6)));
      ys.push(Number(f(x).toFixed(6)));
    }

    return NextResponse.json({
      root: Number(mid.toFixed(6)),
      tol,
      iterations,
      curve: { x: xs, y: ys },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
