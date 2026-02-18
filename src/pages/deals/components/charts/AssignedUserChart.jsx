import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  LabelList,
} from "recharts";
import { motion } from "framer-motion";

const COLORS = [
  "#6366F1",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
  "#8B5CF6",
];

const AssignedUserChart = ({ leads = [] }) => {
  const chartData = useMemo(() => {
    const grouped = {};

    leads.forEach((lead) => {
      const user = lead.assignedUserName || "Unassigned";
      if (!grouped[user]) grouped[user] = 0;
      grouped[user] += 1;
    });

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [leads]);

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <motion.div
      className="bg-card border border-border rounded-xl p-6 shadow-elevation-1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-lg font-semibold mb-1">
        Leads by Assigned User
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        Lead distribution across sales team
      </p>

      <div className="h-[360px]">
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No Data Available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
              barCategoryGap="25%"
            >
              {/* Subtle grid */}
              <CartesianGrid
                strokeDasharray="3 3"
                strokeOpacity={0.3}
              />

              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                type="category"
                dataKey="name"
                width={140}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  borderRadius: "10px",
                  border: "none",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                }}
              />

              <Bar
                dataKey="value"
                radius={[0, 12, 12, 0]}
                barSize={28}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      index === 0
                        ? "#4F46E5" // highlight top performer
                        : COLORS[index % COLORS.length]
                    }
                  />
                ))}

                {/* Value labels */}
                <LabelList
                  dataKey="value"
                  position="right"
                  style={{ fontSize: 12 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-border text-sm font-semibold">
        Total Leads: {total}
      </div>
    </motion.div>
  );
};

export default AssignedUserChart;
