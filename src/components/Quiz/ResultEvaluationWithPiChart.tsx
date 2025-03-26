import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { ResultEvaluationWithPiChartProps } from "../../types";

const ResultEvaluationWithPiChart: React.FC<
  ResultEvaluationWithPiChartProps
> = ({ data }) => {
  return (
    <>
      <div className="w-full md:w-full lg:w-full xl:w-4/5 mx-auto">
        <PieChart
          series={[
            {
              data,
              outerRadius: 130,
              highlightScope: { faded: "global", highlighted: "item" },
              faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
              color: "white",
            },
          ]}
          tooltip={{ trigger: "item" }}
          height={600}
          slotProps={{
            legend: {
              direction: "row",
              position: { vertical: "bottom", horizontal: "middle" },
              padding: 25,
              labelStyle: {
                fontSize: 18,
                fill: "white",
              },
            },
          }}
          margin={{ top: 0, bottom: 50, left: 0, right: 0 }}
        />
      </div>
    </>
  );
};

export default ResultEvaluationWithPiChart;
