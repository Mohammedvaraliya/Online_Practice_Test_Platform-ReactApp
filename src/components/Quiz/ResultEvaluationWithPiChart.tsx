import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { ResultEvaluationWithPiChartProps } from "../../types";

const COLORS = ["#4CAF50", "#FF9800", "#03A9F4", "#E91E63", "#9C27B0"];

const ResultEvaluationWithPiChart: React.FC<
  ResultEvaluationWithPiChartProps
> = ({ data }) => {
  return (
    <div className="w-full md:w-full lg:w-full xl:w-4/5 mx-auto bg-dark-3 p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold text-white text-center mb-4">
        Performance Breakdown 📊
      </h3>
      <PieChart
        series={[
          {
            data: data.map((item, index) => ({
              ...item,
              color: COLORS[index % COLORS.length], // Assign dynamic colors
            })),
            outerRadius: 140,
            innerRadius: 50,
            highlightScope: { faded: "global", highlighted: "item" },
            faded: { innerRadius: 50, additionalRadius: -20, color: "gray" },
          },
        ]}
        tooltip={{ trigger: "item" }}
        height={500}
        slotProps={{
          legend: {
            direction: "row",
            position: { vertical: "bottom", horizontal: "middle" },
            padding: 20,
            labelStyle: {
              fontSize: 16,
              fill: "white",
            },
          },
        }}
        margin={{ top: 0, bottom: 50, left: 0, right: 0 }}
      />
    </div>
  );
};

export default ResultEvaluationWithPiChart;
