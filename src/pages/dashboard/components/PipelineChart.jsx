import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const PipelineChart = ({ leads = [] }) => {
  // const [selectedYear, setSelectedYear] = useState(2024);
  const [viewType, setViewType] = useState("monthly");
  const now = new Date();
  const currentYearLeads = leads.filter((l) => {
    const d = new Date(l.createdAt);
    return (
      d.getFullYear() === now.getFullYear()
    );
  }).length;

  // const chartData = [
  //   { month: 'Jan', deals: 45, revenue: 125000 },
  //   { month: 'Feb', deals: 52, revenue: 142000 },
  //   { month: 'Mar', deals: 48, revenue: 138000 },
  //   { month: 'Apr', deals: 61, revenue: 165000 },
  //   { month: 'May', deals: 55, revenue: 158000 },
  //   { month: 'Jun', deals: 67, revenue: 185000 },
  //   { month: 'Jul', deals: 58, revenue: 172000 },
  //   { month: 'Aug', deals: 63, revenue: 178000 },
  //   { month: 'Sep', deals: 71, revenue: 195000 },
  //   { month: 'Oct', deals: 69, revenue: 188000 },
  //   { month: 'Nov', deals: 74, revenue: 205000 }
  // ];
  const currentYear = new Date().getFullYear();
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation-2">
          <p className="font-medium text-popover-foreground mb-2">
            {label} {currentYear}
          </p>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-sm text-popover-foreground">
                {payload?.[0]?.value} leads
              </span>
            </div>
            {/* <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-accent rounded-full"></div>
              <span className="text-sm text-popover-foreground">
                ${payload?.[0]?.payload?.revenue?.toLocaleString()} revenue
              </span>
            </div> */}
          </div>
        </div>
      );
    }
    return null;
  };
  // get monthly data

  const getMonthlyData = () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const year = new Date().getFullYear();

    return months.map((m, index) => ({
      label: m,
      value: leads.filter((l) => {
        const d = new Date(l.createdAt);
        return d.getFullYear() === year && d.getMonth() === index;
      }).length,
    }));
  };

  const getWeeklyData = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const weeks = [
      { label: "W1", start: 1, end: 7 },
      { label: "W2", start: 8, end: 14 },
      { label: "W3", start: 15, end: 21 },
      { label: "W4", start: 22, end: 28 },
      { label: "W5", start: 29, end: 31 },
    ];

    return weeks.map((w) => {
      const count = leads.filter((l) => {
        const d = new Date(l.createdAt);
        return (
          d.getFullYear() === year &&
          d.getMonth() === month &&
          d.getDate() >= w.start &&
          d.getDate() <= w.end
        );
      }).length;

      return {
        label: w.label,
        value: count,
      };
    });
  };

  const getDailyData = () => {
    return [...Array(7)].map((_, i) => {
      const day = new Date();
      day.setDate(day.getDate() - (6 - i));

      return {
        label: day.toLocaleDateString("en-IN", { weekday: "short" }),
        value: leads.filter(
          (l) => new Date(l.createdAt).toDateString() === day.toDateString(),
        ).length,
      };
    });
  };
  const chartData = (() => {
    switch (viewType) {
      case "weekly":
        return getWeeklyData();
      case "daily":
        return getDailyData();
      default:
        return getMonthlyData();
    }
  })();

  return (
    <motion.div
      className="bg-card border border-border rounded-xl p-6 shadow-elevation-1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">
            Pipeline Performance
          </h3>
          <p className="text-sm text-muted-foreground">
            Monthly deals closed and revenue generated
          </p>
        </div>
        {/* <div className="flex items-center space-x-2">
          <Button
            variant={selectedYear === 2023 ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedYear(2023)}
          >
            2023
          </Button>
          <Button
            variant={selectedYear === 2024 ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedYear(2024)}
          >
            2024
          </Button>
          <Button
            variant={selectedYear === 2025 ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedYear(2025)}
          >
            2025
          </Button>
        </div> */}
        <div className="flex items-center space-x-2">
          {["monthly", "weekly", "daily"].map((type) => (
            <Button
              key={type}
              size="sm"
              variant={viewType === type ? "default" : "outline"}
              onClick={() => setViewType(type)}
              className="capitalize"
            >
              {type}
            </Button>
          ))}
        </div>
      </div>
      <div className="h-80" aria-label="Monthly Pipeline Performance Bar Chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="label"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="value"
              fill="var(--color-primary)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-border">
        {/* <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <span className="text-sm text-muted-foreground">Leads</span>
        </div> */}
        <div className="flex items-center space-x-2">
          <Icon name="Target" size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
           Leads : {currentYearLeads} / Year
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default PipelineChart;
