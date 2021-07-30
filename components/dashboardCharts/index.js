import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

const data = [
  {
    name: "Page A",
    Market: 10,
    Profit: 0,
    Value: 100
  },
  {
    name: "Page B",
    Market: 200,
    Profit: 1398,
    Value: 2210
  },
  {
    name: "Page C",
    Market: 2000,
    Profit: 9800,
    Value: 2290
  },
  {
    name: "Page D",
    Market: 2780,
    Profit: 3908,
    Value: 2000
  },
  {
    name: "Page E",
    Market: 1890,
    Profit: 4800,
    Value: 2181
  },
  {
    name: "Page F",
    Market: 2390,
    Profit: 3800,
    Value: 2500
  },
  {
    name: "Page G",
    Market: 3490,
    Profit: 4300,
    Value: 2100
  }
];

export default function App() {
  return (
    <AreaChart
      width={640}
      height={345}
      data={data}
      margin={{
        top: 10,
        right: 30,
        left: 0,
        bottom: 0
      }}
    >
      <CartesianGrid stroke="rgba(128,128,128,0.5)" strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Area
        type="monotone"
        dataKey="Market"
        stackId="1"
        stroke="#7a2cda"
        fill="#7a2cda"
      />
      <Area
        type="monotone"
        dataKey="Profit"
        stackId="1"
        stroke="#4aa166"
        fill="#4aa166"
      />
      <Area
        type="monotone"
        dataKey="Value"
        stackId="1"
        stroke="#1890ff"
        fill="#1890ff"
      />
      <Legend

      />
    </AreaChart>
  );
}
