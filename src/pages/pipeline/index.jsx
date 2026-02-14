import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Header from "../../components/ui/Header";
import Sidebar from "../../components/ui/Sidebar";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import PipelineColumn from "./components/PipelineColumn";
import PipelineFilters from "./components/PipelineFilters";
import AddDealModal from "./components/AddDealModal";
import PipelineStats from "./components/PipelineStats";
import { fetchLeads } from "services/leads.service";

const Pipeline = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddDealModalOpen, setIsAddDealModalOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);
  const [deals, setDeals] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    owner: "all",
    priority: "all",
    dateRange: "all",
    minValue: 0,
    maxValue: 0,
    startDate: "",
    endDate: "",
  });
  useEffect(() => {
    const loadLeads = async () => {
      try {
        const data = await fetchLeads();
        setDeals(data.list || []);
        console.log(data.list);
      } catch (error) {
        console.log("failed to fetch data", error);
      }
    };
    loadLeads();
  }, []);

  // PipeLine Deals
  // return if deal is won or lose or inactive
  const pipeLineDeals = useMemo(() => {
    return deals.filter((deal) => {
      // remove closed/lost
      if (["won", "lost"].includes(deal?.stage)) return false;

      // if you add soft delete later
      if (deal?.isActive === false) return false;

      return true;
    });
  }, [deals]);
  // Mock data for pipeline stages
  const pipelineSections = [
    { id: "active_daily", name: "Active - Daily", color: "red" },
    { id: "active_two_week", name: "Active - Two Week", color: "yellow" },
    { id: "active_monthly", name: "Active - Monthly", color: "green" },
    { id: "scheduled", name: "Scheduled", color: "blue" },
    { id: "budget_issue", name: "Budget Issue", color: "orange" },
    { id: "stale", name: "Stale (30+ Days)", color: "gray" },
  ];

  useEffect(() => {
    setDeals(deals);
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  const handleAddDeal = (stageId = null) => {
    setSelectedStage(stageId);
    setIsAddDealModalOpen(true);
  };

  const handleSaveDeal = (newDeal) => {
    setDeals((prevDeals) => [...prevDeals, newDeal]);
  };

  const handleDealMove = (dealId, newStageId) => {
    setDeals((prevDeals) =>
      prevDeals?.map((deal) =>
        deal?.id === dealId
          ? { ...deal, stage: newStageId, updatedAt: new Date()?.toISOString() }
          : deal,
      ),
    );
  };

  const handleEditDeal = (deal) => {
    console.log("Edit deal:", deal);
    // Implement edit functionality
  };

  const handleDeleteDeal = (dealId) => {
    if (window.confirm("Are you sure you want to delete this deal?")) {
      setDeals((prevDeals) => prevDeals?.filter((deal) => deal?.id !== dealId));
    }
  };

  const handleCloneDeal = (deal) => {
    const clonedDeal = {
      ...deal,
      id: `deal-${Date.now()}`,
      title: `${deal?.title} (Copy)`,
      createdAt: new Date()?.toISOString(),
      updatedAt: new Date()?.toISOString(),
    };
    setDeals((prevDeals) => [...prevDeals, clonedDeal]);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      owner: "all",
      priority: "all",
      dateRange: "all",
      minValue: 0,
      maxValue: 0,
      startDate: "",
      endDate: "",
    });
  };



  // const filteredDeals = getFilteredDeals();
  const filteredDeals = useMemo(() => {
    return pipeLineDeals.filter((deal) => {
      // Search filter
      if (
        filters?.search &&
        !deal?.title?.toLowerCase()?.includes(filters?.search?.toLowerCase()) &&
        !deal?.accountName
          ?.toLowerCase()
          ?.includes(filters?.search?.toLowerCase())
      ) {
        return false;
      }

      // Owner filter
      if (
        filters?.owner &&
        filters?.owner !== "all" &&
        deal?.owner?.id !== filters?.owner
      ) {
        return false;
      }

      // Priority filter
      if (
        filters?.priority &&
        filters?.priority !== "all" &&
        deal?.priority !== filters?.priority
      ) {
        return false;
      }

      // Value range
      if (filters?.minValue && deal?.value < filters?.minValue) return false;
      if (filters?.maxValue && deal?.value > filters?.maxValue) return false;

      return true;
    });
  }, [pipeLineDeals, filters]);

  const getDealsBySection = (sectionId) => {
    return filteredDeals?.filter((deal) => classifyDeal(deal) === sectionId);
  };

  const classifyDeal = (deal) => {
    const now = new Date();
    const createdAt = new Date(deal.createdAt);
    const nextContact = deal?.cNextContact
      ? new Date(deal.cNextContact.replace(" ", "T"))
      : null;

    const diffCreatedDays = (now - createdAt) / (1000 * 60 * 60 * 24);

    // 1️⃣ Budget Issue (based on status)
    if (deal?.status === "Budget Issue") {
      return "budget_issue";
    }

    // 2️⃣ Active (upcoming next contact within 30 days)
    if (nextContact) {
      const diffDays = (nextContact - now) / (1000 * 60 * 60 * 24);

      if (diffDays >= 0 && diffDays <= 1) return "active_daily";
      if (diffDays > 1 && diffDays <= 14) return "active_two_week";
      if (diffDays > 14 && diffDays <= 30) return "active_monthly";
    }

    // 3️⃣ Scheduled (future but > 30 days)
    if (nextContact) {
      const diffDays = (nextContact - now) / (1000 * 60 * 60 * 24);

      if (diffDays > 30) return "scheduled";
    }

    // 4️⃣ Stale (older than 30 days & no active movement)
    if (diffCreatedDays > 30) {
      return "stale";
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        onMenuToggle={handleSidebarToggle}
        isSidebarOpen={isSidebarOpen}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
      <main className="lg:ml-64 pt-16">
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Sales Pipeline
              </h1>
              <p className="text-muted-foreground">
                Manage your deals through the sales process with drag-and-drop
                functionality
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                iconName="Download"
                iconPosition="left"
                iconSize={16}
              >
                Export Pipeline
              </Button>
              <Button
                variant="default"
                onClick={() => handleAddDeal()}
                iconName="Plus"
                iconPosition="left"
                iconSize={16}
              >
                Add Deal
              </Button>
            </div>
          </div>

          {/* Pipeline Stats */}
          <PipelineStats deals={filteredDeals} />

          {/* Filters */}
          <PipelineFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onResetFilters={handleResetFilters}
          />

          {/* Pipeline Board */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Icon name="Kanban" size={24} className="text-primary" />
                <div>
                  <h2 className="text-xl font-bold text-card-foreground">
                    Pipeline Board
                  </h2>
                  <p className="text-base font-medium text-foreground">
                    {filteredDeals?.length} deal
                    {filteredDeals?.length !== 1 ? "s" : ""} •
                    <span className="text-primary font-semibold ml-1">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 0,
                      })?.format(
                        filteredDeals?.reduce(
                          (sum, deal) => sum + deal?.value,
                          0,
                        ),
                      )}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Kanban Board with Horizontal Scroll */}
            <div className="overflow-x-auto">
              <div className="flex gap-6 min-h-[600px] w-max min-w-full">
                {pipelineSections?.map((stage) => (
                  <motion.div
                    key={stage?.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: pipelineSections?.indexOf(stage) * 0.1,
                    }}
                    className="flex-shrink-0 w-80 h-full"
                  >
                    <PipelineColumn
                      stage={stage}
                      deals={getDealsBySection(stage?.id)}
                      onDealMove={handleDealMove}
                      onAddDeal={handleAddDeal}
                      onEditDeal={handleEditDeal}
                      onDeleteDeal={handleDeleteDeal}
                      onCloneDeal={handleCloneDeal}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Pipeline View */}
          <div className="lg:hidden">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Icon name="Smartphone" size={24} className="text-primary" />
                <div>
                  <h3 className="text-lg font-bold text-card-foreground">
                    Mobile Pipeline View
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Switch to landscape mode or use a larger screen for the full
                    Kanban board experience.
                  </p>
                </div>
              </div>

              {/* Stage Tabs for Mobile */}
              <div className="space-y-4">
                {pipelineSections?.map((section) => {
                  const stageDeals = getDealsBySection(section?.id);
                  return (
                    <div
                      key={section?.id}
                      className="border border-border rounded-lg p-4 bg-muted/20"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-card-foreground text-base">
                          {section?.name}
                        </h4>
                        <span className="text-sm font-medium text-foreground bg-background px-2 py-1 rounded-full">
                          {stageDeals?.length} deal
                          {stageDeals?.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="text-base font-semibold text-primary">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          minimumFractionDigits: 0,
                        })?.format(
                          stageDeals?.reduce(
                            (sum, deal) => sum + deal?.value,
                            0,
                          ),
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Add Deal Modal */}
      <AddDealModal
        isOpen={isAddDealModalOpen}
        onClose={() => setIsAddDealModalOpen(false)}
        onSave={handleSaveDeal}
        initialStage={selectedStage}
      />
    </div>
  );
};

export default Pipeline;
