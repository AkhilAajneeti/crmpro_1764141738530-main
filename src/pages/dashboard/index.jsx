import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "../../components/ui/Header";
import Sidebar from "../../components/ui/Sidebar";
import KPICard from "./components/KPICard";
import PipelineChart from "./components/PipelineChart";
import RecentActivities from "./components/RecentActivities";
import RightRail from "./components/RightRail";
import { fetchLeads } from "services/leads.service";
import { fetchActivity } from "services/activity.service";
import MultiLineChart from "./components/MultiLineChart";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [leads, setLeads] = useState([]);
  const [activities, setActivities] = useState([]);

  // leads
  useEffect(() => {
    const loadLeads = async () => {
      try {
        const data = await fetchLeads();
        setLeads(data.list);
        console.log(data.list);
      } catch (error) {
        console.log("failed to fetch data", error);
      } finally {
      }
    };
    loadLeads();
  }, []);
// acctivity
  useEffect(() => {
    const loadActivity = async () => {
      try {
        const data = await fetchActivity();
        setActivities(data.list);
        console.log(data.list);
      } catch (error) {
        console.log("failed to fetch data", error);
      } finally {
      }
    };
    loadActivity();
  }, []);

  const isSameMonth = (date1, date2) => {
    const d1 = new Date(date1);
    return (
      d1.getMonth() === date2.getMonth() &&
      d1.getFullYear() === date2.getFullYear()
    );
  };

  const isToday = (date) => {
    const d = new Date(date);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  };

  const isYesterday = (date) => {
    const d = new Date(date);
    const y = new Date();
    y.setDate(y.getDate() - 1);
    return d.toDateString() === y.toDateString();
  };
  // calculate
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  // this month leads
  const thisMonthLead = leads.filter(
    (l) => l.createdAt && isSameMonth(l.createdAt, now),
  );

  // this last month
  const lastMonthLead = leads.filter((l) =>
    isSameMonth(l.createdAt, lastMonth),
  );
  // monthly growth
  const monthGrowth =
    lastMonthLead.lenght === 0
      ? 0
      : Math.round(
          ((thisMonthLead.length - lastMonthLead.length) /
            lastMonthLead.length) *
            100,
        );

  // today vs Yesterday
  const todayLead = leads.filter((l) => isToday(l.createdAt));

  const yesterdayLead = leads.filter((l) => isYesterday(l.createdAt));
  const todayDiff = todayLead.length - yesterdayLead.length;

  // interrested leads
  const interestedThisMonth = leads.filter(
    (l) => l.status === "Interested" && isSameMonth(l.createdAt, now),
  );

  const interestedLastMonth = leads.filter(
    (l) => l.status === "Interested" && isSameMonth(l.createdAt, lastMonth),
  );
  const interestedGrowth =
    interestedLastMonth.length === 0
      ? 0
      : Math.round(
          ((interestedThisMonth.length - interestedLastMonth.length) /
            interestedLastMonth.length) *
            100,
        );

  //
  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e?.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const kpiData = [
    {
      title: "This Month Leads",
      value: thisMonthLead.length,
      change: `${monthGrowth}%`,
      changeType: monthGrowth >= 0 ? "positive" : "negative",
      icon: "Users",
      iconBg: "bg-blue-100",
      iconColor: "#3B82F6",
      comparisonLabel: "last month",
    },
    {
      title: "Today Leads",
      value: todayLead.length,
      change: todayDiff >= 0 ? `+${todayDiff}` : `${todayDiff}`,
      changeType: todayDiff >= 0 ? "positive" : "negative",
      icon: "Calendar",
      iconBg: "bg-green-100",
      iconColor: "#10B981",
      comparisonLabel: "yesterday",
    },
    {
      title: "Interested Leads",
      value: interestedThisMonth.length,
      change: `${interestedGrowth}%`,
      changeType: interestedGrowth >= 0 ? "positive" : "negative",
      icon: "Star",
      iconBg: "bg-yellow-100",
      iconColor: "#F59E0B",
      comparisonLabel: "last month",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuToggle={handleMenuToggle} isSidebarOpen={isSidebarOpen} />
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
      <main className="lg:ml-64 pt-16">
        <div className="flex">
          {/* Main Content */}
          <div className="flex-1 p-4 lg:p-0 xl:pr-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Page Header */}
              <div className="m-6">
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                  Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Welcome back! Here's what's happening with your sales pipeline
                  today.
                </p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 m-5">
                {kpiData?.map((kpi, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <KPICard {...kpi} />
                  </motion.div>
                ))}
              </div>

              {/* Pipeline Chart */}
              <div className="m-5">
                <PipelineChart leads={leads} />
              </div>
              <div className="m-5">
                <MultiLineChart leads={leads} />
              </div>

              {/* Recent Activities */}
              <div className="m-5">
                <RecentActivities activities={activities} />
              </div>
            </motion.div>
          </div>

          {/* Right Rail */}
          <div className="hidden xl:block w-80 p-6 border-l border-border bg-background">
            <RightRail leads={leads}/>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
