"use client";
import dynamic from "next/dynamic";
import createPlotlyComponent from "react-plotly.js/factory";
import Plotly from "plotly.js-basic-dist";

const Plot = createPlotlyComponent(Plotly);
const DynamicPlot = dynamic(
  () => Promise.resolve((props) => <Plot {...props} />),
  { ssr: false }
);

export default function PlotClient(props) {
  return (
    <DynamicPlot {...props} config={{ displaylogo: false, scrollZoom: true }} />
  );
}
