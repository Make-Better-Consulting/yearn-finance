import React, { useState } from "react";
import { Typography } from "@material-ui/core";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
  Tooltip
} from "recharts";
import { formatCurrency } from "../../utils";

import BigNumber from "bignumber.js";

import classes from "./dashboardSplitGraph.module.css";

function CustomTooltip({ payload, active }) {
  if (active && payload && payload.length > 0) {
    return (
      <div className={classes.tooltipContainer}>
        <div className={classes.tooltipValue}>
          <Typography className={classes.val}>
            {payload[0].payload.symbol}
          </Typography>
          <Typography className={classes.valBold}>
            {formatCurrency(payload[0].payload.value)}
          </Typography>
        </div>
      </div>
    );
  }

  return null;
}

export default function VaultSplitGraph({ vaults }) {

  const [activeIndex, setActiveIndex] = useState(0);

  const data = vaults
    .filter(vault => {
      return BigNumber(vault.balanceUSD).gt(0);
    })
    .map(vault => {
      return {
        address: vault.address,
        icon: vault.icon,
        displayName: vault.displayName,
        symbol: vault.symbol,
        value: BigNumber(vault.balanceUSD).toNumber()
      };
    });

  const COLORS = [
    "#003f5c",
    "#2f4b7c",
    "#665191",
    "#a05195",
    "#d45087",
    "#f95d6a",
    "#ff7c43",
    "#ffa600"
  ];
  const onPieEnter = (data, index) => {
    setActiveIndex(index);
  };

  return (
    <div className={classes.vaultPerformanceGraph}>
      <ResponsiveContainer width={100} height={130}>
        <PieChart width={100} height={100}>
          <Pie
            activeIndex={activeIndex}
            data={data}
            cx={45}
            cy={45}
            innerRadius={30}
            outerRadius={50}
            fill="#FF0000"
            stroke="none"
            dataKey="value"
            onMouseMove={onPieEnter}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
