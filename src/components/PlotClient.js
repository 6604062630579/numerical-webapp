"use client";

import dynamic from "next/dynamic";

// ✅ ใช้ plotly.js-basic-dist แทนตัวเต็ม
const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => <p>Loading chart...</p>,
});

export default function PlotClient(props) {
  return <Plot {...props} config={{ displaylogo: false, scrollZoom: true }} />;
}
