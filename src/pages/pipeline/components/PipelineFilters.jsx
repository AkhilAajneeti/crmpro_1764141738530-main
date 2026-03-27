import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";

const PipelineFilters = ({ filters, onFiltersChange, onResetFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const status = [
    { value: "all", label: "All Categories" },
    { value: "active", label: "Active Opportunities" },
    { value: "scheduled", label: "Scheduled" },
    { value: "budget_issue", label: "Budget Issue" },
    { value: "stale", label: "Stale (30+ Days)" },
  ];

  const nextContactOptions = [
    { value: "all", label: "All Next Contacts" },
    { value: "today", label: "Due Today" },
    { value: "7days", label: "Next 7 Days" },
    { value: "14days", label: "Next 14 Days" },
    { value: "30days", label: "Next 30 Days" },
    { value: "overdue", label: "Overdue" },
  ];

  const ageOptions = [
    { value: "all", label: "All Ages" },
    { value: "0-7", label: "0–7 Days" },
    { value: "7-30", label: "7–30 Days" },
    { value: "30+", label: "30+ Days" },
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;

    if (filters?.health && filters?.health !== "all") count++;
    if (filters?.nextContact && filters?.nextContact !== "all") count++;
    if (filters?.leadAge && filters?.leadAge !== "all") count++;
    if (filters?.search && filters?.search?.trim()) count++;

    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} className="text-muted-foreground" />
          <h3 className="font-medium text-card-foreground">Pipeline Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              iconName="X"
              iconPosition="left"
              iconSize={14}
            >
              Clear All
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden"
            aria-label={isExpanded ? "Collapse filters" : "Expand filters"}
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
          </Button>
        </div>
      </div>
      {/* Filters Content */}
      <div className={`space-y-4 ${isExpanded ? "block" : "hidden lg:block"}`}>
        {/* Search and Quick Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            placeholder="Lead Category"
            options={healthOptions}
            value={filters?.health || "all"}
            onChange={(value) => handleFilterChange("health", value)}
          />

          <Select
            placeholder="Next Contact"
            options={nextContactOptions}
            value={filters?.nextContact || "all"}
            onChange={(value) => handleFilterChange("nextContact", value)}
          />

          <Select
            placeholder="Lead Age"
            options={ageOptions}
            value={filters?.leadAge || "all"}
            onChange={(value) => handleFilterChange("leadAge", value)}
          />
        </div>

        {/* Custom Date Range */}
        {filters?.dateRange === "custom" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <Input
              type="date"
              label="Start Date"
              value={filters?.startDate || ""}
              onChange={(e) =>
                handleFilterChange("startDate", e?.target?.value)
              }
            />

            <Input
              type="date"
              label="End Date"
              value={filters?.endDate || ""}
              onChange={(e) => handleFilterChange("endDate", e?.target?.value)}
            />
          </div>
        )}

        {/* Filter Summary */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
            {filters?.search && (
              <span className="inline-flex items-center px-3 py-1 text-sm bg-accent text-accent-foreground rounded-full">
                Search: "{filters?.search}"
                <button
                  onClick={() => handleFilterChange("search", "")}
                  className="ml-2 hover:text-accent-foreground/80"
                  aria-label="Remove search filter"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}

            {filters?.owner && filters?.owner !== "all" && (
              <span className="inline-flex items-center px-3 py-1 text-sm bg-accent text-accent-foreground rounded-full">
                Owner:{" "}
                {ownerOptions?.find((o) => o?.value === filters?.owner)?.label}
                <button
                  onClick={() => handleFilterChange("owner", "all")}
                  className="ml-2 hover:text-accent-foreground/80"
                  aria-label="Remove owner filter"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}

            {filters?.priority && filters?.priority !== "all" && (
              <span className="inline-flex items-center px-3 py-1 text-sm bg-accent text-accent-foreground rounded-full">
                Priority: {filters?.priority}
                <button
                  onClick={() => handleFilterChange("priority", "all")}
                  className="ml-2 hover:text-accent-foreground/80"
                  aria-label="Remove priority filter"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PipelineFilters;
